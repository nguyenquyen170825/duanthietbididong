package com.phonehub.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "thongsokythuat")
@Data
@NoArgsConstructor
public class TechnicalSpecification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "TenThongSo", nullable = false)
    private String specName;

    @Column(name = "GiaTri", columnDefinition = "TEXT", nullable = false)
    private String specValue;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SanPhamId", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "LoaiThongSoId", nullable = false)
    private LoaiThongSo loaiThongSo;
}
