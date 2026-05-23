import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { notificationAPI } from '../../services/api';

export default function AdminLayout() {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const data = await notificationAPI.getAllAdmin();
        if (data && data.length > 0) {
          setNotificationCount(data.length);
        }
      } catch (error) {
        console.log('Error fetching notification count:', error);
      }
    };
    fetchCount();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'products/index') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'categories') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'orders') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'users') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'report') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Tổng quan' }} />
      <Tabs.Screen name="products/index" options={{ title: 'Sản phẩm' }} />
      <Tabs.Screen name="categories" options={{ title: 'Danh mục' }} />
      <Tabs.Screen name="orders" options={{ title: 'Đơn hàng' }} />
      <Tabs.Screen name="users" options={{ title: 'Khách hàng' }} />
      <Tabs.Screen name="report" options={{ title: 'Báo cáo' }} />
      <Tabs.Screen 
        name="notifications" 
        options={{ 
          title: 'Thông báo',
          tabBarBadge: notificationCount > 0 ? notificationCount : undefined,
          tabBarBadgeStyle: { backgroundColor: '#d70018', fontSize: 10 }
        }} 
      />
      <Tabs.Screen name="products/add" options={{ href: null }} />
      <Tabs.Screen name="products/edit/[id]" options={{ href: null }} />
      <Tabs.Screen name="products/variants/[id]" options={{ href: null }} />
    </Tabs>
  );
}
