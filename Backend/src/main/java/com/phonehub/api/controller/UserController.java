package com.phonehub.api.controller;

import com.phonehub.api.model.Order;
import com.phonehub.api.model.OrderDetail;
import com.phonehub.api.model.User;
import com.phonehub.api.repository.OrderRepository;
import com.phonehub.api.repository.UserRepository;
import com.phonehub.api.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // Lấy thông tin tài khoản hiện tại
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        String email = getEmailFromContext();
        if (email == null) return ResponseEntity.status(401).body("Unauthorized");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName() != null ? user.getFullName() : "");
        response.put("phone", user.getPhone() != null ? user.getPhone() : "");
        response.put("role", user.getRole() != null ? user.getRole() : "ROLE_USER");
        response.put("hang", user.getHang() != null ? user.getHang() : "Dong");
        response.put("tongTienDaMua", user.getTongTienDaMua() != null ? user.getTongTienDaMua() : 0);

        return ResponseEntity.ok(response);
    }

    // Cập nhật thông tin cá nhân
    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody Map<String, String> body) {
        String email = getEmailFromContext();
        if (email == null) return ResponseEntity.status(401).body("Unauthorized");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        if (body.containsKey("fullName")) user.setFullName(body.get("fullName"));
        if (body.containsKey("phone")) user.setPhone(body.get("phone"));

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "message", "Cập nhật thông tin thành công",
            "fullName", user.getFullName() != null ? user.getFullName() : "",
            "phone", user.getPhone() != null ? user.getPhone() : ""
        ));
    }

    // Lấy danh sách đơn hàng của user hiện tại
    @GetMapping("/orders")
    public ResponseEntity<?> getMyOrders() {
        String email = getEmailFromContext();
        if (email == null) return ResponseEntity.status(401).body("Unauthorized");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        List<Order> orders = orderRepository.findByUserId(user.getId());

        // Sort newest first
        orders.sort((a, b) -> {
            if (a.getOrderDate() == null && b.getOrderDate() == null) return 0;
            if (a.getOrderDate() == null) return 1;
            if (b.getOrderDate() == null) return -1;
            return b.getOrderDate().compareTo(a.getOrderDate());
        });

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

        List<Map<String, Object>> result = orders.stream().map(order -> {
            Map<String, Object> orderMap = new LinkedHashMap<>();
            orderMap.put("id", order.getOrderCode() != null ? order.getOrderCode() : "DH" + order.getId());
            orderMap.put("orderId", order.getId());
            orderMap.put("createdAt", order.getOrderDate() != null ? sdf.format(order.getOrderDate()) : "");
            orderMap.put("status", mapStatus(order.getOrderStatus()));
            orderMap.put("totalAmount", order.getTotalAmount() != null ? order.getTotalAmount() : 0);
            orderMap.put("address", order.getShippingAddress() != null ? order.getShippingAddress() : "");
            orderMap.put("phone", order.getPhone() != null ? order.getPhone() : "");
            orderMap.put("paymentMethod", order.getPaymentMethod() != null ? order.getPaymentMethod() : "COD");

            // Build items
            List<Map<String, Object>> items = new ArrayList<>();
            if (order.getOrderDetails() != null) {
                for (OrderDetail detail : order.getOrderDetails()) {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", detail.getId());
                    item.put("title", detail.getProductName() != null ? detail.getProductName() : "Sản phẩm");
                    item.put("quantity", detail.getQuantity());
                    item.put("price", detail.getUnitPrice() != null ? detail.getUnitPrice() : 0);
                    // Product image
                    String imageUrl = "";
                    if (detail.getProduct() != null 
                        && detail.getProduct().getImages() != null 
                        && !detail.getProduct().getImages().isEmpty()) {
                        var img = detail.getProduct().getImages().get(0);
                        imageUrl = img.getImageUrl() != null ? img.getImageUrl() : "";
                    }
                    item.put("imageUrl", imageUrl);
                    items.add(item);
                }
            }
            orderMap.put("items", items);
            return orderMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    private String mapStatus(String status) {
        if (status == null) return "Đang xử lý";
        switch (status.toLowerCase()) {
            case "pending cod":
            case "pending":
            case "cho xac nhan":
                return "Đang xử lý";
            case "shipping":
            case "dang giao":
                return "Đang giao";
            case "completed":
            case "hoan thanh":
            case "delivered":
                return "Hoàn thành";
            case "cancelled":
            case "da huy":
                return "Đã hủy";
            default:
                return status;
        }
    }

    private String getEmailFromContext() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            return (String) principal;
        }
        return null;
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String email = getEmailFromContext();
        if (email == null) return ResponseEntity.status(401).body(Map.of("message", "Chưa xác thực"));

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy người dùng"));

        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        if (oldPassword == null || newPassword == null || oldPassword.trim().isEmpty() || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập mật khẩu cũ và mới!"));
        }

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mật khẩu cũ không chính xác!"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Gửi email xác nhận đổi mật khẩu thành công
        try {
            emailService.sendPasswordChangedEmail(user.getEmail(), user.getFullName());
        } catch (Exception e) {
            System.err.println("Không gửi được email thông báo đổi mật khẩu: " + e.getMessage());
        }

        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công!"));
    }

    // Tra cứu gói bảo hành qua mã SKU (chỉ kiểm tra nếu khách đã mua)
    @GetMapping("/warranty")
    public ResponseEntity<?> checkWarranty(@RequestParam String sku) {
        String email = getEmailFromContext();
        if (email == null) return ResponseEntity.status(401).body(Map.of("message", "Chưa xác thực"));

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy người dùng"));

        List<Order> orders = orderRepository.findByUserId(user.getId());
        for (Order order : orders) {
            // Bỏ qua các đơn hàng đã bị hủy
            if (order.getOrderStatus() != null && 
               (order.getOrderStatus().toLowerCase().contains("huy") || order.getOrderStatus().toLowerCase().contains("cancel"))) {
                continue;
            }

            if (order.getOrderDetails() != null) {
                for (OrderDetail detail : order.getOrderDetails()) {
                    if (detail.getProductVariant() != null && sku.equalsIgnoreCase(detail.getProductVariant().getSku())) {
                        Map<String, Object> result = new LinkedHashMap<>();
                        result.put("orderCode", order.getOrderCode() != null ? order.getOrderCode() : "DH" + order.getId());
                        result.put("orderDate", order.getOrderDate());
                        result.put("productName", detail.getProductName());
                        result.put("warrantyName", detail.getWarrantyName() != null && !detail.getWarrantyName().isBlank() ? detail.getWarrantyName() : "Gói bảo hành tiêu chuẩn (12 tháng)");
                        result.put("warrantyPrice", detail.getWarrantyPrice());
                        
                        return ResponseEntity.ok(result);
                    }
                }
            }
        }

        return ResponseEntity.status(404).body(Map.of("message", "Sản phẩm này chưa được mua hoặc mã SKU không đúng."));
    }
}
