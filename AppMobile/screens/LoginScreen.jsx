import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { GOOGLE_OAUTH_CONFIG } from '../config/googleOAuthConfig';
import Input from '../components/Input';
import OtpInput from '../components/OtpInput';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Quên mật khẩu state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [sendingReset, setSendingReset] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Nhập email, 2: Nhập OTP & mật khẩu mới
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Google Auth Setup
  const redirectUri = makeRedirectUri({
    scheme: 'appmobile'
  });
  
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_OAUTH_CONFIG.webClientId,
    iosClientId: GOOGLE_OAUTH_CONFIG.iosClientId,
    androidClientId: GOOGLE_OAUTH_CONFIG.androidClientId,
    redirectUri: redirectUri,
  });

  useEffect(() => {
    console.log("=== THÔNG TIN GOOGLE OAUTH ===");
    console.log("Redirect URI hiện tại của bạn là:", redirectUri);
    console.log("Hãy copy link trên và dán vào phần 'Authorized redirect URIs' trên Google Cloud Console.");
    console.log("===============================");
    
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    } else if (response?.type === 'error') {
      showToast({ message: 'Lỗi xác thực với Google', type: 'error' });
    }
  }, [response]);

  const handleGoogleLogin = async (idToken) => {
    setLoading(true);
    const res = await loginWithGoogle(idToken);
    setLoading(false);
    
    if (res.success) {
      if (res.isNewUser) {
        showToast({ message: 'Tạo tài khoản thành công! Chào mừng bạn đến với PhoneHub 🎉', type: 'success', duration: 4000 });
      } else {
        showToast({ message: 'Đăng nhập thành công! Chào mừng bạn trở lại 🎉', type: 'success', duration: 3500 });
      }
      
      if (res.role === 'ROLE_ADMIN') {
        router.push('/(admin)');
      } else {
        router.push('/home');
      }
    } else {
      showToast({ message: res.message || 'Đăng nhập Google thất bại.', type: 'error', duration: 4000 });
      setErrorMsg(res.message);
    }
  };

  const handleSendForgotPasswordOtp = async () => {
    if (!forgotEmail) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email.');
      return;
    }
    if (countdown > 0) {
      Alert.alert('Thông báo', `Vui lòng đợi ${countdown} giây để gửi lại mã OTP.`);
      return;
    }
    setSendingReset(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email: forgotEmail });
      setSendingReset(false);
      setCountdown(30); // Khóa 30 giây chống spam
      setForgotStep(2); // Hiển thị các ô nhập OTP và mật khẩu mới lập tức (quan trọng cho Web)
      Alert.alert(
        'Thành công',
        'Mã OTP đã được gửi về email của bạn! Vui lòng kiểm tra hộp thư.'
      );
    } catch (error) {
      setSendingReset(false);
      const msg = error.response?.data?.message || error.message || 'Gửi mã OTP thất bại.';
      Alert.alert('Lỗi', msg);
    }
  };

  const handleResetPassword = async () => {
    if (!otpCode || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ mã OTP và mật khẩu mới.');
      return;
    }
    if (otpCode.length !== 6) {
      Alert.alert('Lỗi', 'Mã OTP phải có đúng 6 chữ số.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không trùng khớp.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải từ 6 ký tự trở lên.');
      return;
    }

    setSendingReset(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        email: forgotEmail,
        otp: otpCode,
        newPassword: newPassword
      });
      setSendingReset(false);
      
      // Reset state để quay về màn hình đăng nhập lập tức
      setIsForgotPassword(false);
      setForgotStep(1);
      setForgotEmail('');
      setOtpCode('');
      setNewPassword('');
      setConfirmPassword('');

      Alert.alert(
        'Thành công',
        'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.'
      );
    } catch (error) {
      setSendingReset(false);
      const msg = error.response?.data?.message || error.message || 'Đặt lại mật khẩu thất bại. Vui lòng kiểm tra mã OTP.';
      Alert.alert('Lỗi', msg);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ width: 60 }} />
            <Text style={styles.brandText}>PHONEHUB</Text>
            <View style={{ width: 60 }} />
          </View>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Ionicons name="phone-portrait" size={32} color="#d70018" />
            </View>
            <Text style={styles.welcomeText}>
              {isForgotPassword ? 'Khôi phục mật khẩu' : 'Chào mừng đến với PhoneHub'}
            </Text>
            <Text style={styles.subtitleText}>
              {isForgotPassword 
                ? 'Nhập email đã đăng ký của bạn bên dưới để nhận hướng dẫn khôi phục mật khẩu.'
                : 'Đăng nhập để trải nghiệm không gian mua sắm công nghệ cao cấp cùng Smember.'}
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {!isForgotPassword ? (
              <>
                {errorMsg ? <Text style={styles.topErrorText}>{errorMsg}</Text> : null}

                <Input
                  label="EMAIL HOẶC SỐ ĐIỆN THOẠI"
                  placeholder="nhap.email.cua.ban@gmail.com"
                  leftIconName="person"
                  value={email}
                  onChangeText={(text) => { setEmail(text); setErrorMsg(''); }}
                />
                
                <Input
                  label="MẬT KHẨU"
                  placeholder="••••••••"
                  leftIconName="lock-closed"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={(text) => { setPassword(text); setErrorMsg(''); }}
                />

                <TouchableOpacity 
                  style={styles.forgotPasswordContainer} 
                  onPress={() => {
                    setIsForgotPassword(true);
                    setForgotEmail('');
                    setErrorMsg('');
                  }}
                >
                  <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                </TouchableOpacity>

                {loading ? (
                  <ActivityIndicator size="large" color="#d70018" style={{ marginVertical: 10 }} />
                ) : (
                  <Button 
                    title="Đăng nhập" 
                    style={{ backgroundColor: '#d70018', shadowColor: '#d70018' }}
                    onPress={async () => {
                      if (!email || !password) {
                        showToast({ message: 'Vui lòng nhập email và mật khẩu', type: 'error' });
                        setErrorMsg('Vui lòng nhập đầy đủ email và mật khẩu');
                        return;
                      }
                      setLoading(true);
                      const res = await login(email, password);
                      setLoading(false);

                      if (res.success) {
                        showToast({ message: 'Đăng nhập thành công! Chào mừng bạn đến với PhoneHub 🎉', type: 'success', duration: 3500 });
                        if (res.role === 'ROLE_ADMIN') {
                          router.push('/(admin)');
                        } else {
                          router.push('/home');
                        }
                      } else {
                        showToast({ message: res.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.', type: 'error', duration: 4000 });
                        setErrorMsg(res.message);
                      }
                    }} 
                  />
                )}

                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>Hoặc đăng nhập bằng</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google Sign In */}
                <TouchableOpacity 
                  style={styles.googleButton} 
                  disabled={!request || loading}
                  onPress={() => promptAsync()}
                >
                  <Image 
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png' }}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                  <Text style={styles.googleButtonText}>Đăng nhập bằng Google</Text>
                </TouchableOpacity>

                <View style={styles.registerContainer}>
                  <Text style={styles.noAccountText}>Bạn chưa có tài khoản? </Text>
                  <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.registerText}>Đăng ký ngay</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Input
                  label="EMAIL ĐĂNG KÝ"
                  placeholder="nhap.email.cua.ban@gmail.com"
                  leftIconName="mail"
                  value={forgotEmail}
                  onChangeText={(text) => setForgotEmail(text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                {countdown > 0 && (
                  <Text style={styles.countdownWarningText}>
                    Vui lòng đợi {countdown}s để có thể gửi lại mã khôi phục.
                  </Text>
                )}

                {sendingReset ? (
                  <ActivityIndicator size="large" color="#d70018" style={{ marginVertical: 10 }} />
                ) : (
                  <Button 
                    title={
                      countdown > 0 
                        ? `Gửi lại mã sau (${countdown}s)` 
                        : (forgotStep === 2 ? "Gửi lại mã OTP" : "Gửi mã khôi phục")
                    } 
                    style={{ 
                      backgroundColor: countdown > 0 ? '#cccccc' : '#d70018', 
                      shadowColor: countdown > 0 ? '#cccccc' : '#d70018' 
                    }}
                    disabled={countdown > 0}
                    onPress={handleSendForgotPasswordOtp}
                  />
                )}

                {forgotStep === 2 && (
                  <View style={{ marginTop: 20 }}>
                    <View style={styles.otpInfoBox}>
                      <Ionicons name="mail-open-outline" size={24} color="#d70018" style={{ marginRight: 8 }} />
                      <Text style={styles.otpInfoText}>
                        Mã OTP đã được gửi về email:{"\n"}
                        <Text style={{ fontWeight: "700" }}>{forgotEmail}</Text>
                      </Text>
                    </View>

                    <OtpInput
                      label="MÃ OTP (6 SỐ)"
                      value={otpCode}
                      onChangeText={(text) => setOtpCode(text)}
                      length={6}
                    />

                    <Input
                      label="MẬT KHẨU MỚI"
                      placeholder="••••••••"
                      leftIconName="lock-closed"
                      secureTextEntry={true}
                      value={newPassword}
                      onChangeText={(text) => setNewPassword(text)}
                    />

                    <Input
                      label="XÁC NHẬN MẬT KHẨU MỚI"
                      placeholder="••••••••"
                      leftIconName="lock-closed"
                      secureTextEntry={true}
                      value={confirmPassword}
                      onChangeText={(text) => setConfirmPassword(text)}
                    />

                    {sendingReset ? (
                      <ActivityIndicator size="large" color="#d70018" style={{ marginVertical: 10 }} />
                    ) : (
                      <Button 
                        title="Xác nhận đặt lại mật khẩu" 
                        style={{ backgroundColor: '#d70018', shadowColor: '#d70018', marginTop: 10 }}
                        onPress={handleResetPassword}
                      />
                    )}
                  </View>
                )}

                <TouchableOpacity 
                  style={styles.backToLoginContainer} 
                  onPress={() => {
                    setIsForgotPassword(false);
                    setForgotStep(1);
                    setForgotEmail('');
                    setOtpCode('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                >
                  <Text style={styles.backToLoginText}>Quay lại đăng nhập</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginTop: Platform.OS === 'android' ? 24 : 0,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#d70018',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 36,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffebee',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 15,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  formSection: {
    flex: 1,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    color: '#d70018',
    fontSize: 14,
    fontWeight: '700',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  noAccountText: {
    color: '#4b5563',
    fontSize: 14,
  },
  registerText: {
    color: '#d70018',
    fontSize: 14,
    fontWeight: '700',
  },
  topErrorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#9ca3af',
    fontSize: 13,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleButtonText: {
    color: '#3C4043',
    fontSize: 16,
    fontWeight: '600',
  },
  backToLoginContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  backToLoginText: {
    color: '#6b7280',
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  otpInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    borderColor: '#ffebeb',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  otpInfoText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    flex: 1,
  },
  otpActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 8,
  },
  otpActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  otpActionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d70018',
  },
  countdownWarningText: {
    color: '#d70018',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
});
