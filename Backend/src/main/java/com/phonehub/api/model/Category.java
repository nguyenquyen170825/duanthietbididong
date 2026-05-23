package com.phonehub.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "danhmuc")
@Data
@NoArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaDanhMuc")
    private Long id;

    @Column(name = "TenDanhMuc", nullable = false, unique = true)
    private String name;

    @Transient
    private String description;

    @Column(name = "TrangThai", nullable = false)
    private Boolean status = true;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "NgayTao", nullable = false)
    private Date createdAt = new Date();

    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Product> products = new ArrayList<>();
}
