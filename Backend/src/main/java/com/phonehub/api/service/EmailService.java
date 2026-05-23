package com.phonehub.api.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Gửi email mã OTP khôi phục mật khẩu (Bất đồng bộ)
     */
    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "PhoneHub Store");
            helper.setTo(toEmail);
            helper.setSubject("[PhoneHub] Mã xác thực OTP khôi phục mật khẩu");

            String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eeeeee; border-radius: 10px;'>"
                    + "<div style='text-align: center; margin-bottom: 20px;'>"
                    + "  <h1 style='color: #d70018; margin: 0;'>PHONEHUB</h1>"
                    + "  <p style='color: #666666; font-size: 14px; margin: 5px 0 0 0;'>Cửa hàng điện thoại và phụ kiện cao cấp</p>"
                    + "</div>"
                    + "<hr style='border: none; border-top: 1px solid #eeeeee; margin: 20px 0;'>"
                    + "<p>Xin chào,</p>"
                    + "<p>Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản liên kết với email này. Vui lòng sử dụng mã xác minh OTP dưới đây để hoàn tất:</p>"
                    + "<div style='text-align: center; margin: 30px 0;'>"
                    + "  <span style='display: inline-block; font-size: 32px; font-weight: bold; color: #d70018; letter-spacing: 5px; background-color: #ffebee; padding: 15px 30px; border-radius: 8px; border: 1px dashed #d70018;'>"
                    + otp
                    + "  </span>"
                    + "</div>"
                    + "<p style='color: #ff9800; font-weight: bold;'>Lưu ý: Mã OTP này có thời hạn sử dụng là 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai để bảo mật tài khoản.</p>"
                    + "<p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi.</p>"
                    + "<hr style='border: none; border-top: 1px solid #eeeeee; margin: 20px 0;'>"
                    + "<div style='font-size: 12px; color: #999999; text-align: center;'>"
                    + "  <p>© 2026 PhoneHub Store. All rights reserved.</p>"
                    + "  <p>Địa chỉ: Đường 3/2, Quận 10, Thành phố Hồ Chí Minh, Việt Nam</p>"
                    + "</div>"
                    + "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("Gửi OTP email thành công tới: " + toEmail);
        } catch (Exception e) {
            System.err.println("Lỗi khi gửi email OTP: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Gửi email cảnh báo đăng nhập thành công (Bất đồng bộ)
     */
    @Async
    public void sendLoginAlertEmail(String toEmail, String fullName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "PhoneHub Store");
            helper.setTo(toEmail);
            helper.setSubject("[PhoneHub] Cảnh báo bảo mật: Thiết bị mới đăng nhập");

            String timeNow = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss dd/MM/yyyy"));

            String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eeeeee; border-radius: 10px;'>"
                    + "<div style='text-align: center; margin-bottom: 20px;'>"
                    + "  <h1 style='color: #d70018; margin: 0;'>PHONEHUB</h1>"
                    + "  <p style='color: #666666; font-size: 14px; margin: 5px 0 0 0;'>Cửa hàng điện thoại và phụ kiện cao cấp</p>"
                    + "</div>"
                    + "<hr style='border: none; border-top: 1px solid #eeeeee; margin: 20px 0;'>"
                    + "<p>Xin chào <strong>" + (fullName != null ? fullName : toEmail) + "</strong>,</p>"
                    + "<p>Tài khoản PhoneHub của bạn đã được đăng nhập thành công từ ứng dụng di động.</p>"
                    + "<div style='background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; line-height: 1.6;'>"
                    + "  <strong>Chi tiết đăng nhập:</strong><br>"
                    + "  • <strong>Thời gian:</strong> " + timeNow + "<br>"
                    + "  • <strong>Hình thức:</strong> Đăng nhập qua App Mobile (React Native)<br>"
                    + "  • <strong>Trạng thái:</strong> Thành công"
                    + "</div>"
                    + "<p>Nếu việc đăng nhập này do chính bạn thực hiện, bạn không cần làm gì thêm.</p>"
                    + "<p style='color: #d70018; font-weight: bold;'>Nếu bạn KHÔNG đăng nhập vào thời điểm này, tài khoản của bạn có thể đã bị rò rỉ. Vui lòng đổi mật khẩu ngay lập tức trong mục cài đặt tài khoản của ứng dụng.</p>"
                    + "<hr style='border: none; border-top: 1px solid #eeeeee; margin: 20px 0;'>"
                    + "<div style='font-size: 12px; color: #999999; text-align: center;'>"
                    + "  <p>© 2026 PhoneHub Store. All rights reserved.</p>"
                    + "</div>"
                    + "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("Gửi email cảnh báo đăng nhập thành công tới: " + toEmail);
        } catch (Exception e) {
            System.err.println("Lỗi khi gửi email cảnh báo đăng nhập: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Gửi email xác nhận đổi mật khẩu thành công (Bất đồng bộ)
     */
    @Async
    public void sendPasswordChangedEmail(String toEmail, String fullName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "PhoneHub Store");
            helper.setTo(toEmail);
            helper.setSubject("[PhoneHub] Mật khẩu của bạn đã được cập nhật thành công");

            String timeNow = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss dd/MM/yyyy"));

            String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eeeeee; border-radius: 10px;'>"
                    + "<div style='text-align: center; margin-bottom: 20px;'>"
                    + "  <h1 style='color: #d70018; margin: 0;'>PHONEHUB</h1>"
                    + "  <p style='color: #666666; font-size: 14px; margin: 5px 0 0 0;'>Cửa hàng điện thoại và phụ kiện cao cấp</p>"
                    + "</div>"
                    + "<hr style='border: none; border-top: 1px solid #eeeeee; margin: 20px 0;'>"
                    + "<p>Xin chào <strong>" + (fullName != null ? fullName : toEmail) + "</strong>,</p>"
                    + "<p>Thông báo bảo mật: Mật khẩu cho tài khoản PhoneHub của bạn đã được thay đổi thành công vào lúc <strong>" + timeNow + "</strong>.</p>"
                    + "<p>Kể từ bây giờ, vui lòng sử dụng mật khẩu mới của bạn để đăng nhập vào ứng dụng.</p>"
                    + "<p style='color: #d70018; font-weight: bold;'>Nếu bạn KHÔNG thực hiện thay đổi mật khẩu này, hãy liên hệ ngay với bộ phận hỗ trợ khách hàng hoặc dùng chức năng 'Quên mật khẩu' trên màn hình đăng nhập để khôi phục tài khoản ngay lập tức.</p>"
                    + "<hr style='border: none; border-top: 1px solid #eeeeee; margin: 20px 0;'>"
                    + "<div style='font-size: 12px; color: #999999; text-align: center;'>"
                    + "  <p>© 2026 PhoneHub Store. All rights reserved.</p>"
                    + "</div>"
                    + "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("Gửi email báo đổi mật khẩu thành công tới: " + toEmail);
        } catch (Exception e) {
            System.err.println("Lỗi khi gửi email báo đổi mật khẩu: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
