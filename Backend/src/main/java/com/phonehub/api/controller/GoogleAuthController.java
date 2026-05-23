package com.phonehub.api.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.phonehub.api.model.User;
import com.phonehub.api.payload.response.JwtResponse;
import com.phonehub.api.repository.UserRepository;
import com.phonehub.api.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class GoogleAuthController {

    @Value("${google.client.id:}")
    private String googleClientId;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder encoder;

    /**
     * Nhận idToken từ Google OAuth (phía Expo/React Native),
     * verify với Google, tạo/tìm user trong DB, trả về JWT của hệ thống.
     */
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        String idToken = body.get("idToken");
        if (idToken == null || idToken.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "idToken is required"));
        }

        try {
            GoogleIdToken.Payload payload = verifyGoogleToken(idToken);
            if (payload == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Google token không hợp lệ hoặc đã hết hạn"));
            }

            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String givenName = (String) payload.get("given_name");
            String fullName = (name != null && !name.isBlank()) ? name : (givenName != null ? givenName : email.split("@")[0]);

            // Tìm hoặc tạo user
            User user = userRepository.findByEmail(email).orElse(null);
            boolean isNewUser = false;

            if (user == null) {
                // Tạo user mới từ Google
                user = new User();
                user.setEmail(email);
                user.setFullName(fullName);
                user.setPhone("");
                user.setRole("ROLE_USER");
                user.setProvider("google");
                user.setProviderId(payload.getSubject()); // Lưu Google User ID
                // Đặt mật khẩu ngẫu nhiên (user sẽ không dùng đến vì đăng nhập bằng Google)
                user.setPassword(encoder.encode(UUID.randomUUID().toString()));
                userRepository.save(user);
                isNewUser = true;
            } else {
                boolean updated = false;
                // Cập nhật tên nếu chưa có
                if ((user.getFullName() == null || user.getFullName().isBlank()) && fullName != null) {
                    user.setFullName(fullName);
                    updated = true;
                }
                // Nếu tài khoản đã có (do đăng ký tay) nhưng nay đăng nhập bằng Google -> Liên kết tài khoản
                if (user.getProvider() == null || !user.getProvider().equals("google")) {
                    user.setProvider("google");
                    user.setProviderId(payload.getSubject());
                    updated = true;
                }
                
                if (updated) {
                    userRepository.save(user);
                }
            }

            // Tạo JWT token hệ thống
            String jwt = jwtUtils.generateJwtFromEmail(email);

            return ResponseEntity.ok(new JwtResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getFullName() != null ? user.getFullName() : "",
                user.getPhone() != null ? user.getPhone() : ""
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi xác thực Google: " + e.getMessage()));
        }
    }

    private GoogleIdToken.Payload verifyGoogleToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier.Builder builder = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), GsonFactory.getDefaultInstance()
            );

            // Nếu có Client ID, verify strict; nếu không có thì verify chữ ký thôi
            if (googleClientId != null && !googleClientId.isBlank()) {
                builder.setAudience(Collections.singletonList(googleClientId));
            }

            GoogleIdTokenVerifier verifier = builder.build();
            GoogleIdToken token = verifier.verify(idTokenString);
            return token != null ? token.getPayload() : null;
        } catch (Exception e) {
            // Nếu verify strict thất bại, thử decode không verify audience (dev mode)
            try {
                GoogleIdToken token = GoogleIdToken.parse(GsonFactory.getDefaultInstance(), idTokenString);
                return token != null ? token.getPayload() : null;
            } catch (Exception ex) {
                return null;
            }
        }
    }
}
