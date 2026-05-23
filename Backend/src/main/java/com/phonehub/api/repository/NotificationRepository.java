package com.phonehub.api.repository;

import com.phonehub.api.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Lấy thông báo riêng của user (đơn hàng, hệ thống)
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Lấy thông báo chung (khuyến mãi gửi tất cả - userId IS NULL)
    List<Notification> findByUserIsNullOrderByCreatedAtDesc();

    // Lấy tất cả thông báo cho 1 user (riêng + chung)
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId OR n.user IS NULL ORDER BY n.createdAt DESC")
    List<Notification> findAllForUser(@Param("userId") Long userId);

    // Đếm thông báo chưa đọc cho user (chỉ đếm thông báo riêng)
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.isRead = false")
    long countUnreadByUserId(@Param("userId") Long userId);

    // Đếm thông báo chung chưa đọc (dùng kết hợp phía service)
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user IS NULL AND n.isRead = false")
    long countUnreadBroadcast();

    // Đánh dấu tất cả đã đọc cho user
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId AND n.isRead = false")
    void markAllAsReadByUserId(@Param("userId") Long userId);
}
