package com.phonehub.api.controller;

import com.phonehub.api.model.Notification;
import com.phonehub.api.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/notifications")
public class AdminNotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * Admin gửi thông báo khuyến mãi cho tất cả user
     * Body: { "title": "...", "content": "..." }
     */
    @PostMapping("/promo")
    public ResponseEntity<?> sendPromoNotification(@RequestBody Map<String, String> body) {
        String title = body.get("title");
        String content = body.get("content");

        if (title == null || title.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Tiêu đề không được để trống"));
        }
        if (content == null || content.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nội dung không được để trống"));
        }

        Notification notification = notificationService.createPromoNotification(title, content);
        return ResponseEntity.ok(Map.of(
                "message", "Đã gửi thông báo khuyến mãi thành công",
                "notification", notification
        ));
    }

    /**
     * Admin gửi thông báo hệ thống cho tất cả user
     * Body: { "title": "...", "content": "..." }
     */
    @PostMapping("/system")
    public ResponseEntity<?> sendSystemNotification(@RequestBody Map<String, String> body) {
        String title = body.get("title");
        String content = body.get("content");

        if (title == null || title.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Tiêu đề không được để trống"));
        }
        if (content == null || content.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nội dung không được để trống"));
        }

        Notification notification = notificationService.createSystemNotification(title, content);
        return ResponseEntity.ok(Map.of(
                "message", "Đã gửi thông báo hệ thống thành công",
                "notification", notification
        ));
    }

    /**
     * Admin xem tất cả thông báo đã gửi
     */
    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }
}
