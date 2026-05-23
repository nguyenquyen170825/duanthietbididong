import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';
import { notificationAPI } from '../services/api';

// Helper: tính thời gian tương đối
const getRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 30) return `${diffDays} ngày trước`;
  return date.toLocaleDateString('vi-VN');
};

// Helper: lấy icon + màu theo loại thông báo
const getNotificationStyle = (type, title) => {
  const lowerTitle = (title || '').toLowerCase();

  if (type === 'ORDER') {
    if (lowerTitle.includes('thành công') || lowerTitle.includes('giao')) {
      return { icon: 'cube', iconBg: '#dcfce7', iconColor: '#16a34a' };
    }
    if (lowerTitle.includes('hủy')) {
      return { icon: 'close-circle', iconBg: '#fee2e2', iconColor: '#dc2626' };
    }
    if (lowerTitle.includes('xác nhận')) {
      return { icon: 'checkmark-circle', iconBg: '#dbeafe', iconColor: '#2563eb' };
    }
    if (lowerTitle.includes('giao') || lowerTitle.includes('shipping')) {
      return { icon: 'car', iconBg: '#fef3c7', iconColor: '#d97706' };
    }
    return { icon: 'receipt', iconBg: '#e0e7ff', iconColor: '#4f46e5' };
  }

  if (type === 'PROMO') {
    return { icon: 'flash', iconBg: '#fee2e2', iconColor: '#d70018' };
  }

  // SYSTEM
  return { icon: 'ribbon', iconBg: '#fef3c7', iconColor: '#d97706' };
};

export default function NotificationsScreen() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationAPI.getAll();
      setNotifications(data || []);
    } catch (error) {
      console.log('Lỗi tải thông báo:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications = notifications.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'promo') return item.type === 'PROMO';
    if (activeFilter === 'order') return item.type === 'ORDER';
    if (activeFilter === 'system') return item.type === 'SYSTEM';
    return true;
  });

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true, read: true })));
    } catch (error) {
      console.log('Lỗi đánh dấu đã đọc:', error);
    }
  };

  const toggleRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, isRead: true, read: true } : n
      ));
    } catch (error) {
      console.log('Lỗi đánh dấu đã đọc:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead && !n.read).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 28 }} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Thông báo</Text>
          {unreadCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.markReadBtn} onPress={markAllAsRead}>
          <Ionicons name="checkmark-done-outline" size={22} color="#d70018" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'all' && styles.filterTabActive]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>Tất cả</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'promo' && styles.filterTabActive]}
          onPress={() => setActiveFilter('promo')}
        >
          <Text style={[styles.filterText, activeFilter === 'promo' && styles.filterTextActive]}>Khuyến mãi</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'order' && styles.filterTabActive]}
          onPress={() => setActiveFilter('order')}
        >
          <Text style={[styles.filterText, activeFilter === 'order' && styles.filterTextActive]}>Đơn hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'system' && styles.filterTabActive]}
          onPress={() => setActiveFilter('system')}
        >
          <Text style={[styles.filterText, activeFilter === 'system' && styles.filterTextActive]}>Hệ thống</Text>
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d70018" />
          <Text style={styles.loadingText}>Đang tải thông báo...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#d70018']} />
          }
        >
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => {
              const notiStyle = getNotificationStyle(item.type, item.title);
              const isUnread = !item.isRead && !item.read;

              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.notiCard, isUnread && styles.notiCardUnread]}
                  onPress={() => toggleRead(item.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconBox, { backgroundColor: notiStyle.iconBg }]}>
                    <Ionicons name={notiStyle.icon} size={20} color={notiStyle.iconColor} />
                  </View>
                  <View style={styles.contentBox}>
                    <View style={styles.notiHeader}>
                      <Text style={[styles.notiTitle, isUnread && styles.notiTitleUnread]}>{item.title}</Text>
                      {isUnread && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notiBody} numberOfLines={3}>{item.content}</Text>
                    <View style={styles.notiFooter}>
                      <Text style={styles.notiTime}>{getRelativeTime(item.createdAt)}</Text>
                      <View style={[styles.typeBadge, { backgroundColor: notiStyle.iconBg }]}>
                        <Text style={[styles.typeBadgeText, { color: notiStyle.iconColor }]}>
                          {item.type === 'ORDER' ? 'Đơn hàng' : item.type === 'PROMO' ? 'Khuyến mãi' : 'Hệ thống'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={64} color="#9ca3af" />
              <Text style={styles.emptyText}>Không có thông báo nào</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab="notifications" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  badgeContainer: {
    backgroundColor: '#d70018',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  markReadBtn: {
    width: 28,
    alignItems: 'flex-end',
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterTabActive: {
    backgroundColor: '#fee2e2',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTextActive: {
    color: '#d70018',
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  notiCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  notiCardUnread: {
    backgroundColor: '#fffbeb',
    borderColor: '#fef3c7',
    borderWidth: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contentBox: {
    flex: 1,
  },
  notiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    flex: 1,
  },
  notiTitleUnread: {
    color: '#0f172a',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d70018',
    marginLeft: 8,
  },
  notiBody: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 8,
  },
  notiFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notiTime: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
  },
});
