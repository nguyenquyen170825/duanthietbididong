import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BottomNav from '../components/BottomNav';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { API_BASE_URL, fixImageUrl, IMAGE_BASE_URL } from '../config/apiConfig';
import OtpInput from '../components/OtpInput';
import { CameraView, useCameraPermissions } from 'expo-camera';

const MOCK_ORDERS = [
  {
    id: "DH385961",
    createdAt: "20/05/2026",
    status: "Hoàn thành",
    totalAmount: 31280000,
    address: "123 Đường Ba Tháng Hai, Quận 10, TP.HCM",
    phone: "0912345678",
    items: [
      { id: 101, title: "iPhone 15 Pro Max 256GB - Titan Tự Nhiên", quantity: 1, price: 27990000, imageUrl: "/images/iphone15promax.png" },
      { id: 102, title: "Ốp lưng MagSafe Silicone iPhone 15 Pro Max", quantity: 1, price: 1290000, imageUrl: "/images/magsafe-case.png" }
    ]
  },
  {
    id: "DH194862",
    createdAt: "18/05/2026",
    status: "Đang giao",
    totalAmount: 23112000,
    address: "456 Lê Hồng Phong, Quận 5, TP.HCM",
    phone: "0912345678",
    items: [
      { id: 103, title: "Apple MacBook Air M2 8GB 256GB", quantity: 1, price: 23112000, imageUrl: "/images/macbook-air-m2.png" }
    ]
  },
  {
    id: "DH827461",
    createdAt: "15/05/2026",
    status: "Đang xử lý",
    totalAmount: 4290000,
    address: "789 Nguyễn Đình Chiểu, Quận 3, TP.HCM",
    phone: "0912345678",
    items: [
      { id: 104, title: "AirPods Pro 2 USB-C", quantity: 1, price: 4290000, imageUrl: "/images/airpods-pro-2.png" }
    ]
  },
  {
    id: "DH103982",
    createdAt: "05/05/2026",
    status: "Đã hủy",
    totalAmount: 8990000,
    address: "123 Đường Ba Tháng Hai, Quận 10, TP.HCM",
    phone: "0912345678",
    items: [
      { id: 105, title: "Apple Watch Series 9 GPS 45mm", quantity: 1, price: 8990000, imageUrl: "/images/apple-watch-s9.png" }
    ]
  }
];

export default function AccountScreen() {
  const router = useRouter();
  const { cartCount } = useCart();
  const { isLoggedIn, logout, user, refreshProfile } = useAuth();
  const { showToast } = useToast();
  
  // Navigation & UI states
  const [activeTab, setActiveTab] = useState('lich-su'); // Mặc định Lịch sử mua hàng
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Profile Form States
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Change Password States
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Warranty States
  const [skuInput, setSkuInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [warrantyResult, setWarrantyResult] = useState(null);
  const [checkingWarranty, setCheckingWarranty] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
      setFullName(user?.fullName || '');
      setPhone(user?.phone || '');
      setEmail(user?.email || '');
      setAddress(user?.address || '');
    }
  }, [isLoggedIn, user]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const formatShortCurrency = (amount) => {
    const num = Number(amount) || 0;
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  const getRankInfo = (total) => {
    const amount = Number(total) || 0;
    if (amount < 5000000) {
      return { current: 'S-NEW', next: 'S-MEM', missing: 5000000 - amount, progress: (amount / 5000000) * 100 };
    } else if (amount < 50000000) {
      return { current: 'S-MEM', next: 'S-VIP', missing: 50000000 - amount, progress: (amount / 50000000) * 100 };
    } else {
      return { current: 'S-VIP', next: 'MAX', missing: 0, progress: 100 };
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const res = await axios.get(`${API_BASE_URL}/user/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && Array.isArray(res.data)) {
          // Backend đã format sẵn, chỉ cần lấy trực tiếp
          const formatted = res.data.map(order => ({
            id: order.id || `DH${order.orderId}`,
            orderId: order.orderId,
            createdAt: order.createdAt || '',
            status: order.status || 'Đang xử lý',
            totalAmount: Number(order.totalAmount || 0),
            address: order.address || 'Chưa cập nhật địa chỉ',
            phone: order.phone || user?.phone || 'Chưa cập nhật SĐT',
            paymentMethod: order.paymentMethod || 'COD',
            items: (order.items || []).map(item => ({
              id: item.id,
              title: item.title || 'Thiết bị công nghệ',
              quantity: item.quantity,
              price: item.price,
              imageUrl: item.imageUrl || ''
            }))
          }));
          setOrders(formatted);
        } else {
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    } catch (e) {
      console.log('Error fetching orders:', e);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCheckWarranty = async (skuToCheck = skuInput) => {
    if (!skuToCheck) {
      Alert.alert('Lỗi', 'Vui lòng nhập hoặc quét mã SKU');
      return;
    }
    setCheckingWarranty(true);
    setWarrantyResult(null);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE_URL}/user/warranty?sku=${skuToCheck}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWarrantyResult(res.data);
      setIsScanning(false);
    } catch (e) {
      const msg = e.response?.data?.message || 'Không thể kiểm tra bảo hành.';
      Alert.alert('Thông báo', msg);
    } finally {
      setCheckingWarranty(false);
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (!isScanning) return;
    setSkuInput(data);
    setIsScanning(false);
    handleCheckWarranty(data);
  };

  const startScanning = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert('Lỗi', 'Cần cấp quyền Camera để quét mã vạch.');
        return;
      }
    }
    setIsScanning(true);
    setWarrantyResult(null);
  };

  const handleUpdateProfile = async () => {
    if (!fullName || !phone) {
      Alert.alert('Lỗi', 'Vui lòng nhập Họ tên và Số điện thoại.');
      return;
    }
    setSavingProfile(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.put(`${API_BASE_URL}/user/me`, { fullName, phone }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (refreshProfile) await refreshProfile();
      showToast({ message: 'Cập nhật thông tin thành công!', type: 'success' });
    } catch (e) {
      showToast({ message: 'Không thể lưu thông tin. Vui lòng thử lại.', type: 'error' });
      console.log('Update profile error:', e);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRequestPasswordOtp = async () => {
    if (countdown > 0) {
      Alert.alert('Thông báo', `Vui lòng đợi ${countdown} giây để gửi lại mã OTP.`);
      return;
    }
    if (!user?.email) {
      Alert.alert('Lỗi', 'Không tìm thấy địa chỉ email của bạn.');
      return;
    }
    setSendingOtp(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email: user.email });
      setSendingOtp(false);
      setCountdown(30);
      setShowOtpForm(true);
      Alert.alert('Thành công', 'Mã OTP đã được gửi về email của bạn! Vui lòng kiểm tra hộp thư.');
    } catch (error) {
      setSendingOtp(false);
      const msg = error.response?.data?.message || 'Gửi mã OTP thất bại.';
      Alert.alert('Lỗi', msg);
    }
  };

  const handleChangePassword = async () => {
    if (!otpCode || !newPassword || !confirmNewPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ mã OTP và mật khẩu mới.');
      return;
    }
    if (otpCode.length !== 6) {
      Alert.alert('Lỗi', 'Mã OTP phải có đúng 6 chữ số.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không trùng khớp.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải từ 6 ký tự trở lên.');
      return;
    }
    setChangingPass(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, { 
        email: user?.email, 
        otp: otpCode, 
        newPassword: newPassword 
      });
      setChangingPass(false);
      setShowOtpForm(false);
      setOtpCode('');
      setNewPassword('');
      setConfirmNewPassword('');
      Alert.alert('Thành công', 'Đổi mật khẩu thành công!');
    } catch (error) {
      setChangingPass(false);
      const msg = error.response?.data?.message || 'Đổi mật khẩu thất bại.';
      Alert.alert('Lỗi', msg);
    }
  };

  const resolveImage = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return fixImageUrl(url);
    const baseUrl = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
    const path = url.startsWith('/') ? url : '/' + url;
    return baseUrl + path;
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0';
    return Number(price).toLocaleString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hoàn thành':
        return { bg: '#e8f5e9', text: '#2e7d32' };
      case 'Đang giao':
        return { bg: '#e3f2fd', text: '#1565c0' };
      case 'Đang xử lý':
        return { bg: '#fff3e0', text: '#ef6c00' };
      case 'Đã hủy':
        return { bg: '#ffebee', text: '#c62828' };
      default:
        return { bg: '#f3f4f6', text: '#4b5563' };
    }
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={{ width: 28 }} />
          <Text style={styles.brandText}>PHONEHUB</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={[styles.loginRequiredContainer, { flex: 1, justifyContent: 'center' }]}>
          <Ionicons name="person-circle-outline" size={80} color="#d1d5db" style={{ marginBottom: 16 }} />
          <Text style={styles.loginRequiredTitle}>Smember Account</Text>
          <Text style={styles.loginRequiredDesc}>Đăng nhập để xem lịch sử đơn hàng, tích điểm Smember và nhận vô vàn ưu đãi đặc quyền.</Text>

          <TouchableOpacity 
            style={styles.loginBtn} 
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginBtnText}>Đăng nhập ngay</Text>
          </TouchableOpacity>
        </View>

        <BottomNav activeTab="account" />
      </SafeAreaView>
    );
  }

  // Sidebar Menu items list
  const menuItems = [
    { id: 'tong-quan', title: 'Tổng quan', icon: 'card-outline' },
    { id: 'lich-su', title: 'Đơn hàng', icon: 'time-outline' },
    { id: 'thong-tin', title: 'Tài khoản', icon: 'person-outline' },
    { id: 'bao-hanh', title: 'Bảo hành', icon: 'shield-checkmark-outline' },
    { id: 'hang-thanh-vien', title: 'Hạng & ưu đãi', icon: 'ribbon-outline' },
    { id: 'doi-mat-khau', title: 'Đổi mật khẩu', icon: 'key-outline' },
  ];

  // Filter orders logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.items.some(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'Tất cả' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 28 }} />
        <Text style={styles.brandText}>PHONEHUB</Text>
        <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/cart')}>
          <Ionicons name="cart" size={24} color="#111827" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Main Two-Column Layout */}
      <View style={styles.mainContainer}>
        
        {/* LEFT COLUMN: Sidebar (28%) */}
        <View style={styles.sidebar}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sidebarSectionTitle}>QUẢN LÝ</Text>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  onPress={() => {
                    setActiveTab(item.id);
                    setExpandedOrderId(null);
                  }}
                >
                  <Ionicons 
                    name={item.icon} 
                    size={16} 
                    color={isActive ? '#d70018' : '#4b5563'} 
                    style={styles.menuIcon} 
                  />
                  <Text style={[styles.menuText, isActive && styles.menuTextActive]} numberOfLines={2}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <View style={styles.sidebarDivider} />

            <TouchableOpacity style={styles.sidebarLogoutBtn} onPress={logout}>
              <Ionicons name="log-out-outline" size={16} color="#dc2626" style={styles.menuIcon} />
              <Text style={styles.sidebarLogoutText}>Đăng xuất</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* RIGHT COLUMN: Content (72%) */}
        <View style={styles.contentContainer}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentScroll}>
            
            {/* TAB: LỊCH SỬ ĐƠN HÀNG */}
            {activeTab === 'lich-su' && (
              <View>
                <Text style={styles.contentTitle}>Đơn hàng của bạn</Text>
                <Text style={styles.contentSubtitle}>Xem trạng thái và lịch sử tất cả các đơn hàng đã đặt</Text>

                {/* Search Order bar */}
                <View style={styles.searchBarContainer}>
                  <Ionicons name="search" size={16} color="#9ca3af" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm theo mã đơn hoặc sản phẩm..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                {/* Status Filter Chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsScrollContent}>
                  {['Tất cả', 'Đang xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy'].map((status) => {
                    const isSelected = statusFilter === status;
                    return (
                      <TouchableOpacity
                        key={status}
                        style={[styles.statusChip, isSelected && styles.statusChipActive]}
                        onPress={() => setStatusFilter(status)}
                      >
                        <Text style={[styles.statusChipText, isSelected && styles.statusChipTextActive]}>
                          {status}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Orders List */}
                {loadingOrders ? (
                  <ActivityIndicator size="large" color="#d70018" style={{ marginTop: 40 }} />
                ) : filteredOrders.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconWrap}>
                      <Ionicons name="receipt-outline" size={40} color="#d70018" />
                    </View>
                    <Text style={styles.emptyTitle}>
                      {searchQuery || statusFilter !== 'Tất cả'
                        ? 'Không tìm thấy đơn hàng'
                        : 'Bạn chưa có đơn hàng nào'}
                    </Text>
                    <Text style={styles.emptySubText}>
                      {searchQuery || statusFilter !== 'Tất cả'
                        ? 'Thử tìm với từ khóa khác hoặc bỏ bộ lọc'
                        : 'Hãy khám phá và đặt mua sản phẩm đầu tiên của bạn tại PhoneHub!'}
                    </Text>
                    {!searchQuery && statusFilter === 'Tất cả' && (
                      <TouchableOpacity
                        style={styles.shopNowBtn}
                        onPress={() => router.push('/home')}
                      >
                        <Ionicons name="storefront-outline" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                        <Text style={styles.shopNowBtnText}>Mua sắm ngay</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  filteredOrders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;
                    const statusColor = getStatusColor(order.status);
                    return (
                      <View key={order.id} style={styles.orderCard}>
                        {/* Order Card Header */}
                        <View style={styles.orderCardHeader}>
                          <View>
                            <Text style={styles.orderIdText}>Mã: {order.id}</Text>
                            <Text style={styles.orderDateText}>{order.createdAt}</Text>
                          </View>
                          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                            <Text style={[styles.statusBadgeText, { color: statusColor.text }]}>{order.status}</Text>
                          </View>
                        </View>

                        {/* Order Items List */}
                        <View style={styles.orderItemsList}>
                          {order.items.map((item, idx) => (
                            <View key={item.id || idx} style={styles.orderItemRow}>
                              <View style={styles.orderItemImageContainer}>
                                {resolveImage(item.imageUrl) ? (
                                  <Image source={{ uri: resolveImage(item.imageUrl) }} style={styles.orderItemImage} resizeMode="contain" />
                                ) : (
                                  <Ionicons name="phone-portrait-outline" size={20} color="#9ca3af" />
                                )}
                              </View>
                              <View style={styles.orderItemInfo}>
                                <Text style={styles.orderItemTitle} numberOfLines={1}>{item.title}</Text>
                                <Text style={styles.orderItemQty}>Số lượng: {item.quantity}</Text>
                              </View>
                              <Text style={styles.orderItemPrice}>{formatPrice(item.price)} đ</Text>
                            </View>
                          ))}
                        </View>

                        {/* Expandable Details Panel */}
                        {isExpanded && (
                          <View style={styles.expandedPanel}>
                            <View style={styles.expandedRow}>
                              <Text style={styles.expandedLabel}>Điện thoại nhận hàng:</Text>
                              <Text style={styles.expandedVal}>{order.phone}</Text>
                            </View>
                            <View style={styles.expandedRow}>
                              <Text style={styles.expandedLabel}>Địa chỉ giao hàng:</Text>
                              <Text style={styles.expandedVal}>{order.address}</Text>
                            </View>
                            <View style={styles.expandedRow}>
                              <Text style={styles.expandedLabel}>Thanh toán:</Text>
                              <Text style={styles.expandedVal}>Nhận hàng trả tiền (COD)</Text>
                            </View>
                            <View style={styles.expandedRow}>
                              <Text style={styles.expandedLabel}>Phí vận chuyển:</Text>
                              <Text style={[styles.expandedVal, { color: '#2e7d32', fontWeight: '700' }]}>Miễn phí</Text>
                            </View>
                          </View>
                        )}

                        {/* Order Card Footer */}
                        <View style={styles.orderCardFooter}>
                          <TouchableOpacity 
                            style={styles.detailBtn}
                            onPress={() => setExpandedOrderId(isExpanded ? null : order.id)}
                          >
                            <Text style={styles.detailBtnText}>{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</Text>
                            <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={14} color="#d70018" />
                          </TouchableOpacity>
                          
                          <View style={styles.totalPriceContainer}>
                            <Text style={styles.totalPriceLabel}>Tổng tiền: </Text>
                            <Text style={styles.totalPriceVal}>
                              {formatPrice(order.totalAmount)} <Text style={styles.totalPriceVnd}>đ</Text>
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })
                )}

                <TouchableOpacity style={styles.loadMoreBtn} onPress={() => Alert.alert('Thông báo', 'Đã hiển thị toàn bộ đơn hàng của bạn.')}>
                  <Text style={styles.loadMoreBtnText}>Tải thêm đơn hàng cũ</Text>
                  <Ionicons name="chevron-down" size={14} color="#4b5563" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            )}

            {/* TAB: TỔNG QUAN */}
            {activeTab === 'tong-quan' && (
              <View>
                <Text style={styles.contentTitle}>Thành viên Smember</Text>
                <Text style={styles.contentSubtitle}>Chào mừng quay trở lại, {user?.fullName || 'Khách hàng'}</Text>

                {/* Virtual Smember Card */}
                <View style={styles.smemberCard}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardBrandText}>PHONEHUB</Text>
                    <View style={styles.smemberBadge}>
                      <Text style={styles.smemberBadgeText}>{getRankInfo(user?.tongTienDaMua).current}</Text>
                    </View>
                  </View>
                  <View style={styles.cardMiddleRow}>
                    <Text style={styles.cardNameText}>{user?.fullName?.toUpperCase() || 'KHÁCH HÀNG'}</Text>
                    <Text style={styles.cardNumberText}>MÃ: {user?.phone || 'CHƯA CẬP NHẬT'}</Text>
                  </View>
                  <View style={styles.cardBottomRow}>
                    <Text style={styles.cardJoinedText}>THÀNH VIÊN PHONEHUB</Text>
                    <Text style={styles.cardSloganText}>Khách hàng là trọng tâm</Text>
                  </View>
                </View>

                {/* Quick Stats Grid */}
                <View style={styles.statsGrid}>
                  <View style={styles.statGridBox}>
                    <Ionicons name="ribbon-outline" size={24} color="#d70018" style={{ marginBottom: 6 }} />
                    <Text style={styles.statGridNumber}>{user?.hang ? user.hang.toUpperCase() : 'S-NEW'}</Text>
                    <Text style={styles.statGridLabel}>HẠNG THÀNH VIÊN</Text>
                  </View>
                  <View style={styles.statGridBox}>
                    <Ionicons name="cube-outline" size={24} color="#1565c0" style={{ marginBottom: 6 }} />
                    <Text style={styles.statGridNumber}>{orders.length}</Text>
                    <Text style={styles.statGridLabel}>ĐƠN HÀNG ĐÃ MUA</Text>
                  </View>
                  <View style={styles.statGridBox}>
                    <Ionicons name="cash-outline" size={24} color="#2e7d32" style={{ marginBottom: 6 }} />
                    <Text style={styles.statGridNumber} numberOfLines={1} adjustsFontSizeToFit>{formatShortCurrency(user?.tongTienDaMua)}</Text>
                    <Text style={styles.statGridLabel}>TỔNG CHI TIÊU</Text>
                  </View>
                  <View style={styles.statGridBox}>
                    <Ionicons name="gift-outline" size={24} color="#ef6c00" style={{ marginBottom: 6 }} />
                    <Text style={styles.statGridNumber}>{Math.floor((Number(user?.tongTienDaMua) || 0) / 100000)}</Text>
                    <Text style={styles.statGridLabel}>ĐIỂM TÍCH LŨY</Text>
                  </View>
                </View>

                {/* Smember Level Progress */}
                {getRankInfo(user?.tongTienDaMua).next !== 'MAX' ? (
                  <View style={styles.progressContainerCard}>
                    <Text style={styles.progressTitle}>Tiến trình lên hạng {getRankInfo(user?.tongTienDaMua).next}</Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${getRankInfo(user?.tongTienDaMua).progress}%` }]} />
                    </View>
                    <Text style={styles.progressDescText}>Cần chi tiêu thêm {formatCurrency(getRankInfo(user?.tongTienDaMua).missing)} để nâng cấp lên hạng {getRankInfo(user?.tongTienDaMua).next}.</Text>
                  </View>
                ) : (
                  <View style={styles.progressContainerCard}>
                    <Text style={styles.progressTitle}>Hạng cao nhất: S-VIP</Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: '100%' }]} />
                    </View>
                    <Text style={styles.progressDescText}>Bạn đã đạt hạng thành viên cao nhất của hệ thống. Cảm ơn bạn đã luôn đồng hành cùng PhoneHub!</Text>
                  </View>
                )}
              </View>
            )}

            {/* TAB: THÔNG TIN TÀI KHOẢN */}
            {activeTab === 'thong-tin' && (
              <View>
                <Text style={styles.contentTitle}>Thông tin cá nhân</Text>
                <Text style={styles.contentSubtitle}>Cập nhật thông tin nhận hàng và tài khoản của bạn</Text>

                <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>HỌ VÀ TÊN</Text>
                    <TextInput
                      style={styles.formInput}
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Nguyễn Văn A"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>SỐ ĐIỆN THOẠI</Text>
                    <TextInput
                      style={styles.formInput}
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="0912345678"
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>ĐỊA CHỈ EMAIL</Text>
                    <TextInput
                      style={[styles.formInput, { backgroundColor: '#f3f4f6', color: '#6b7280' }]}
                      value={email}
                      editable={false}
                    />
                    <Text style={styles.inputSubtext}>Email dùng để đăng nhập và không thể thay đổi</Text>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>ĐỊA CHỈ NHẬN HÀNG MẶC ĐỊNH</Text>
                    <TextInput
                      style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]}
                      value={address}
                      onChangeText={setAddress}
                      placeholder="Nhập số nhà, tên đường, quận/huyện, thành phố..."
                      multiline={true}
                    />
                  </View>

                  {savingProfile ? (
                    <ActivityIndicator size="small" color="#d70018" style={{ marginVertical: 12 }} />
                  ) : (
                    <TouchableOpacity style={styles.submitBtn} onPress={handleUpdateProfile}>
                      <Text style={styles.submitBtnText}>Lưu thay đổi</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* TAB: TRA CỨU BẢO HÀNH */}
            {activeTab === 'bao-hanh' && (
              <View>
                <Text style={styles.contentTitle}>Tra cứu bảo hành</Text>
                <Text style={styles.contentSubtitle}>Kiểm tra thời hạn bảo hành của sản phẩm bằng mã SKU</Text>

                {isScanning ? (
                  <View style={{ height: 300, width: '100%', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
                    <CameraView
                      style={{ flex: 1 }}
                      facing="back"
                      barcodeScannerSettings={{
                        barcodeTypes: ["qr", "ean13", "ean8", "code128", "code39"],
                      }}
                      onBarcodeScanned={handleBarCodeScanned}
                    >
                      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: 250, height: 150, borderWidth: 2, borderColor: '#fff', backgroundColor: 'transparent' }} />
                        <Text style={{ color: '#fff', marginTop: 20, fontWeight: '500' }}>Hướng Camera vào mã vạch (Barcode) SKU</Text>
                        <TouchableOpacity style={{ marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#d70018', borderRadius: 8 }} onPress={() => setIsScanning(false)}>
                          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Hủy quét</Text>
                        </TouchableOpacity>
                      </View>
                    </CameraView>
                  </View>
                ) : (
                  <View style={{ marginBottom: 20 }}>
                    <TouchableOpacity 
                      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#d70018', borderRadius: 8, paddingVertical: 12, marginBottom: 16 }}
                      onPress={startScanning}
                    >
                      <Ionicons name="barcode-outline" size={24} color="#d70018" style={{ marginRight: 8 }} />
                      <Text style={{ color: '#d70018', fontWeight: 'bold', fontSize: 16 }}>Quét mã bảo hành</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, height: 48, backgroundColor: '#fff' }}>
                        <Ionicons name="search-outline" size={20} color="#6b7280" />
                        <TextInput 
                          style={{ flex: 1, marginLeft: 8, height: '100%' }}
                          placeholder="Hoặc nhập mã SKU sản phẩm..."
                          value={skuInput}
                          onChangeText={setSkuInput}
                          autoCapitalize="none"
                        />
                      </View>
                      <TouchableOpacity 
                        style={{ marginLeft: 12, backgroundColor: '#d70018', height: 48, paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8 }}
                        onPress={() => handleCheckWarranty()}
                      >
                        {checkingWarranty ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: 'bold' }}>Kiểm tra</Text>}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {warrantyResult ? (
                  <View style={styles.warrantyList}>
                    <View style={styles.warrantyCard}>
                      <View style={styles.warrantyCardHeader}>
                        <Text style={styles.warrantyDeviceText}>{warrantyResult.productName}</Text>
                        <View style={[styles.warrantyStatusBadge, { backgroundColor: '#e8f5e9' }]}>
                          <Text style={[styles.warrantyStatusText, { color: '#2e7d32' }]}>Hợp lệ</Text>
                        </View>
                      </View>
                      <View style={styles.warrantyCardBody}>
                        <Text style={styles.warrantyDetailText}>Mã đơn hàng: {warrantyResult.orderCode}</Text>
                        <Text style={styles.warrantyDetailText}>Ngày mua: {warrantyResult.orderDate ? new Date(warrantyResult.orderDate).toLocaleDateString('vi-VN') : 'Không rõ'}</Text>
                        <Text style={styles.warrantyDetailText}>Gói bảo hành: {warrantyResult.warrantyName}</Text>
                        {warrantyResult.warrantyPrice > 0 && <Text style={styles.warrantyDetailText}>Giá gói: {formatCurrency(warrantyResult.warrantyPrice)}</Text>}
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                    <Ionicons name="shield-checkmark-outline" size={64} color="#e5e7eb" />
                    <Text style={{ color: '#6b7280', marginTop: 12 }}>Bạn chưa có thông tin bảo hành nào được tra cứu.</Text>
                    <Text style={{ color: '#9ca3af', fontSize: 13, marginTop: 4, textAlign: 'center' }}>Chỉ có thể tra cứu mã SKU của sản phẩm{'\n'}bạn đã từng mua.</Text>
                  </View>
                )}
              </View>
            )}

            {/* TAB: HẠNG THÀNH VIÊN & ƯU ĐÃI */}
            {activeTab === 'hang-thanh-vien' && (
              <View>
                <Text style={styles.contentTitle}>Hạng thành viên & Ưu đãi</Text>
                <Text style={styles.contentSubtitle}>Tìm hiểu các hạng thành viên Smember và đặc quyền chiết khấu</Text>

                <View style={styles.levelCard}>
                  <View style={styles.levelHeader}>
                    <Ionicons name="ribbon" size={24} color="#d70018" />
                    <Text style={styles.levelTitle}>Thông tin hạng Smember hiện tại</Text>
                  </View>
                  <Text style={styles.levelDesc}>
                    Hạng hiện tại của bạn: <Text style={{ fontWeight: 'bold', color: '#d70018' }}>{getRankInfo(user?.tongTienDaMua).current}</Text>
                  </Text>
                  {getRankInfo(user?.tongTienDaMua).current === 'S-NEW' && (
                    <>
                      <Text style={styles.levelBenefitText}>• Nhận ưu đãi chiết khấu cơ bản cho sản phẩm mới.</Text>
                      <Text style={styles.levelBenefitText}>• Nhận thông tin khuyến mãi sớm nhất qua Email.</Text>
                    </>
                  )}
                  {getRankInfo(user?.tongTienDaMua).current === 'S-MEM' && (
                    <>
                      <Text style={styles.levelBenefitText}>• Ưu đãi chiết khấu khi mua iPhone, iPad: Giảm 1%</Text>
                      <Text style={styles.levelBenefitText}>• Ưu đãi chiết khấu khi mua phụ kiện: Giảm 2%</Text>
                      <Text style={styles.levelBenefitText}>• Quà tặng ngày sinh nhật: Phiếu mua hàng 200.000 đ</Text>
                      <Text style={styles.levelBenefitText}>• Hỗ trợ vệ sinh, dán lại màn hình miễn phí trọn đời</Text>
                    </>
                  )}
                  {getRankInfo(user?.tongTienDaMua).current === 'S-VIP' && (
                    <>
                      <Text style={styles.levelBenefitText}>• Ưu đãi chiết khấu cao cấp toàn bộ thiết bị: Giảm tới 5%</Text>
                      <Text style={styles.levelBenefitText}>• Quà tặng ngày sinh nhật siêu cấp: Phiếu mua hàng 500.000 đ</Text>
                      <Text style={styles.levelBenefitText}>• Hỗ trợ kỹ thuật và giao hàng tận nơi miễn phí hoàn toàn</Text>
                      <Text style={styles.levelBenefitText}>• Đường dây nóng CSKH ưu tiên</Text>
                    </>
                  )}
                </View>

                {getRankInfo(user?.tongTienDaMua).next !== 'MAX' ? (
                  <View style={{...styles.progressContainerCard, marginTop: 16, marginBottom: 8}}>
                    <Text style={styles.progressTitle}>Tiến trình lên hạng {getRankInfo(user?.tongTienDaMua).next}</Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${getRankInfo(user?.tongTienDaMua).progress}%` }]} />
                    </View>
                    <Text style={styles.progressDescText}>Cần chi tiêu thêm {formatCurrency(getRankInfo(user?.tongTienDaMua).missing)} để nâng cấp lên hạng {getRankInfo(user?.tongTienDaMua).next}.</Text>
                  </View>
                ) : (
                  <View style={{...styles.progressContainerCard, marginTop: 16, marginBottom: 8}}>
                    <Text style={styles.progressTitle}>Hạng cao nhất: S-VIP</Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: '100%' }]} />
                    </View>
                    <Text style={styles.progressDescText}>Bạn đã đạt hạng thành viên cao nhất của hệ thống. Cảm ơn bạn đã luôn đồng hành cùng PhoneHub!</Text>
                  </View>
                )}

                <Text style={[styles.contentTitle, { fontSize: 16, marginTop: 16, marginBottom: 8 }]}>Các cột mốc hạng thành viên</Text>
                
                <View style={[styles.levelMilestoneCard, getRankInfo(user?.tongTienDaMua).current === 'S-NEW' && { borderColor: '#d70018', borderWidth: 1 }]}>
                  <Text style={[styles.milestoneTitle, getRankInfo(user?.tongTienDaMua).current === 'S-NEW' && { color: '#d70018' }]}>1. S-NEW (Thành viên mới){getRankInfo(user?.tongTienDaMua).current === 'S-NEW' ? ' - Hiện tại' : ''}</Text>
                  <Text style={styles.milestoneDesc}>Điều kiện: Vừa đăng ký tài khoản. Nhận ưu đãi chiết khấu cơ bản và thông tin khuyến mãi sớm nhất.</Text>
                </View>

                <View style={[styles.levelMilestoneCard, getRankInfo(user?.tongTienDaMua).current === 'S-MEM' && { borderColor: '#d70018', borderWidth: 1 }]}>
                  <Text style={[styles.milestoneTitle, getRankInfo(user?.tongTienDaMua).current === 'S-MEM' && { color: '#d70018' }]}>2. S-MEM (Thành viên Bạc){getRankInfo(user?.tongTienDaMua).current === 'S-MEM' ? ' - Hiện tại' : ''}</Text>
                  <Text style={styles.milestoneDesc}>Điều kiện: Chi tiêu tích lũy từ 5.000.000 đ. Chiết khấu thêm 1-2% trên sản phẩm, quà tặng sinh nhật đặc biệt.</Text>
                </View>

                <View style={[styles.levelMilestoneCard, getRankInfo(user?.tongTienDaMua).current === 'S-VIP' && { borderColor: '#d70018', borderWidth: 1 }]}>
                  <Text style={[styles.milestoneTitle, getRankInfo(user?.tongTienDaMua).current === 'S-VIP' && { color: '#d70018' }]}>3. S-VIP (Thành viên Vàng){getRankInfo(user?.tongTienDaMua).current === 'S-VIP' ? ' - Hiện tại' : ''}</Text>
                  <Text style={styles.milestoneDesc}>Điều kiện: Chi tiêu tích lũy từ 50.000.000 đ. Chiết khấu thêm tới 5% giá trị máy & phụ kiện, quà tặng sinh nhật cao cấp, hỗ trợ kỹ thuật tận nơi miễn phí.</Text>
                </View>
              </View>
            )}

            {/* TAB: ĐỔI MẬT KHẨU */}
            {activeTab === 'doi-mat-khau' && (
              <View>
                <Text style={styles.contentTitle}>Đổi mật khẩu</Text>
                <Text style={styles.contentSubtitle}>Đổi mật khẩu của bạn để bảo mật tài khoản tốt hơn</Text>

                <View style={styles.formContainer}>
                  {!showOtpForm ? (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                      <Ionicons name="shield-checkmark-outline" size={48} color="#10b981" style={{ marginBottom: 12 }} />
                      <Text style={{ fontSize: 14, color: '#4b5563', textAlign: 'center', marginBottom: 20, lineHeight: 22 }}>
                        Để bảo vệ tài khoản, hệ thống sẽ gửi một mã OTP gồm 6 số đến email{'\n'}
                        <Text style={{fontWeight: '700', color: '#111827'}}>{user?.email}</Text>{'\n'}để xác thực yêu cầu đổi mật khẩu.
                      </Text>
                      {sendingOtp ? (
                        <ActivityIndicator size="large" color="#d70018" style={{ marginVertical: 12 }} />
                      ) : (
                        <TouchableOpacity 
                          style={[styles.submitBtn, countdown > 0 && { backgroundColor: '#fca5a5' }]} 
                          onPress={handleRequestPasswordOtp}
                          disabled={countdown > 0}
                        >
                          <Text style={styles.submitBtnText}>
                            {countdown > 0 ? `Vui lòng đợi ${countdown}s để gửi lại` : 'Nhận mã OTP đổi mật khẩu'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : (
                    <>
                      <OtpInput
                        label="MÃ OTP ĐÃ GỬI VỀ EMAIL"
                        value={otpCode}
                        onChangeText={setOtpCode}
                        length={6}
                      />

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>MẬT KHẨU MỚI</Text>
                        <TextInput
                          style={styles.formInput}
                          value={newPassword}
                          onChangeText={setNewPassword}
                          placeholder="••••••••"
                          secureTextEntry={true}
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>XÁC NHẬN MẬT KHẨU MỚI</Text>
                        <TextInput
                          style={styles.formInput}
                          value={confirmNewPassword}
                          onChangeText={setConfirmNewPassword}
                          placeholder="••••••••"
                          secureTextEntry={true}
                        />
                      </View>

                      {changingPass ? (
                        <ActivityIndicator size="small" color="#d70018" style={{ marginVertical: 12 }} />
                      ) : (
                        <TouchableOpacity style={styles.submitBtn} onPress={handleChangePassword}>
                          <Text style={styles.submitBtnText}>Xác nhận đổi mật khẩu</Text>
                        </TouchableOpacity>
                      )}
                      
                      <TouchableOpacity 
                        style={{ marginTop: 20, alignItems: 'center' }} 
                        onPress={() => setShowOtpForm(false)}
                      >
                        <Text style={{ color: '#6b7280', fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' }}>
                          Hủy và quay lại
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            )}

            {/* Version Text */}
            <Text style={styles.versionText}>PHONEHUB SMEMBER v4.2.1 • ĐÃ LIÊN KẾT</Text>

          </ScrollView>
        </View>

      </View>

      <BottomNav activeTab="account" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#d70018',
    letterSpacing: 1,
  },
  cartBtn: {
    position: 'relative',
    padding: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#d70018',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  
  // Login required UI
  loginRequiredContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loginRequiredTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  loginRequiredDesc: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  loginBtn: {
    backgroundColor: '#d70018',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#d70018',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  // Two-column layout
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  
  // Left Column Sidebar (28%)
  sidebar: {
    width: '28%',
    backgroundColor: '#f9fafb',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    paddingTop: 16,
  },
  sidebarSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9ca3af',
    paddingHorizontal: 12,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 2,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  menuItemActive: {
    backgroundColor: '#fef2f2',
    borderLeftColor: '#d70018',
  },
  menuIcon: {
    marginRight: 6,
  },
  menuText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
    flex: 1,
  },
  menuTextActive: {
    color: '#d70018',
    fontWeight: '700',
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
    marginHorizontal: 12,
  },
  sidebarLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  sidebarLogoutText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#dc2626',
  },

  // Right Column Content (72%)
  contentContainer: {
    width: '72%',
    backgroundColor: '#ffffff',
  },
  contentScroll: {
    padding: 16,
    paddingBottom: 60,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  contentSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 18,
  },

  // Tab: Lịch sử đơn hàng styles
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
    padding: 0,
  },
  chipsScroll: {
    marginBottom: 16,
  },
  chipsScrollContent: {
    gap: 8,
    paddingRight: 16,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
  },
  statusChipActive: {
    backgroundColor: '#d70018',
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
  statusChipTextActive: {
    color: '#ffffff',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff1f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  shopNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d70018',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  shopNowBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    overflow: 'hidden',
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  orderIdText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  orderDateText: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderItemsList: {
    paddingHorizontal: 12,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  orderItemImageContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  orderItemImage: {
    width: '100%',
    height: '100%',
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  orderItemQty: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  orderItemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailBtnText: {
    fontSize: 12,
    color: '#d70018',
    fontWeight: '700',
  },
  totalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalPriceLabel: {
    fontSize: 12,
    color: '#4b5563',
  },
  totalPriceVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#d70018',
  },
  totalPriceVnd: {
    textDecorationLine: 'underline',
  },
  expandedPanel: {
    backgroundColor: '#fdfdfd',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 8,
  },
  expandedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expandedLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  expandedVal: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '500',
    maxWidth: '65%',
    textAlign: 'right',
  },
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    marginTop: 8,
    marginBottom: 24,
  },
  loadMoreBtnText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '600',
  },

  // Tab: Tổng quan styles
  smemberCard: {
    backgroundColor: '#d70018',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    height: 150,
    justifyContent: 'space-between',
    shadowColor: '#d70018',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrandText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  smemberBadge: {
    backgroundColor: '#fffbeb',
    borderColor: '#f59e0b',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  smemberBadgeText: {
    color: '#b45309',
    fontSize: 10,
    fontWeight: '800',
  },
  cardMiddleRow: {
    gap: 4,
  },
  cardNameText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardNumberText: {
    color: '#f9fafb',
    fontSize: 12,
    opacity: 0.9,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardJoinedText: {
    color: '#f3f4f6',
    fontSize: 10,
    opacity: 0.8,
  },
  cardSloganText: {
    color: '#fffbeb',
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statGridBox: {
    width: '48.5%',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statGridNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  statGridLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9ca3af',
    textAlign: 'center',
  },
  progressContainerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#d70018',
    borderRadius: 4,
  },
  progressDescText: {
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 16,
  },

  // Form styles for Profile & Passwords
  formContainer: {
    gap: 14,
    marginBottom: 20,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4b5563',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#111827',
  },
  inputSubtext: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: -2,
  },
  submitBtn: {
    backgroundColor: '#d70018',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  // Tab Warranty styles
  warrantyList: {
    gap: 12,
  },
  warrantyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
  },
  warrantyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 8,
    marginBottom: 8,
  },
  warrantyDeviceText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  warrantyStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  warrantyStatusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  warrantyCardBody: {
    gap: 4,
  },
  warrantyDetailText: {
    fontSize: 11,
    color: '#4b5563',
    lineHeight: 16,
  },

  // Tab Level Benefit styles
  levelCard: {
    backgroundColor: '#fffdeb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fef3c7',
    padding: 14,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  levelTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  levelDesc: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 10,
  },
  levelBenefitText: {
    fontSize: 11,
    color: '#b45309',
    lineHeight: 18,
    fontWeight: '500',
  },
  levelMilestoneCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    marginBottom: 8,
  },
  milestoneTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 4,
  },
  milestoneDesc: {
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 16,
  },

  versionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    textAlign: 'center',
    marginVertical: 24,
  },
});
