package com.phonehub.api.controller;

import com.phonehub.api.model.User;
import com.phonehub.api.payload.request.LoginRequest;
import com.phonehub.api.payload.request.RegisterRequest;
import com.phonehub.api.payload.response.JwtResponse;
import com.phonehub.api.payload.response.MessageResponse;
import com.phonehub.api.repository.UserRepository;
import com.phonehub.api.security.jwt.JwtUtils;
import com.phonehub.api.security.services.UserDetailsImpl;
import com.phonehub.api.service.EmailService;
import com.phonehub.api.service.OtpService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    EmailService emailService;

    @Autowired
    OtpService otpService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .get()
                .getAuthority();

        // Gửi email thông báo đăng nhập thành công
        try {
            emailService.sendLoginAlertEmail(userDetails.getUsername(), userDetails.getFullName());
        } catch (Exception e) {
            System.err.println("Không gửi được email báo đăng nhập: " + e.getMessage());
        }

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                role,
                userDetails.getFullName(),
                userDetails.getPhone()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }


        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setFullName(signUpRequest.getFullName());
        user.setPhone(signUpRequest.getPhone());
        user.setRole("ROLE_USER");

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: Vui lòng cung cấp email!"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: Không tìm thấy tài khoản với email này!"));
        }

        String otp = otpService.generateOtp(email);
        emailService.sendOtpEmail(email, otp);

        return ResponseEntity.ok(new MessageResponse("Mã OTP đã được gửi về email của bạn!"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        if (email == null || otp == null || email.trim().isEmpty() || otp.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: Email và OTP không được để trống!"));
        }

        boolean isValid = otpService.validateOtp(email, otp, false); // không xóa để có thể dùng tiếp lúc reset
        if (!isValid) {
            return ResponseEntity.badRequest().body(new MessageResponse("Mã OTP không chính xác hoặc đã hết hạn!"));
        }

        return ResponseEntity.ok(new MessageResponse("Mã OTP hợp lệ!"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        if (email == null || otp == null || newPassword == null || 
            email.trim().isEmpty() || otp.trim().isEmpty() || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: Vui lòng điền đầy đủ thông tin!"));
        }

        boolean isValid = otpService.validateOtp(email, otp, true); // Xác thực và xóa OTP khỏi cache
        if (!isValid) {
            return ResponseEntity.badRequest().body(new MessageResponse("Mã OTP không chính xác hoặc đã hết hạn!"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: Không tìm thấy tài khoản này!"));
        }

        User user = userOpt.get();
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);

        // Gửi thông báo đổi mật khẩu thành công qua email
        try {
            emailService.sendPasswordChangedEmail(user.getEmail(), user.getFullName());
        } catch (Exception e) {
            System.err.println("Không gửi được email thông báo đổi mật khẩu: " + e.getMessage());
        }

        return ResponseEntity.ok(new MessageResponse("Mật khẩu đã được đặt lại thành công!"));
    }
}
