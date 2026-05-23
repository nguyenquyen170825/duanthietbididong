package com.phonehub.api.controller;

import com.phonehub.api.model.Notification;
import com.phonehub.api.model.User;
import com.phonehub.api.repository.UserRepository;
import com.phonehub.api.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user/notifications")
public class UserNotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Lấy danh sách thông báo của user hiện tại (riêng + chung)
     */
    @GetMapping
    public ResponseEntity<?> getMyNotifications() {
        User user = getCurrentUser();
        if (user == null) {
            return ResponseEntity.badRequest().body("Người dùng không tồn tại");
        }
        List<Notification> notifications = notificationService.getUserNotifications(user.getId());
        return ResponseEntity.ok(notifications);
    }

    /**
     * Đếm số thông báo chưa đọc
     */
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount() {
        User user = getCurrentUser();
        if (user == null) {
            return ResponseEntity.badRequest().body("Người dùng không tồn tại");
        }
        long count = notificationService.getUnreadCount(user.getId());
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    /**
     * Đánh dấu 1 thông báo đã đọc
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            Notification notification = notificationService.markAsRead(id);
            return ResponseEntity.ok(notification);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Đánh dấu tất cả thông báo đã đọc
     */
    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        User user = getCurrentUser();
        if (user == null) {
            return ResponseEntity.badRequest().body("Người dùng không tồn tại");
        }
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(Map.of("message", "Đã đánh dấu tất cả đã đọc"));
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
}
