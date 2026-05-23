package com.phonehub.api.service;

import com.phonehub.api.model.Notification;
import com.phonehub.api.model.Order;
import com.phonehub.api.model.User;
import com.phonehub.api.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Tạo thông báo khi trạng thái đơn hàng thay đổi
     * Gửi cho user chủ đơn hàng
     * Chạy trong transaction riêng để không ảnh hưởng đến order
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Notification createOrderNotification(Order order, String oldStatus, String newStatus) {
        Notification notification = new Notification();
        notification.setUser(order.getUser());
        notification.setOrder(order);
        notification.setType("ORDER");
        notification.setTitle(buildOrderTitle(newStatus));
        notification.setContent(buildOrderContent(order, oldStatus, newStatus));
        notification.setIsRead(false);
        notification.setCreatedAt(new Date());

        return notificationRepository.save(notification);
    }

    /**
     * Admin tạo thông báo khuyến mãi gửi tất cả user
     * userId = null → broadcast
     */
    public Notification createPromoNotification(String title, String content) {
        Notification notification = new Notification();
        notification.setUser(null);  // null = gửi tất cả
        notification.setOrder(null);
        notification.setType("PROMO");
        notification.setTitle(title);
        notification.setContent(content);
        notification.setIsRead(false);
        notification.setCreatedAt(new Date());

        return notificationRepository.save(notification);
    }

    /**
     * Admin tạo thông báo hệ thống gửi tất cả user
     */
    public Notification createSystemNotification(String title, String content) {
        Notification notification = new Notification();
        notification.setUser(null);
        notification.setOrder(null);
        notification.setType("SYSTEM");
        notification.setTitle(title);
        notification.setContent(content);
        notification.setIsRead(false);
        notification.setCreatedAt(new Date());

        return notificationRepository.save(notification);
    }

    /**
     * Lấy tất cả thông báo cho 1 user (riêng + chung)
     */
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findAllForUser(userId);
    }

    /**
     * Lấy tất cả thông báo (admin xem)
     */
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    /**
     * Đánh dấu 1 thông báo đã đọc
     */
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    /**
     * Đánh dấu tất cả thông báo của user đã đọc
     */
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }

    /**
     * Đếm số thông báo chưa đọc
     */
    public long getUnreadCount(Long userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }

    // ========== Helper methods ==========

    private String buildOrderTitle(String newStatus) {
        switch (newStatus.toLowerCase()) {
            case "chờ xác nhận":
                return "🛒 Đặt hàng thành công";
            case "confirmed":
            case "đã xác nhận":
                return "✅ Đơn hàng đã được xác nhận";
            case "shipping":
            case "đang giao":
            case "đang giao hàng":
                return "🚚 Đơn hàng đang được giao";
            case "delivered":
            case "đã giao":
            case "đã giao hàng":
            case "giao hàng thành công":
                return "📦 Giao hàng thành công";
            case "cancelled":
            case "đã hủy":
            case "hủy":
                return "❌ Đơn hàng đã bị hủy";
            case "từ chối":
            case "từ chối yêu cầu":
            case "bị từ chối":
                return "⛔ Đơn hàng đã bị từ chối";
            case "processing":
            case "đang xử lý":
                return "⏳ Đơn hàng đang được xử lý";
            default:
                return "📋 Cập nhật đơn hàng";
        }
    }

    private String buildOrderContent(Order order, String oldStatus, String newStatus) {
        if (oldStatus == null || oldStatus.isEmpty()) {
            return String.format(
                    "Đơn hàng %s đã được đặt thành công. Tổng tiền: %s đ. Chúng tôi sẽ xác nhận đơn hàng sớm nhất!",
                    order.getOrderCode(),
                    order.getTotalAmount().toPlainString()
            );
        }
        if (newStatus.equalsIgnoreCase("Từ chối yêu cầu") || newStatus.equalsIgnoreCase("Từ chối") || newStatus.equalsIgnoreCase("Bị từ chối")) {
            return String.format(
                    "Rất tiếc, đơn hàng %s của bạn đã bị từ chối yêu cầu. Tổng tiền: %s đ. Vui lòng liên hệ hỗ trợ để biết thêm chi tiết.",
                    order.getOrderCode(),
                    order.getTotalAmount().toPlainString()
            );
        }

        return String.format(
                "Đơn hàng %s của bạn đã được cập nhật trạng thái từ \"%s\" sang \"%s\". Tổng tiền: %s đ.",
                order.getOrderCode(),
                oldStatus,
                newStatus,
                order.getTotalAmount().toPlainString()
        );
    }
}
