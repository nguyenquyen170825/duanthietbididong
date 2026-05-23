package com.phonehub.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "chitietthanhtoan")
@Data
@NoArgsConstructor
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ThanhToanId", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "SanPhamId", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "BienTheId")
    private ProductVariant productVariant;

    @Column(name = "TenSanPham", nullable = false)
    private String productName;

    @Column(name = "SoLuong", nullable = false)
    private Integer quantity;

    @Column(name = "DonGia", nullable = false, precision = 18, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "TenBaoHanh")
    private String warrantyName;

    @Column(name = "GiaBaoHanh", precision = 18, scale = 2)
    private BigDecimal warrantyPrice;
}
