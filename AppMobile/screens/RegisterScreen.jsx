import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.brandText}>PHONEHUB</Text>
            <View style={styles.rightIcons} />
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.titleText}>Đăng ký tài khoản</Text>
            <Text style={styles.subtitleText}>
              Trở thành Smember để nhận ngàn ưu đãi đặc quyền và quản lý đơn hàng tiện lợi.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {errorMsg ? <Text style={styles.topErrorText}>{errorMsg}</Text> : null}
            
            <Input
              label="HỌ VÀ TÊN"
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChangeText={(t) => {setFullName(t); setErrorMsg('');}}
            />
            
            <Input
              label="ĐỊA CHỈ EMAIL"
              placeholder="nguyenvana@gmail.com"
              value={email}
              onChangeText={(t) => {setEmail(t); setErrorMsg('');}}
            />

            <Input
              label="SỐ ĐIỆN THOẠI"
              placeholder="0912345678"
              value={phone}
              onChangeText={(t) => {setPhone(t); setErrorMsg('');}}
            />

            <Input
              label="MẬT KHẨU"
              placeholder="••••••••"
              secureTextEntry={true}
              value={password}
              onChangeText={(t) => {setPassword(t); setErrorMsg('');}}
            />

            <Input
              label="XÁC NHẬN MẬT KHẨU"
              placeholder="••••••••"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={(t) => {setConfirmPassword(t); setErrorMsg('');}}
            />

            {loading ? (
               <ActivityIndicator size="large" color="#d70018" style={{ marginVertical: 10 }} />
            ) : (
                <Button 
                  title="Đăng ký tài khoản" 
                  style={{ backgroundColor: '#d70018', shadowColor: '#d70018' }}
                  onPress={async () => {
                     if (!email || !password || !fullName) {
                        setErrorMsg("Vui lòng nhập đầy đủ các trường bắt buộc (Họ tên, Email, Mật khẩu)");
                        return;
                     }
                     if (password !== confirmPassword) {
                        setErrorMsg("Mật khẩu xác nhận không trùng khớp");
                        return;
                     }
                     setLoading(true);
                     const res = await register(email, password, fullName, phone);
                     setLoading(false);
                     if (res.success) {
                        // automatically navigate to login
                        router.push('/login');
                     } else {
                        setErrorMsg(res.message);
                     }
                  }} 
                />
            )}

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Hoặc đăng ký bằng</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In */}
            <TouchableOpacity 
              style={styles.googleButton} 
              onPress={() => Alert.alert('Thông báo', 'Tính năng đăng ký bằng Google đang được kết nối...')}
            >
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png' }}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text style={styles.googleButtonText}>Đăng ký bằng Google</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.accountText}>Bạn đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginText}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
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
  backButton: {
    width: 60,
    alignItems: 'flex-start',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#d70018',
  },
  rightIcons: {
    width: 60,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  subtitleText: {
    fontSize: 15,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  formSection: {
    flex: 1,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  accountText: {
    color: '#4b5563',
    fontSize: 14,
  },
  loginText: {
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
  }
});
