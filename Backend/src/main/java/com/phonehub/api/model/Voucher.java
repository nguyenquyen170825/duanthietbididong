package com.phonehub.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "phieugiamgia")
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "Ma", nullable = false, unique = true)
    private String ma;

    @Column(name = "GiaTriGiam", nullable = false)
    private BigDecimal giaTriGiam;

    @Column(name = "LoaiGiam", nullable = false)
    private String loaiGiam;

    @Column(name = "DonHangToiThieu")
    private BigDecimal donHangToiThieu;

    @Column(name = "GiamToiDa")
    private BigDecimal giamToiDa;

    @Column(name = "SoLuong", nullable = false)
    private Integer soLuong;

    @Column(name = "DaSuDung", nullable = false)
    private Integer daSuDung;

    @Column(name = "NgayBatDau", nullable = false)
    private Date ngayBatDau;

    @Column(name = "NgayKetThuc", nullable = false)
    private Date ngayKetThuc;

    @Column(name = "TrangThai")
    private Boolean trangThai;
}
