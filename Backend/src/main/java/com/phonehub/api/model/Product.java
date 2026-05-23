package com.phonehub.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sanpham")
@Data
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SanPhamId")
    private Long id;

    @Column(name = "TenSanPham", nullable = false)
    private String title;
    
    @Transient
    private String subtitle;
    
    @Transient
    private String price; 
    
    @Transient
    private String rating;
    
    @Column(name = "ThuongHieu", nullable = false)
    private String brand; 
    
    @Transient
    private Boolean isSale;

    @org.hibernate.annotations.Formula("(SELECT COALESCE(SUM(od.SoLuong), 0) FROM chitietthanhtoan od JOIN thanhtoan t ON od.ThanhToanId = t.Id WHERE od.SanPhamId = SanPhamId AND t.TrangThai NOT IN ('CANCELLED', 'Đã hủy'))")
    private Integer quantitySold;

    @Column(name = "TrangThai", nullable = false)
    private Boolean status = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "MaDanhMuc", nullable = false)
    private Category category;

    @Column(name = "MoTa", columnDefinition = "TEXT")
    private String description;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "NgayTao", nullable = false)
    private Date createdAt = new Date();

    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> productVariants = new ArrayList<>();

    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TechnicalSpecification> technicalSpecifications = new ArrayList<>();

    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    @Transient
    private List<Image> images = new ArrayList<>();

    // Custom Getters for Transient fields to maintain compatibility with React Native frontend
    public String getPrice() {
        if (this.price != null && !this.price.isEmpty()) {
            return this.price;
        }
        if (productVariants != null && !productVariants.isEmpty()) {
            return productVariants.get(0).getPrice().toString();
        }
        return "0";
    }

    public String getSubtitle() {
        if (this.subtitle != null && !this.subtitle.isEmpty()) {
            return this.subtitle;
        }
        return this.description != null && this.description.length() > 50 
                ? this.description.substring(0, 50) + "..." 
                : this.description;
    }

    public String getRating() {
        if (this.rating != null && !this.rating.isEmpty()) {
            return this.rating;
        }
        return "5.0";
    }

    public Boolean getIsSale() {
        if (this.isSale != null) {
            return this.isSale;
        }
        if (productVariants != null) {
            for (ProductVariant pv : productVariants) {
                if (pv.getOldPrice() != null && pv.getPrice() != null && pv.getOldPrice().compareTo(pv.getPrice()) > 0) {
                    return true;
                }
            }
        }
        return false;
    }

    public List<Image> getImages() {
        List<Image> allImages = new ArrayList<>();
        if (productVariants != null) {
            for (ProductVariant pv : productVariants) {
                if (pv.getImages() != null) {
                    allImages.addAll(pv.getImages());
                }
            }
        }
        return allImages;
    }
}
