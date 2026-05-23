package com.phonehub.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Date;
import java.math.BigDecimal;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;
    
    @Column(name = "Email", unique = true, nullable = false)
    private String email;
    
    @JsonIgnore
    @Column(name = "Password", nullable = false)
    private String password;
    
    @Column(name = "FullName")
    private String fullName;
    
    @Column(name = "Phone")
    private String phone;
    
    @Column(name = "Address", columnDefinition = "TEXT")
    private String address;
    
    @Column(name = "Provider")
    private String provider;
    
    @Column(name = "ProviderId")
    private String providerId;
    
    @Column(name = "IsProfileCompleted")
    private Boolean isProfileCompleted = false;
    
    @Column(name = "IsLocked")
    private Boolean isLocked = false;
    
    @Temporal(TemporalType.DATE)
    @Column(name = "NgaySinh")
    private Date ngaySinh;
    
    @Column(name = "Sex")
    private String sex; 
    
    @Column(name = "Hang")
    private String hang = "Dong"; 
    
    @Column(name = "TongTienDaMua")
    private BigDecimal tongTienDaMua = BigDecimal.ZERO;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "PasswordLastUpdated")
    private Date passwordLastUpdated;
    
    @Column(name = "Role", length = 50)
    private String role = "ROLE_USER"; 
}
