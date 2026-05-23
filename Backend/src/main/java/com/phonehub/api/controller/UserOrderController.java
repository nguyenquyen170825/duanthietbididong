package com.phonehub.api.controller;

import com.phonehub.api.model.Order;
import com.phonehub.api.model.OrderDetail;
import com.phonehub.api.model.User;
import com.phonehub.api.model.Product;
import com.phonehub.api.repository.OrderRepository;
import com.phonehub.api.repository.UserRepository;
import com.phonehub.api.repository.ProductRepository;
import com.phonehub.api.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user/orders")
public class UserOrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Đặt hàng mới
     */
    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request) {
        try {
            User user = getCurrentUser();
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Lỗi: Người dùng không tồn tại!"));
            }

            Order order = new Order();
            order.setUser(user);
            order.setOrderDate(new Date());
            order.setOrderStatus("Chờ xác nhận");

            // Sử dụng thông tin từ form checkout
            order.setFullName(request.getFullName() != null ? request.getFullName() :
                    (user.getFullName() != null ? user.getFullName() : user.getEmail()));
            order.setEmail(request.getEmail() != null ? request.getEmail() : user.getEmail());
            order.setPhone(request.getPhone() != null ? request.getPhone() : "");
            order.setShippingAddress(request.getAddress() != null ? request.getAddress() : "");
            order.setProvince(request.getProvince() != null ? request.getProvince() : "N/A");
            order.setDistrict(request.getDistrict() != null ? request.getDistrict() : "N/A");
            order.setWard(request.getWard() != null ? request.getWard() : "N/A");

            // Payment & discount
            order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD");
            order.setOrderCode("DH" + System.currentTimeMillis());

            BigDecimal totalAmount = BigDecimal.ZERO;
            try {
                totalAmount = new BigDecimal(request.getTotalAmount());
            } catch (Exception e) {
                // Fallback: tính lại từ items
            }
            order.setTotalAmount(totalAmount);

            BigDecimal discount = BigDecimal.ZERO;
            if (request.getDiscountAmount() != null && !request.getDiscountAmount().isEmpty()) {
                try {
                    discount = new BigDecimal(request.getDiscountAmount());
                } catch (Exception ignored) {}
            }
            order.setDiscountAmount(discount);

            // Note
            order.setNote(request.getNote());

            // Order details
            if (request.getItems() != null) {
                for (OrderItemRequest item : request.getItems()) {
                    if (item.getProductId() == null) continue;

                    Product product = productRepository.findById(item.getProductId()).orElse(null);
                    if (product == null) {
                        continue;
                    }

                    OrderDetail detail = new OrderDetail();
                    detail.setQuantity(item.getQuantity() != null ? item.getQuantity() : 1);

                    BigDecimal unitPrice = BigDecimal.ZERO;
                    try {
                        unitPrice = new BigDecimal(item.getPrice());
                    } catch (Exception e) {
                        // Fallback to product price
                        if (product.getProductVariants() != null && !product.getProductVariants().isEmpty()) {
                            unitPrice = product.getProductVariants().get(0).getPrice();
                        }
                    }
                    detail.setUnitPrice(unitPrice);
                    detail.setProduct(product);
                    detail.setProductName(product.getTitle());

                    if (product.getProductVariants() != null && !product.getProductVariants().isEmpty()) {
                        detail.setProductVariant(product.getProductVariants().get(0));
                    }

                    detail.setOrder(order);
                    order.getOrderDetails().add(detail);
                }
            }

            // Recalculate total if it was zero but items exist
            if (order.getTotalAmount().compareTo(BigDecimal.ZERO) == 0 && !order.getOrderDetails().isEmpty()) {
                BigDecimal recalculated = order.getOrderDetails().stream()
                        .map(d -> d.getUnitPrice().multiply(BigDecimal.valueOf(d.getQuantity())))
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                order.setTotalAmount(recalculated);
            }

            Order savedOrder = orderRepository.save(order);

            // Tự động tạo thông báo cho user
            try {
                notificationService.createOrderNotification(savedOrder, "", "Chờ xác nhận");
            } catch (Exception e) {
                System.err.println("Lỗi tạo thông báo đơn hàng mới: " + e.getMessage());
            }

            return ResponseEntity.ok(Map.of(
                    "message", "Đặt hàng thành công!",
                    "orderId", savedOrder.getId(),
                    "orderCode", savedOrder.getOrderCode()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.toString();
            return ResponseEntity.internalServerError().body(Map.of(
                    "message", "Lỗi khi đặt hàng: " + errorMsg
            ));
        }
    }

    // ========== Helper ==========

    private User getCurrentUser() {
        String email = "";
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        return userRepository.findByEmail(email).orElse(null);
    }

    // ========== Request DTOs ==========

    public static class OrderRequest {
        private String fullName;
        private String email;
        private String address;
        private String phone;
        private String province;
        private String district;
        private String ward;
        private String paymentMethod;
        private String totalAmount;
        private String discountAmount;
        private String voucherCode;
        private String note;
        private List<OrderItemRequest> items;

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getProvince() { return province; }
        public void setProvince(String province) { this.province = province; }
        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }
        public String getWard() { return ward; }
        public void setWard(String ward) { this.ward = ward; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
        public String getTotalAmount() { return totalAmount; }
        public void setTotalAmount(String totalAmount) { this.totalAmount = totalAmount; }
        public String getDiscountAmount() { return discountAmount; }
        public void setDiscountAmount(String discountAmount) { this.discountAmount = discountAmount; }
        public String getVoucherCode() { return voucherCode; }
        public void setVoucherCode(String voucherCode) { this.voucherCode = voucherCode; }
        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }
        public List<OrderItemRequest> getItems() { return items; }
        public void setItems(List<OrderItemRequest> items) { this.items = items; }
    }

    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
        private String price;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public String getPrice() { return price; }
        public void setPrice(String price) { this.price = price; }
    }
}

