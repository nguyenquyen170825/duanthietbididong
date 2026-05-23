package com.phonehub.api.controller;

import com.phonehub.api.model.Voucher;
import com.phonehub.api.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public/vouchers")
@CrossOrigin("*")
public class PublicVoucherController {

    @Autowired
    private VoucherRepository voucherRepository;

    @GetMapping
    public ResponseEntity<List<Voucher>> getActiveVouchers() {
        Date now = new Date();
        List<Voucher> vouchers = voucherRepository.findByTrangThaiTrue().stream()
                .filter(v -> v.getNgayKetThuc() != null && v.getNgayKetThuc().after(now))
                .collect(Collectors.toList());
        return ResponseEntity.ok(vouchers);
    }
}
