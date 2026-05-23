import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, AppState } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { statsAPI } from '../../services/api';

const POLL_INTERVAL = 10000; // 10 giây auto-refresh dashboard

const HomeScreen = () => {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { logout } = useAuth();
  const intervalRef = useRef(null);
  const appState = useRef(AppState.currentState);

  const fetchStats = async () => {
    try {
      const data = await statsAPI.getDashboard();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (!stats) {
        setStats({
          totalRevenue: 0, pendingOrders: 0, totalProducts: 0,
          totalUsers: 0, totalOrders: 0, deliveredOrders: 0, cancelledOrders: 0
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-polling
  useEffect(() => {
    fetchStats();
    intervalRef.current = setInterval(() => fetchStats(), POLL_INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Pause/resume polling on app state change
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        fetchStats();
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => fetchStats(), POLL_INTERVAL);
      } else if (nextAppState.match(/inactive|background/)) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      appState.current = nextAppState;
    });
    return () => subscription?.remove();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString('vi-VN') + ' ₫';
  };

  const StatCard = ({ title, value, color, icon }) => (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <View style={styles.statCardHeader}>
        <View style={[styles.statIconBox, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>{String(value).trim()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 12, color: '#64748b' }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />}
    >
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerGreeting}>Xin chào, Admin 👋</Text>
          <Text style={styles.subheader}>Tổng quan Quản trị</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Thoát</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <StatCard title="Tổng doanh thu" value={formatCurrency(stats?.totalRevenue)} color="#16a34a" icon="cash-outline" />
        <StatCard title="Đơn chờ xác nhận" value={stats?.pendingOrders || 0} color="#f59e0b" icon="time-outline" />
        <StatCard title="Tổng sản phẩm" value={stats?.totalProducts || 0} color="#8b5cf6" icon="cube-outline" />
        <StatCard title="Tổng khách hàng" value={stats?.totalUsers || 0} color="#06b6d4" icon="people-outline" />
        <StatCard title="Tổng đơn hàng" value={stats?.totalOrders || 0} color="#3b82f6" icon="receipt-outline" />
        <StatCard title="Đã giao thành công" value={stats?.deliveredOrders || 0} color="#10b981" icon="checkmark-circle-outline" />
      </View>

      {/* Đơn hàng bị hủy */}
      {(stats?.cancelledOrders || 0) > 0 && (
        <View style={styles.alertCard}>
          <Ionicons name="alert-circle" size={20} color="#ef4444" />
          <Text style={styles.alertText}>Có {stats.cancelledOrders} đơn hàng đã bị hủy</Text>
        </View>
      )}

      {/* Quick Access */}
      <View style={styles.quickAccessContainer}>
        <Text style={styles.sectionTitle}>Truy cập nhanh</Text>
        <TouchableOpacity style={[styles.quickButton, { backgroundColor: '#f59e0b' }]} onPress={() => router.push('/(admin)/orders')}>
          <Ionicons name="time" size={20} color="#000" style={{ marginRight: 8 }} />
          <Text style={[styles.quickButtonText, { color: '#000' }]}>Xử lý đơn chờ xác nhận ({stats?.pendingOrders || 0})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickButton, { backgroundColor: '#3b82f6' }]} onPress={() => router.push('/(admin)/products')}>
          <Ionicons name="cube" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.quickButtonText}>Quản lý Sản phẩm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickButton, { backgroundColor: '#06b6d4' }]} onPress={() => router.push('/(admin)/users')}>
          <Ionicons name="people" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.quickButtonText}>Quản lý Khách hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickButton, { backgroundColor: '#8b5cf6' }]} onPress={() => router.push('/(admin)/report')}>
          <Ionicons name="bar-chart" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.quickButtonText}>Báo cáo & Thống kê</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FE' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 24, backgroundColor: '#FFFFFF', marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  headerGreeting: { fontSize: 14, color: '#64748b', marginBottom: 4 },
  subheader: { fontSize: 24, color: '#0F172A', fontWeight: 'bold' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fee2e2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  logoutText: { color: '#ef4444', fontWeight: 'bold', marginLeft: 4, fontSize: 13 },
  statsContainer: { paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderTopWidth: 4, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
  statCardHeader: { marginBottom: 8 },
  statIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statTitle: { fontSize: 12, color: '#64748B', marginBottom: 6, fontWeight: '600' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  alertCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', marginHorizontal: 16, marginBottom: 12, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#fecaca' },
  alertText: { color: '#dc2626', fontWeight: '600', fontSize: 13, marginLeft: 8 },
  quickAccessContainer: { paddingHorizontal: 16, paddingBottom: 40, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 14 },
  quickButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 16, marginBottom: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6 },
  quickButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});

export default HomeScreen;
