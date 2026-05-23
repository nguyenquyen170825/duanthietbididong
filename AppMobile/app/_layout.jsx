import React from 'react';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
              <Stack.Screen name="home" />
              <Stack.Screen name="search" />
              <Stack.Screen name="categories" />
              <Stack.Screen name="cart" />
              <Stack.Screen name="compare" />
              <Stack.Screen name="notifications" />
              <Stack.Screen name="account" />
              <Stack.Screen name="checkout" />
              <Stack.Screen name="product/[id]" />
            </Stack>
            <StatusBar style="dark" />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
