package com.phonehub.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "bienthesanpham")
@Data
@NoArgsConstructor
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BienTheId")
    private Long id;

    @Column(name = "Sku", length = 255)
    private String sku;

    @Column(name = "Gia", nullable = false, precision = 18, scale = 2)
    private BigDecimal price;

    @Column(name = "SoLuongTon", nullable = false)
    private Integer stockQuantity = 0;

    @Column(name = "Mau", nullable = false, length = 100)
    private String color;

    @Column(name = "DungLuong", nullable = false, length = 100)
    private String capacity;

    @Column(name = "Ram", length = 100)
    private String ram;

    @Column(name = "GiaCu", precision = 18, scale = 2)
    private BigDecimal oldPrice;

    @Column(name = "GiamGia", precision = 18, scale = 2)
    private BigDecimal discount;

    @Column(name = "TrangThai", nullable = false)
    private Boolean status = true;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "NgayTao", nullable = false)
    private Date createdAt = new Date();

    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SanPhamId", nullable = false)
    private Product product;

    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "productVariant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images = new ArrayList<>();
}
