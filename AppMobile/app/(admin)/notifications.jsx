import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { notificationAPI } from '../../services/api';

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

export default function AdminNotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState('PROMO'); // PROMO or SYSTEM

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationAPI.getAllAdmin();
      setNotifications(data || []);
    } catch (error) {
      console.log('Lỗi tải thông báo admin:', error);
      Alert.alert("Lỗi", "Không thể tải danh sách thông báo");
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

  const handleSendNotification = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }

    try {
      if (newType === 'PROMO') {
        await notificationAPI.sendPromo(newTitle, newContent);
      } else {
        await notificationAPI.sendSystem(newTitle, newContent);
      }
      Alert.alert('Thành công', 'Đã gửi thông báo đến tất cả người dùng');
      setShowModal(false);
      setNewTitle('');
      setNewContent('');
      fetchNotifications();
    } catch (error) {
      console.log('Lỗi gửi thông báo:', error);
      Alert.alert('Lỗi', 'Không thể gửi thông báo');
    }
  };

  const renderItem = ({ item }) => {
    const isPromo = item.type === 'PROMO';
    const isSystem = item.type === 'SYSTEM';
    const iconName = isPromo ? 'flash' : isSystem ? 'ribbon' : 'cube';
    const iconColor = isPromo ? '#d70018' : isSystem ? '#d97706' : '#2563eb';
    const bgColor = isPromo ? '#fee2e2' : isSystem ? '#fef3c7' : '#dbeafe';

    return (
      <View style={styles.card}>
        <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
          <Ionicons name={iconName} size={20} color={iconColor} />
        </View>
        <View style={styles.contentBox}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.time}>{getRelativeTime(item.createdAt)}</Text>
          </View>
          <Text style={styles.body}>{item.content}</Text>
          <View style={styles.footer}>
            <Text style={styles.type}>
              Loại: <Text style={{ color: iconColor, fontWeight: '700' }}>{item.type}</Text>
            </Text>
            {item.user && (
              <Text style={styles.user}>User ID: {item.user.id}</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý thông báo</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="add-circle" size={24} color="#d70018" />
          <Text style={styles.addBtnText}>Gửi TB mới</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#d70018" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#d70018']} />}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="notifications-off-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>Chưa có thông báo nào</Text>
            </View>
          }
        />
      )}

      {/* Modal gửi thông báo */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Gửi thông báo mới</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Loại thông báo</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeBtn, newType === 'PROMO' && styles.typeBtnActive]}
                onPress={() => setNewType('PROMO')}
              >
                <Text style={[styles.typeBtnText, newType === 'PROMO' && styles.typeBtnTextActive]}>Khuyến mãi</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, newType === 'SYSTEM' && styles.typeBtnActive]}
                onPress={() => setNewType('SYSTEM')}
              >
                <Text style={[styles.typeBtnText, newType === 'SYSTEM' && styles.typeBtnTextActive]}>Hệ thống</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Tiêu đề</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tiêu đề..."
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text style={styles.label}>Nội dung</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Nhập nội dung..."
              value={newContent}
              onChangeText={setNewContent}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleSendNotification}>
              <Text style={styles.submitBtnText}>Gửi cho tất cả User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7fe', paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1f2937' },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fee2e2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  addBtnText: { marginLeft: 4, fontSize: 13, fontWeight: '700', color: '#d70018' },
  listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 12, fontSize: 15, color: '#64748b' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  contentBox: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  title: { fontSize: 15, fontWeight: '700', color: '#1f2937', flex: 1, marginRight: 8 },
  time: { fontSize: 12, color: '#94a3b8' },
  body: { fontSize: 13, color: '#4b5563', marginBottom: 8, lineHeight: 18 },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  type: { fontSize: 11, color: '#64748b' },
  user: { fontSize: 11, color: '#64748b' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  label: { fontSize: 13, fontWeight: '600', color: '#4b5563', marginBottom: 8 },
  typeSelector: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  typeBtnActive: { backgroundColor: '#fee2e2', borderColor: '#d70018' },
  typeBtnText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  typeBtnTextActive: { color: '#d70018' },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12, fontSize: 14, color: '#1f2937', marginBottom: 16 },
  textArea: { height: 100 },
  submitBtn: { backgroundColor: '#d70018', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
