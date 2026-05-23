package com.phonehub.api.security;

import com.phonehub.api.model.User;
import com.phonehub.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Kiểm tra xem email admin đã tồn tại hay chưa
        if (!userRepository.existsByEmail("admin@shop.com")) {
            User admin = new User();
            admin.setEmail("admin@shop.com");
            // Mật khẩu mặc định là: 123456
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setFullName("Quản trị viên Hệ thống");
            admin.setRole("ROLE_ADMIN");
            admin.setPhone("0123456789");

            userRepository.save(admin);
            System.out.println("✅ Đã khởi tạo tự động tài khoản ADMIN thành công:");
            System.out.println("   - Email: admin@shop.com");
            System.out.println("   - Mật khẩu: 123456");
        }
    }
}
