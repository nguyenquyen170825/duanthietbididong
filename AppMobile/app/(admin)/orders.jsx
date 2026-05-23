import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, AppState, TextInput, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { orderAPI } from '../../services/api';

const STATUS_OPTIONS = [
    { label: 'Chờ xác nhận', value: 'Chờ xác nhận', color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Đã xác nhận', value: 'Đã xác nhận', color: '#3b82f6', bg: '#dbeafe' },
    { label: 'Đang xử lý', value: 'Đang xử lý', color: '#8b5cf6', bg: '#ede9fe' },
    { label: 'Đang giao hàng', value: 'Đang giao hàng', color: '#f97316', bg: '#ffedd5' },
    { label: 'Giao hàng thành công', value: 'Giao hàng thành công', color: '#16a34a', bg: '#dcfce7' },
    { label: 'Đã hủy', value: 'Đã hủy', color: '#dc2626', bg: '#fee2e2' },
    { label: 'Từ chối yêu cầu', value: 'Từ chối yêu cầu', color: '#9f1239', bg: '#ffe4e6' },
];

const getStatusStyle = (status) => {
    const found = STATUS_OPTIONS.find(s => s.value === status);
    return found || { color: '#6b7280', bg: '#f3f4f6' };
};

const POLL_INTERVAL = 5000; // 5 giây auto-refresh

const OrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('ACTIVE');
    const intervalRef = useRef(null);
    const appState = useRef(AppState.currentState);

    const fetchOrders = useCallback(async (showLoader = false) => {
        if (showLoader) setLoading(true);
        try {
            const data = await orderAPI.getAll();
            setOrders(data || []);
            if (showLoader) {
                setSelectedStatus({}); // Only reset on initial load or manual refresh
            }
        } catch (error) {
            if (showLoader) {
                Alert.alert("Lỗi", "Không thể tải đơn hàng");
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Auto-refresh (polling) mỗi 5 giây
    useEffect(() => {
        fetchOrders(true);

        intervalRef.current = setInterval(() => {
            fetchOrders(false);
        }, POLL_INTERVAL);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [fetchOrders]);

    // Pause polling khi app ở background, resume khi foreground
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // App quay lại foreground -> fetch ngay + restart polling
                fetchOrders(false);
                if (intervalRef.current) clearInterval(intervalRef.current);
                intervalRef.current = setInterval(() => {
                    fetchOrders(false);
                }, POLL_INTERVAL);
            } else if (nextAppState.match(/inactive|background/)) {
                // App vào background -> dừng polling
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
            appState.current = nextAppState;
        });

        return () => subscription?.remove();
    }, [fetchOrders]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchOrders(false);
    }, [fetchOrders]);

    const updateStatus = async (id, status) => {
        try {
            await orderAPI.updateStatus(id, status);
            if (Platform.OS === 'web') {
                window.alert(`Đã cập nhật trạng thái: ${status}`);
            } else {
                Alert.alert("Thành công", `Đã cập nhật trạng thái: ${status}`);
            }
            setSelectedStatus(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
            fetchOrders(false);
        } catch (error) {
            Alert.alert("Lỗi", "Đổi trạng thái thất bại");
        }
    };

    const handleSelectStatus = (orderId, status) => {
        setSelectedStatus(prev => ({ ...prev, [orderId]: status }));
    };

    const handleSaveStatus = (orderId, currentStatus) => {
        const newStatus = selectedStatus[orderId];
        if (newStatus && newStatus !== currentStatus) {
            if (Platform.OS === 'web') {
                const isConfirmed = window.confirm(`Bạn có chắc chắn muốn chuyển trạng thái đơn hàng thành "${newStatus}" không?`);
                if (isConfirmed) {
                    updateStatus(orderId, newStatus);
                }
            } else {
                Alert.alert(
                    "Xác nhận cập nhật",
                    `Bạn có chắc chắn muốn chuyển trạng thái đơn hàng thành "${newStatus}" không?`,
                    [
                        { text: "Hủy", style: "cancel" },
                        { 
                            text: "Xác nhận", 
                            style: "default",
                            onPress: () => updateStatus(orderId, newStatus)
                        }
                    ]
                );
            }
        }
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const formatPrice = (amount) => {
        if (!amount) return '0 ₫';
        return Number(amount).toLocaleString('vi-VN') + ' ₫';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const renderOrderItem = ({ item }) => {
        const statusStyle = getStatusStyle(item.orderStatus);
        const isExpanded = expandedId === item.id;

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.8}
            >
                {/* Header */}
                <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.orderCodeRow}>
                            <Text style={styles.orderCode}>{item.orderCode || `#${item.id}`}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                                <Text style={[styles.statusText, { color: statusStyle.color }]}>
                                    {item.orderStatus || 'Chờ xác nhận'}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.customerName}>
                            <Ionicons name="person-outline" size={13} color="#6b7280" /> {item.fullName || 'N/A'}
                        </Text>
                        <Text style={styles.orderDate}>
                            <Ionicons name="time-outline" size={13} color="#9ca3af" /> {formatDate(item.orderDate)}
                        </Text>
                    </View>
                    <View style={styles.totalBox}>
                        <Text style={styles.totalLabel}>Tổng tiền</Text>
                        <Text style={styles.totalValue}>{formatPrice(item.totalAmount)}</Text>
                    </View>
                </View>

                {/* Expanded Details */}
                {isExpanded && (
                    <View style={styles.expandedSection}>
                        <View style={styles.divider} />

                        {/* Customer Info */}
                        <View style={styles.infoRow}>
                            <Ionicons name="call-outline" size={14} color="#6b7280" />
                            <Text style={styles.infoText}>{item.phone || 'N/A'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="mail-outline" size={14} color="#6b7280" />
                            <Text style={styles.infoText}>{item.email || 'N/A'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={14} color="#6b7280" />
                            <Text style={styles.infoText}>{item.shippingAddress || 'N/A'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="card-outline" size={14} color="#6b7280" />
                            <Text style={styles.infoText}>Thanh toán: {item.paymentMethod || 'COD'}</Text>
                        </View>

                        {/* Order Items */}
                        {item.orderDetails && item.orderDetails.length > 0 && (
                            <View style={styles.itemsSection}>
                                <Text style={styles.itemsSectionTitle}>Sản phẩm ({item.orderDetails.length})</Text>
                                {item.orderDetails.map((detail, idx) => (
                                    <View key={idx} style={styles.orderDetailRow}>
                                        <Text style={styles.detailName} numberOfLines={1}>{detail.productName}</Text>
                                        <Text style={styles.detailQty}>x{detail.quantity}</Text>
                                        <Text style={styles.detailPrice}>{formatPrice(detail.unitPrice)}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Status Actions */}
                        <View style={styles.divider} />
                        <Text style={styles.actionLabel}>Cập nhật trạng thái:</Text>
                        <View style={styles.statusActions}>
                            {STATUS_OPTIONS.map(opt => {
                                const isCurrent = item.orderStatus === opt.value;
                                const isSelected = selectedStatus[item.id] === opt.value;
                                const isActive = isSelected || (isCurrent && !selectedStatus[item.id]);

                                return (
                                    <TouchableOpacity
                                        key={opt.value}
                                        style={[
                                            styles.statusBtn,
                                            { borderColor: opt.color },
                                            isActive && { backgroundColor: opt.bg }
                                        ]}
                                        onPress={() => handleSelectStatus(item.id, opt.value)}
                                    >
                                        <Text style={[
                                            styles.statusBtnText,
                                            { color: opt.color },
                                            isActive && { fontWeight: '800' }
                                        ]}>
                                            {isActive ? '✓ ' : ''}{opt.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Save Button */}
                        {selectedStatus[item.id] && selectedStatus[item.id] !== item.orderStatus && (
                            <TouchableOpacity 
                                style={styles.saveStatusBtn}
                                onPress={() => handleSaveStatus(item.id, item.orderStatus)}
                            >
                                <Ionicons name="save" size={16} color="#fff" style={{marginRight: 6}} />
                                <Text style={styles.saveStatusBtnText}>Lưu trạng thái mới</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Expand indicator */}
                <View style={styles.expandIndicator}>
                    <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} color="#9ca3af" />
                </View>
            </TouchableOpacity>
        );
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.orderCode?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              o.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              o.phone?.includes(searchQuery);
        
        let matchesFilter = false;
        if (filterStatus === 'ACTIVE') {
            matchesFilter = !['Giao hàng thành công', 'Đã hủy', 'Từ chối yêu cầu'].includes(o.orderStatus);
        } else if (filterStatus === 'ALL') {
            matchesFilter = true;
        } else {
            matchesFilter = o.orderStatus === filterStatus;
        }

        return matchesSearch && matchesFilter;
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Quản lý đơn hàng</Text>
                <View style={styles.headerRight}>
                    <View style={styles.liveBadge}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>Live</Text>
                    </View>
                    <Text style={styles.orderCount}>{filteredOrders.length} đơn</Text>
                </View>
            </View>

            {/* Search Box */}
            <View style={styles.searchBox}>
                <Ionicons name="search" size={20} color="#9ca3af" />
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Tìm theo mã đơn, tên, sđt..." 
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    <TouchableOpacity 
                        style={[
                            styles.filterTab, 
                            { backgroundColor: '#e5e7eb' },
                            filterStatus === 'ACTIVE' && { backgroundColor: '#1f2937' }
                        ]}
                        onPress={() => setFilterStatus('ACTIVE')}
                    >
                        <Text style={[
                            styles.filterTabText, 
                            { color: '#4b5563' },
                            filterStatus === 'ACTIVE' && { color: '#ffffff' }
                        ]}>
                            Chưa hoàn thành
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.filterTab, 
                            { backgroundColor: '#e5e7eb' },
                            filterStatus === 'ALL' && { backgroundColor: '#1f2937' }
                        ]}
                        onPress={() => setFilterStatus('ALL')}
                    >
                        <Text style={[
                            styles.filterTabText, 
                            { color: '#4b5563' },
                            filterStatus === 'ALL' && { color: '#ffffff' }
                        ]}>
                            Tất cả
                        </Text>
                    </TouchableOpacity>
                    {STATUS_OPTIONS.map(opt => {
                        const isActive = filterStatus === opt.value;
                        return (
                            <TouchableOpacity 
                                key={opt.value}
                                style={[
                                    styles.filterTab, 
                                    { backgroundColor: opt.bg },
                                    isActive && { backgroundColor: opt.color }
                                ]}
                                onPress={() => setFilterStatus(opt.value)}
                            >
                                <Text style={[
                                    styles.filterTabText, 
                                    { color: opt.color },
                                    isActive && { color: '#ffffff' }
                                ]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#d70018" />
                    <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredOrders}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderOrderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#d70018']} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="receipt-outline" size={48} color="#9ca3af" />
                            <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f7fe', paddingTop: 50 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
    title: { fontSize: 22, fontWeight: '800', color: '#1f2937' },
    headerRight: { flexDirection: 'row', alignItems: 'center' },
    liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 10 },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#16a34a', marginRight: 4 },
    liveText: { fontSize: 11, fontWeight: '700', color: '#16a34a' },
    orderCount: { fontSize: 13, color: '#6b7280', fontWeight: '600' },
    
    searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginHorizontal: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1f2937' },

    filterContainer: { paddingLeft: 16, marginBottom: 16, height: 32 },
    filterScroll: { paddingRight: 32, gap: 8 },
    filterTab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#e5e7eb' },
    filterTabActive: { backgroundColor: '#1f2937' },
    filterTabText: { fontSize: 13, fontWeight: '600', color: '#4b5563' },
    filterTabTextActive: { color: '#ffffff' },

    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, color: '#6b7280', fontSize: 14 },

    card: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    orderCodeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    orderCode: { fontSize: 15, fontWeight: '800', color: '#1f2937', marginRight: 8 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    statusText: { fontSize: 11, fontWeight: '700' },
    customerName: { fontSize: 13, color: '#4b5563', marginBottom: 2 },
    orderDate: { fontSize: 12, color: '#9ca3af' },
    totalBox: { alignItems: 'flex-end' },
    totalLabel: { fontSize: 11, color: '#9ca3af', marginBottom: 2 },
    totalValue: { fontSize: 15, fontWeight: '800', color: '#d70018' },

    expandedSection: { marginTop: 8 },
    divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    infoText: { fontSize: 13, color: '#4b5563', marginLeft: 8, flex: 1 },

    itemsSection: { marginTop: 8 },
    itemsSectionTitle: { fontSize: 13, fontWeight: '700', color: '#1f2937', marginBottom: 6 },
    orderDetailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
    detailName: { flex: 1, fontSize: 13, color: '#4b5563' },
    detailQty: { fontSize: 13, color: '#6b7280', fontWeight: '600', marginHorizontal: 10 },
    detailPrice: { fontSize: 13, fontWeight: '700', color: '#1f2937', minWidth: 90, textAlign: 'right' },

    actionLabel: { fontSize: 12, fontWeight: '700', color: '#6b7280', marginBottom: 8 },
    statusActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    statusBtn: { borderWidth: 1.5, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 4 },
    statusBtnText: { fontSize: 11, fontWeight: '600' },
    
    saveStatusBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d70018', paddingVertical: 10, borderRadius: 8, marginTop: 12 },
    saveStatusBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '800' },

    expandIndicator: { alignItems: 'center', marginTop: 6 },

    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
    emptyText: { marginTop: 12, fontSize: 15, color: '#6b7280', fontWeight: '600' },
});

export default OrdersScreen;
