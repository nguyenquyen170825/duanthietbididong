package com.phonehub.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;
//import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "thanhtoan")
@Data
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "MaDonHang", nullable = false)
    private String orderCode;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "NgayThanhToan")
    private Date orderDate = new Date();

    @Column(name = "TongTien", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "TrangThai", nullable = false, length = 100)
    private String orderStatus; 

    @Column(name = "PhuongThucThanhToan", nullable = false, length = 100)
    private String paymentMethod = "COD";

    @Column(name = "PhieuGiamGiaId")
    private Long discountId;

    @Column(name = "SoTienGiam", precision = 18, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "HoTen", nullable = false)
    private String fullName;

    @Column(name = "SoDienThoai", nullable = false, length = 20)
    private String phone;

    @Column(name = "Email", nullable = false)
    private String email;

    @Column(name = "TinhThanh", nullable = false)
    private String province = "N/A";

    @Column(name = "QuanHuyen", nullable = false)
    private String district = "N/A";

    @Column(name = "PhuongXa", nullable = false)
    private String ward = "N/A";

    @Column(name = "DiaChiChiTiet", columnDefinition = "TEXT", nullable = false)
    private String shippingAddress;

    @Column(name = "GhiChu", columnDefinition = "TEXT")
    private String note;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetail> orderDetails = new ArrayList<>();
}
