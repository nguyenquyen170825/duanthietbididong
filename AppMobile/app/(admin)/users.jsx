import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal, ScrollView, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { userAPI } from '../../services/api';

const UsersScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailModal, setDetailModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const data = await userAPI.getAll();
            setUsers(data);
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tải người dùng");
        } finally {
            setLoading(false);
        }
    };

    const executeDelete = async (item) => {
        try {
            await userAPI.delete(item.id);
            if (Platform.OS === 'web') window.alert("Đã xóa người dùng thành công");
            else Alert.alert("Thành công", "Đã xóa người dùng");
            fetchUsers();
        } catch (error) {
            if (Platform.OS === 'web') window.alert("Xóa thất bại");
            else Alert.alert("Lỗi", "Xóa thất bại");
        }
    };

    const handleDelete = (item) => {
        if (Platform.OS === 'web') {
            if (window.confirm(`Bạn có chắc muốn xóa "${item.fullName || item.email}"?`)) {
                executeDelete(item);
            }
        } else {
            Alert.alert(
                "Xác nhận xóa",
                `Bạn có chắc muốn xóa "${item.fullName || item.email}"?`,
                [
                    { text: "Hủy", style: "cancel" },
                    { text: "Xóa", style: "destructive", onPress: () => executeDelete(item) }
                ]
            );
        }
    };

    const executeToggleLock = async (item, action) => {
        try {
            await userAPI.toggleLock(item.id);
            if (Platform.OS === 'web') window.alert(`Đã ${action.toLowerCase()} tài khoản`);
            else Alert.alert("Thành công", `Đã ${action.toLowerCase()} tài khoản`);
            fetchUsers();
            if (selectedUser && selectedUser.id === item.id) {
                setSelectedUser({ ...selectedUser, isLocked: !selectedUser.isLocked });
            }
        } catch (error) {
            if (Platform.OS === 'web') window.alert("Thất bại");
            else Alert.alert("Lỗi", "Thất bại");
        }
    };

    const handleToggleLock = async (item) => {
        const action = item.isLocked ? 'Mở khóa' : 'Khóa';
        if (Platform.OS === 'web') {
            if (window.confirm(`Bạn có chắc muốn ${action.toLowerCase()} tài khoản "${item.fullName || item.email}"?`)) {
                executeToggleLock(item, action);
            }
        } else {
            Alert.alert(
                `${action} tài khoản`,
                `Bạn có chắc muốn ${action.toLowerCase()} tài khoản "${item.fullName || item.email}"?`,
                [
                    { text: "Hủy", style: "cancel" },
                    { text: action, onPress: () => executeToggleLock(item, action) }
                ]
            );
        }
    };

    const openDetail = (item) => {
        setSelectedUser(item);
        setDetailModal(true);
    };

    const formatCurrency = (val) => Number(val || 0).toLocaleString('vi-VN') + ' ₫';

    const getRankColor = (hang) => {
        if (hang === 'Vang' || hang === 'S-VIP') return '#f59e0b';
        if (hang === 'Bac' || hang === 'S-MEM') return '#6b7280';
        return '#d97706';
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.charAt(0).toUpperCase();
    };

    const filteredUsers = users.filter(u => 
        u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone?.includes(searchQuery)
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Quản lý khách hàng</Text>
                <Text style={styles.countBadge}>{filteredUsers.length} KH</Text>
            </View>

            {/* Search Box */}
            <View style={styles.searchBox}>
                <Ionicons name="search" size={20} color="#9ca3af" />
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Tìm theo tên, email, sđt..." 
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                )}
            </View>

            {loading ? <ActivityIndicator size="large" color="#3b82f6" style={{marginTop: 20}} /> : (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.row} onPress={() => openDetail(item)} activeOpacity={0.7}>
                            <View style={[styles.avatar, { backgroundColor: item.role === 'ROLE_ADMIN' ? '#3b82f6' : '#e0e7ff' }]}>
                                <Text style={[styles.avatarText, { color: item.role === 'ROLE_ADMIN' ? '#fff' : '#3b82f6' }]}>
                                    {getInitials(item.fullName || item.email)}
                                </Text>
                            </View>
                            <View style={styles.rowInfo}>
                                <View style={styles.nameRow}>
                                    <Text style={styles.rowTitle} numberOfLines={1}>{item.fullName || 'Chưa đặt tên'}</Text>
                                    {item.isLocked && (
                                        <View style={styles.lockedBadge}>
                                            <Ionicons name="lock-closed" size={10} color="#fff" />
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.rowEmail}>{item.email}</Text>
                                <View style={styles.tagRow}>
                                    <Text style={[styles.roleTag, item.role === 'ROLE_ADMIN' && styles.adminTag]}>
                                        {item.role === 'ROLE_ADMIN' ? 'Admin' : 'Khách hàng'}
                                    </Text>
                                    {item.hang && (
                                        <Text style={[styles.rankTag, { color: getRankColor(item.hang) }]}>
                                            {item.hang}
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <View style={styles.actionCol}>
                                <TouchableOpacity style={styles.actionBtn} onPress={() => openDetail(item)}>
                                    <Ionicons name="eye-outline" size={16} color="#3b82f6" />
                                </TouchableOpacity>
                                {item.role !== 'ROLE_ADMIN' && (
                                    <>
                                        <TouchableOpacity
                                            style={[styles.actionBtn, { backgroundColor: item.isLocked ? '#dcfce7' : '#fef3c7' }]}
                                            onPress={() => handleToggleLock(item)}
                                        >
                                            <Ionicons name={item.isLocked ? 'lock-open-outline' : 'lock-closed-outline'} size={16} color={item.isLocked ? '#16a34a' : '#f59e0b'} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#fee2e2' }]} onPress={() => handleDelete(item)}>
                                            <Ionicons name="trash-outline" size={16} color="#ef4444" />
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* Detail Modal */}
            <Modal visible={detailModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chi tiết khách hàng</Text>
                            <TouchableOpacity onPress={() => setDetailModal(false)}>
                                <Ionicons name="close" size={24} color="#111" />
                            </TouchableOpacity>
                        </View>
                        {selectedUser && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {/* Profile Header */}
                                <View style={styles.profileHeader}>
                                    <View style={[styles.profileAvatar, { backgroundColor: selectedUser.role === 'ROLE_ADMIN' ? '#3b82f6' : '#e0e7ff' }]}>
                                        <Text style={[styles.profileAvatarText, { color: selectedUser.role === 'ROLE_ADMIN' ? '#fff' : '#3b82f6' }]}>
                                            {getInitials(selectedUser.fullName || selectedUser.email)}
                                        </Text>
                                    </View>
                                    <Text style={styles.profileName}>{selectedUser.fullName || 'Chưa đặt tên'}</Text>
                                    <Text style={styles.profileEmail}>{selectedUser.email}</Text>
                                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                                        <Text style={[styles.roleTag, selectedUser.role === 'ROLE_ADMIN' && styles.adminTag, { fontSize: 13, paddingHorizontal: 12, paddingVertical: 4 }]}>
                                            {selectedUser.role === 'ROLE_ADMIN' ? '🛡️ Admin' : '👤 Khách hàng'}
                                        </Text>
                                        {selectedUser.isLocked && (
                                            <Text style={{ backgroundColor: '#fef2f2', color: '#dc2626', fontSize: 13, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, fontWeight: '700', overflow: 'hidden' }}>
                                                🔒 Đã khóa
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {/* Info Rows */}
                                <View style={styles.infoCard}>
                                    <InfoRow icon="call-outline" label="Số điện thoại" value={selectedUser.phone || 'Chưa cập nhật'} />
                                    <InfoRow icon="location-outline" label="Địa chỉ" value={selectedUser.address || 'Chưa cập nhật'} />
                                    <InfoRow icon="calendar-outline" label="Ngày sinh" value={selectedUser.ngaySinh ? new Date(selectedUser.ngaySinh).toLocaleDateString('vi-VN') : 'Chưa cập nhật'} />
                                    <InfoRow icon="male-female-outline" label="Giới tính" value={selectedUser.sex || 'Chưa cập nhật'} />
                                    <InfoRow icon="diamond-outline" label="Hạng thành viên" value={selectedUser.hang || 'Dong'} color={getRankColor(selectedUser.hang)} />
                                    <InfoRow icon="wallet-outline" label="Tổng tiền đã mua" value={formatCurrency(selectedUser.tongTienDaMua)} color="#d70018" />
                                    <InfoRow icon="globe-outline" label="Đăng nhập qua" value={selectedUser.provider || 'Email'} />
                                </View>

                                {/* Actions */}
                                {selectedUser.role !== 'ROLE_ADMIN' && (
                                    <View style={styles.modalActions}>
                                        <TouchableOpacity
                                            style={[styles.modalActionBtn, { backgroundColor: selectedUser.isLocked ? '#16a34a' : '#f59e0b' }]}
                                            onPress={() => handleToggleLock(selectedUser)}
                                        >
                                            <Ionicons name={selectedUser.isLocked ? 'lock-open' : 'lock-closed'} size={18} color="#fff" style={{ marginRight: 6 }} />
                                            <Text style={styles.modalActionText}>{selectedUser.isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const InfoRow = ({ icon, label, value, color }) => (
    <View style={infoStyles.row}>
        <Ionicons name={icon} size={18} color="#64748b" style={{ marginRight: 10 }} />
        <View style={{ flex: 1 }}>
            <Text style={infoStyles.label}>{label}</Text>
            <Text style={[infoStyles.value, color && { color }]}>{value}</Text>
        </View>
    </View>
);

const infoStyles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    label: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
    value: { fontSize: 14, color: '#1f2937', fontWeight: '600', marginTop: 2 },
});

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 60, backgroundColor: '#f4f7fe' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#1f2937' },
    countBadge: { backgroundColor: '#06b6d4', color: '#fff', fontWeight: '700', fontSize: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
    searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 16 },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1f2937' },
    row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 },
    avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    avatarText: { fontSize: 18, fontWeight: '800' },
    rowInfo: { flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'center' },
    rowTitle: { fontWeight: '700', fontSize: 15, color: '#1f2937', flex: 1 },
    lockedBadge: { backgroundColor: '#ef4444', width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginLeft: 6 },
    rowEmail: { color: '#64748b', fontSize: 12, marginTop: 2 },
    tagRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
    roleTag: { fontSize: 10, fontWeight: '700', color: '#3b82f6', backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
    adminTag: { color: '#dc2626', backgroundColor: '#fef2f2' },
    rankTag: { fontSize: 10, fontWeight: '700', backgroundColor: '#fffbeb', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
    actionCol: { gap: 4 },
    actionBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '85%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
    modalTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
    profileHeader: { alignItems: 'center', paddingVertical: 20 },
    profileAvatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    profileAvatarText: { fontSize: 28, fontWeight: '800' },
    profileName: { fontSize: 20, fontWeight: '800', color: '#111' },
    profileEmail: { fontSize: 13, color: '#64748b', marginTop: 4 },
    infoCard: { backgroundColor: '#f8fafc', borderRadius: 14, padding: 16, marginBottom: 16 },
    modalActions: { marginBottom: 20 },
    modalActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12 },
    modalActionText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

export default UsersScreen;
