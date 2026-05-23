package com.phonehub.api.controller;

import com.phonehub.api.model.Order;
import com.phonehub.api.repository.OrderRepository;
import com.phonehub.api.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        String newStatus = body.get("status");
        if (newStatus != null) {
            String oldStatus = order.getOrderStatus();
            order.setOrderStatus(newStatus);
            Order savedOrder = orderRepository.save(order);

            // Tự động tạo thông báo cho user chủ đơn hàng
            try {
                notificationService.createOrderNotification(savedOrder, oldStatus, newStatus);
            } catch (Exception e) {
                // Log lỗi nhưng không ảnh hưởng việc cập nhật đơn hàng
                System.err.println("Lỗi tạo thông báo: " + e.getMessage());
            }

            return ResponseEntity.ok(savedOrder);
        }
        return ResponseEntity.ok(orderRepository.save(order));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        if (!orderRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        orderRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
