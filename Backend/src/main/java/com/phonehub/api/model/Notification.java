package com.phonehub.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "thongbao")
@Data
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "UserId", nullable = true)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "OrderId", nullable = true)
    private Order order;

    @Column(name = "Loai", nullable = false, length = 50)
    private String type; // ORDER, PROMO, SYSTEM

    @Column(name = "TieuDe", nullable = false)
    private String title;

    @Column(name = "NoiDung", columnDefinition = "TEXT")
    private String content;

    @Column(name = "DaDoc", nullable = false)
    private Boolean isRead = false;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "NgayTao", nullable = false)
    private Date createdAt = new Date();
}
