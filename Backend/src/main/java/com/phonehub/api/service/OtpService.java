package com.phonehub.api.service;

import org.springframework.stereotype.Service;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {
    // Lưu trữ OTP tạm thời: Key = Email, Value = OtpData
    private final ConcurrentHashMap<String, OtpData> otpCache = new ConcurrentHashMap<>();
    private final Random random = new Random();

    private static class OtpData {
        String code;
        long expiryTime;

        OtpData(String code, long expiryTime) {
            this.code = code;
            this.expiryTime = expiryTime;
        }
    }

    /**
     * Tạo mã OTP ngẫu nhiên gồm 6 chữ số và lưu vào cache trong 5 phút
     */
    public String generateOtp(String email) {
        String code = String.format("%06d", random.nextInt(1000000));
        long expiryTime = System.currentTimeMillis() + (5 * 60 * 1000); // 5 phút hết hạn
        otpCache.put(email, new OtpData(code, expiryTime));
        return code;
    }

    /**
     * Kiểm tra OTP có khớp và còn hạn sử dụng hay không
     */
    public boolean validateOtp(String email, String code) {
        return validateOtp(email, code, true);
    }

    /**
     * Kiểm tra OTP và quyết định có xóa mã khỏi cache sau khi khớp hay không
     */
    public boolean validateOtp(String email, String code, boolean removeOnSuccess) {
        if (email == null || code == null) {
            return false;
        }
        OtpData otpData = otpCache.get(email);
        if (otpData == null) {
            return false;
        }

        // Kiểm tra xem OTP đã hết hạn chưa
        if (System.currentTimeMillis() > otpData.expiryTime) {
            otpCache.remove(email); // Xóa OTP hết hạn
            return false;
        }

        // So khớp mã
        boolean isValid = otpData.code.equals(code);
        if (isValid && removeOnSuccess) {
            otpCache.remove(email); // Xóa OTP sau khi xác thực thành công
        }
        return isValid;
    }

    /**
     * Xóa OTP thủ công
     */
    public void clearOtp(String email) {
        otpCache.remove(email);
    }
}
