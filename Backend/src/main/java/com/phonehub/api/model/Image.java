package com.phonehub.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "hinhanh")
@Data
@NoArgsConstructor
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HinhAnhId")
    private Long id;

    @Column(name = "UrlHinhAnh", nullable = false, columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "LaAnhChinh", nullable = false)
    private Boolean isMain = false;

    @Column(name = "AnhIcon", columnDefinition = "TEXT")
    private String iconUrl;

    @Column(name = "ThuTu", nullable = false)
    private Integer sortOrder = 0;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "NgayTao", nullable = false)
    private Date createdAt = new Date();

    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BienTheId", nullable = false)
    private ProductVariant productVariant;
}
