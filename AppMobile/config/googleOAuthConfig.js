// ============================================================
// HƯỚNG DẪN CẤU HÌNH GOOGLE OAUTH
// ============================================================
// 1. Truy cập: https://console.cloud.google.com/
// 2. Tạo Project mới (hoặc chọn project có sẵn)
// 3. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client IDs
// 4. Tạo 3 Client ID:
//    - Type "Web application"     → dùng cho expoClientId (redirect URI: https://auth.expo.io/@your-expo-username/AppMobile)
//    - Type "Android"             → dùng cho androidClientId  
//    - Type "iOS"                 → dùng cho iosClientId
// 5. Điền các Client ID vào bên dưới

export const GOOGLE_OAUTH_CONFIG = {
  // Web Client ID - BẮT BUỘC (dùng để verify token phía backend)
  // Tạo tại: Google Console → OAuth 2.0 Client IDs → Web application
  // Authorized redirect URIs thêm: https://auth.expo.io/@your-expo-username/AppMobile
  webClientId: '876936975914-uu6ju3ratql6c1ekvhdfm8tq9hf5vu6q.apps.googleusercontent.com',

  // Android Client ID (tùy chọn, để xác thực native Android)
  androidClientId: '876936975914-uu6ju3ratql6c1ekvhdfm8tq9hf5vu6q.apps.googleusercontent.com',

  // iOS Client ID (tùy chọn)
  iosClientId: '876936975914-uu6ju3ratql6c1ekvhdfm8tq9hf5vu6q.apps.googleusercontent.com',

  // Expo scheme - phải khớp với app.json "scheme"
  expoScheme: 'appmobile',
};

// Tên Expo username của bạn (dùng khi chạy bằng Expo Go)
// Tìm tại: https://expo.dev/accounts hoặc chạy `npx expo whoami`
export const EXPO_USERNAME = 'your-expo-username';
