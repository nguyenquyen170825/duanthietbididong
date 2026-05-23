import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const API_URL = `${API_BASE_URL}/auth`;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (token && userInfo) {
          const parsedUser = JSON.parse(userInfo);
          setIsLoggedIn(true);
          setUser(parsedUser);

          // Fetch latest profile from server to ensure data is fresh
          try {
            const profileRes = await axios.get(`${API_BASE_URL}/user/me`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (profileRes.data) {
              const updatedUser = { ...parsedUser, ...profileRes.data };
              setUser(updatedUser);
              await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUser));
            }
          } catch (profileErr) {
            console.log('Could not refresh profile, using cached data:', profileErr.message);
          }
        }
      } catch (error) {
        console.error('Error checking auth state', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkLoginStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      const data = response.data;
      if (data.token) {
        await AsyncStorage.setItem('userToken', data.token);

        // data từ backend giờ đã có: token, id, email, role, fullName, phone
        const userInfo = {
          id: data.id,
          email: data.email,
          role: data.role,
          fullName: data.fullName || '',
          phone: data.phone || '',
          token: data.token,
        };

        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setUser(userInfo);
        setIsLoggedIn(true);
        return { success: true, role: data.role };
      }
      return { success: false, message: 'Thông tin đăng nhập không hợp lệ' };
    } catch (error) {
      let msg = error.response?.data?.message;
      if (!msg) {
        if (error.response?.status === 401 || error.response?.status === 400) {
          msg = 'Email hoặc mật khẩu không chính xác.';
        } else {
          msg = error.message || 'Đăng nhập thất bại';
        }
      }
      console.log('Login error:', msg);
      return { success: false, message: msg };
    }
  };

  const register = async (email, password, fullName, phone) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
        fullName,
        phone
      });
      return { success: true, message: response.data.message };
    } catch (error) {
       let msg = error.response?.data?.message;
       if (msg === 'Error: Email is already in use!') {
         msg = 'Email này đã được sử dụng bởi tài khoản khác.';
       }
       if (!msg) {
         if (error.response?.status === 400) {
           msg = 'Đăng ký thất bại. Email đã tồn tại hoặc thông tin không hợp lệ (mật khẩu phải từ 6 ký tự trở lên).';
         } else {
           msg = error.message || 'Đăng ký thất bại';
         }
       }
       console.log('Register error:', msg);
       return { success: false, message: msg };
    }
  };

  // Đăng nhập bằng Google - nhận idToken từ Google OAuth và gửi lên backend
  const loginWithGoogle = async (idToken) => {
    try {
      const response = await axios.post(`${API_URL}/google`, { idToken });
      const data = response.data;

      if (data.token) {
        await AsyncStorage.setItem('userToken', data.token);

        const userInfo = {
          id: data.id,
          email: data.email,
          role: data.role,
          fullName: data.fullName || '',
          phone: data.phone || '',
          hang: data.hang || 'Dong',
          tongTienDaMua: data.tongTienDaMua || 0,
          token: data.token,
          loginMethod: 'google',
        };

        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setUser(userInfo);
        setIsLoggedIn(true);
        return { success: true, role: data.role, isNewUser: data.isNewUser };
      }
      return { success: false, message: 'Xác thực Google thất bại' };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Đăng nhập Google thất bại';
      console.log('Google login error:', msg);
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.warn('Logout error', error);
    }
  };

  // Refresh user profile from server
  const refreshProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      const res = await axios.get(`${API_BASE_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        const currentInfo = user || {};
        const updatedUser = { ...currentInfo, ...res.data };
        setUser(updatedUser);
        await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUser));
      }
    } catch (e) {
      console.log('refreshProfile error:', e.message);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, login, loginWithGoogle, logout, register, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
