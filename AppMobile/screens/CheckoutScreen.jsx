import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL, fixImageUrl } from '../config/apiConfig';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartItems, checkedItemIds, checkedTotal, clearCheckedItems } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [addressDetail, setAddressDetail] = useState('');

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); 

  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [warranty, setWarranty] = useState('standard');
  
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [availableVouchers, setAvailableVouchers] = useState([]);

  const [loading, setLoading] = useState(false);

  const checkoutItems = cartItems.filter(item => checkedItemIds.includes(item.cartItemId || item.id));

  const deliveryFee = deliveryMethod === 'express' ? 50000 : 0;
  const warrantyFee = warranty === 'gold' ? 300000 : warranty === 'diamond' ? 500000 : 0;
  
  const taxAmount = checkedTotal * 0.08;
  const finalTotal = checkedTotal + taxAmount + deliveryFee + warrantyFee - discountAmount;

  useEffect(() => {
    fetchProvinces();
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const mockVouchers = [
        { id: 1, ma: 'APPLE10', giaTriGiam: 10, loaiGiam: 'PhanTram', donHangToiThieu: 500000, giamToiDa: 100000, soLuong: 100, daSuDung: 11 },
        { id: 2, ma: 'APPLE50K', giaTriGiam: 50000, loaiGiam: 'Tien', donHangToiThieu: 300000, giamToiDa: null, soLuong: 200, daSuDung: 50 },
        { id: 3, ma: 'APPLE20', giaTriGiam: 20, loaiGiam: 'PhanTram', donHangToiThieu: 1000000, giamToiDa: 200000, soLuong: 50, daSuDung: 6 },
        { id: 5, ma: 'VIP100K', giaTriGiam: 100000, loaiGiam: 'Tien', donHangToiThieu: 2000000, giamToiDa: null, soLuong: 20, daSuDung: 2 }
      ];
      try {
        const res = await axios.get(`${API_BASE_URL}/public/vouchers`);
        if (res.data && res.data.length > 0) {
          // Chỉ lấy voucher còn số lượng
          setAvailableVouchers(res.data.filter(v => (v.soLuong - v.daSuDung) > 0));
          return;
        }
      } catch (err) {
        console.log("Backend API cho voucher chưa sẵn sàng, dùng mock");
      }
      // Chỉ lấy voucher còn số lượng dùng
      setAvailableVouchers(mockVouchers.filter(v => (v.soLuong - v.daSuDung) > 0));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProvinces = async () => {
    try {
      const res = await fetch('https://provinces.open-api.vn/api/p/');
      const data = await res.json();
      setProvinces(data);
    } catch (error) {
      console.error("Error fetching provinces", error);
    }
  };

  const fetchDistricts = async (provinceCode) => {
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      const data = await res.json();
      setDistricts(data.districts || []);
    } catch (error) {
      console.error("Error fetching districts", error);
    }
  };

  const fetchWards = async (districtCode) => {
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      const data = await res.json();
      setWards(data.wards || []);
    } catch (error) {
      console.error("Error fetching wards", error);
    }
  };

  const openModal = (type) => {
    if (type === 'district' && !selectedProvince) {
      Alert.alert("Thông báo", "Vui lòng chọn Tỉnh/Thành phố trước.");
      return;
    }
    if (type === 'ward' && !selectedDistrict) {
      Alert.alert("Thông báo", "Vui lòng chọn Quận/Huyện trước.");
      return;
    }
    setModalType(type);
    setModalVisible(true);
  };

  const handleSelectLocation = (item) => {
    if (modalType === 'province') {
      setSelectedProvince(item);
      setSelectedDistrict(null);
      setSelectedWard(null);
      setDistricts([]);
      setWards([]);
      fetchDistricts(item.code);
    } else if (modalType === 'district') {
      setSelectedDistrict(item);
      setSelectedWard(null);
      setWards([]);
      fetchWards(item.code);
    } else if (modalType === 'ward') {
      setSelectedWard(item);
    }
    setModalVisible(false);
  };

  const handleApplyVoucherCode = (code) => {
    const voucher = availableVouchers.find(v => v.ma.toUpperCase() === code.toUpperCase());
    if (voucher) {
      if (checkedTotal >= (voucher.donHangToiThieu || 0)) {
        let calculatedDiscount = 0;
        if (voucher.loaiGiam === 'PhanTram') {
          calculatedDiscount = (checkedTotal * voucher.giaTriGiam) / 100;
          if (voucher.giamToiDa && calculatedDiscount > voucher.giamToiDa) {
            calculatedDiscount = voucher.giamToiDa;
          }
        } else {
          calculatedDiscount = voucher.giaTriGiam;
        }
        setAppliedVoucher(voucher.ma);
        setDiscountAmount(calculatedDiscount);
        setVoucherInput(voucher.ma);
        showToast({ message: `Đã áp dụng! Giảm ${calculatedDiscount.toLocaleString('vi-VN')}đ`, type: 'success' });
      } else {
        showToast({ message: `Đơn hàng tối thiểu ${(voucher.donHangToiThieu||0).toLocaleString('vi-VN')}đ để dùng mã này`, type: 'warning', duration: 4000 });
      }
    } else {
      showToast({ message: 'Mã ưu đãi không hợp lệ hoặc đã hết lượt dùng', type: 'error' });
      setAppliedVoucher(null);
      setDiscountAmount(0);
    }
  };

  const handleApplyVoucher = () => {
    if (!voucherInput.trim()) return;
    handleApplyVoucherCode(voucherInput);
  };

  const handleRemoveVoucher = () => {
    setVoucherInput('');
    setAppliedVoucher(null);
    setDiscountAmount(0);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    if (checkoutItems.length === 0) {
      showToast({ message: 'Giỏ hàng trống! Vui lòng chọn sản phẩm.', type: 'error' });
      setLoading(false);
      return;
    }
    
    if (!fullName || !phone || !addressDetail || !selectedProvince || !selectedDistrict || !selectedWard) {
      showToast({ message: 'Vui lòng điền đầy đủ thông tin giao hàng', type: 'warning', duration: 4000 });
      setLoading(false);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const fullAddress = `${addressDetail}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`;
      
      const payload = {
        fullName: fullName,
        email: email,
        address: fullAddress,
        phone: phone,
        province: selectedProvince.name,
        district: selectedDistrict.name,
        ward: selectedWard.name,
        paymentMethod: paymentMethod === 'cod' ? 'COD' : 'QR Banking',
        totalAmount: Math.max(0, finalTotal).toString(),
        discountAmount: discountAmount.toString(),
        voucherCode: appliedVoucher || '',
        items: checkoutItems.map(item => {
          // Extract numeric productId from cartItemId (e.g. "123-456" -> 123, or just "123" -> 123)
          let prodId = item.id;
          if (typeof prodId === 'string' && prodId.includes('-')) {
            prodId = parseInt(prodId.split('-')[0], 10);
          }
          // Ensure price is a clean numeric string
          let itemPrice = item.rawPrice || item.price || '0';
          if (typeof itemPrice === 'string') {
            itemPrice = itemPrice.replace(/[^0-9.]/g, '');
          }
          return {
            productId: prodId,
            quantity: item.quantity,
            price: itemPrice.toString()
          };
        })
      };

      console.log('Order payload:', JSON.stringify(payload, null, 2));

      const res = await axios.post(`${API_BASE_URL}/user/orders`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      clearCheckedItems();
      showToast({ message: 'Đơn hàng đã đặt thành công! Cảm ơn bạn đã mua hàng tại PhoneHub 🎉', type: 'success', duration: 4000 });
      router.replace('/home');
    } catch (error) {
      console.error('Order error:', error?.response?.status, error?.response?.data || error.message);
      const status = error?.response?.status || 'No status';
      const data = error?.response?.data ? JSON.stringify(error.response.data) : 'No response data';
      const msg = error?.message || 'Unknown error';
      Alert.alert('Debug Error', `Status: ${status}\nData: ${data}\nMsg: ${msg}`);
      const errMsg = error?.response?.data?.message || error?.response?.data || 'Không thể đặt hàng lúc này. Vui lòng thử lại!';
      showToast({ message: typeof errMsg === 'string' ? errMsg : 'Không thể đặt hàng lúc này. Vui lòng thử lại!', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const renderLocationModal = () => {
    let data = [];
    let title = "";
    if (modalType === 'province') { data = provinces; title = "Chọn Tỉnh/Thành phố"; }
    else if (modalType === 'district') { data = districts; title = "Chọn Quận/Huyện"; }
    else if (modalType === 'ward') { data = wards; title = "Chọn Phường/Xã"; }

    return (
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={data}
              keyExtractor={(item) => item.code.toString()}
              renderItem={({item}) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectLocation(item)}>
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.canGoBack() ? router.back() : router.push('/cart')} 
          style={styles.headerIcon}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* THÔNG TIN KHÁCH HÀNG */}
        <View style={styles.sectionHeader}>
          <Ionicons name="person" size={20} color="#d70018" />
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
        </View>
        <View style={styles.cardBox}>
          <View style={styles.row}>
            <View style={styles.inputGroupContainer}>
              <Text style={styles.inputLabel}>HỌ VÀ TÊN</Text>
              <TextInput style={styles.input} placeholder="Nguyễn Văn A" value={fullName} onChangeText={setFullName} />
            </View>
            <View style={styles.inputGroupContainer}>
              <Text style={styles.inputLabel}>SỐ ĐIỆN THOẠI</Text>
              <TextInput style={styles.input} placeholder="0901 234 567" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            </View>
          </View>

          <View style={styles.inputGroupContainerFull}>
            <Text style={styles.inputLabel}>EMAIL NHẬN HÓA ĐƠN</Text>
            <TextInput style={styles.input} placeholder="example@email.com" keyboardType="email-address" value={email} onChangeText={setEmail} />
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroupContainer}>
              <Text style={styles.inputLabel}>ĐỊA CHỈ CHI TIẾT</Text>
              <TextInput style={styles.input} placeholder="Số nhà, tên đường..." value={addressDetail} onChangeText={setAddressDetail} />
            </View>
            <View style={styles.inputGroupContainer}>
              <Text style={styles.inputLabel}>TỈNH / THÀNH PHỐ</Text>
              <TouchableOpacity style={styles.selector} onPress={() => openModal('province')}>
                <Text style={selectedProvince ? styles.selectorText : styles.selectorPlaceholder}>
                  {selectedProvince ? selectedProvince.name : "Chọn Tỉnh/Thành"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroupContainer}>
              <Text style={styles.inputLabel}>QUẬN / HUYỆN</Text>
              <TouchableOpacity style={styles.selector} onPress={() => openModal('district')}>
                <Text style={selectedDistrict ? styles.selectorText : styles.selectorPlaceholder}>
                  {selectedDistrict ? selectedDistrict.name : "Chọn Quận/Huyện"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputGroupContainer}>
              <Text style={styles.inputLabel}>PHƯỜNG / XÃ</Text>
              <TouchableOpacity style={styles.selector} onPress={() => openModal('ward')}>
                <Text style={selectedWard ? styles.selectorText : styles.selectorPlaceholder}>
                  {selectedWard ? selectedWard.name : "Chọn Phường/Xã"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* PHƯƠNG THỨC GIAO HÀNG */}
        <View style={styles.sectionHeader}>
          <Ionicons name="car" size={20} color="#d70018" />
          <Text style={styles.sectionTitle}>Phương thức giao hàng</Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.deliveryCard, deliveryMethod === 'standard' && styles.deliveryCardActive]}
            onPress={() => setDeliveryMethod('standard')}
          >
            <Ionicons name="cube-outline" size={20} color={deliveryMethod === 'standard' ? "#d70018" : "#6b7280"} />
            <Text style={styles.deliveryTitle}>Giao hàng tiêu chuẩn</Text>
            <Text style={styles.deliverySubtitle}>Dự kiến: 3-5 ngày làm việc</Text>
            <Text style={styles.deliveryPrice}>Miễn phí</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.deliveryCard, deliveryMethod === 'express' && styles.deliveryCardActive]}
            onPress={() => setDeliveryMethod('express')}
          >
            <Ionicons name="flash-outline" size={20} color={deliveryMethod === 'express' ? "#d70018" : "#6b7280"} />
            <Text style={styles.deliveryTitle}>Giao nhanh (24h)</Text>
            <Text style={styles.deliverySubtitle}>Nội thành Hồ Chí Minh & Hà Nội</Text>
            <Text style={styles.deliveryPrice}>50.000đ</Text>
          </TouchableOpacity>
        </View>

        {/* GÓI BẢO HÀNH */}
        <View style={styles.sectionHeader}>
          <Ionicons name="shield-checkmark" size={20} color="#d70018" />
          <Text style={styles.sectionTitle}>Gói bảo hành</Text>
        </View>
        <View style={styles.cardBox}>
          <TouchableOpacity 
            style={[styles.optionRow, warranty === 'standard' && styles.optionRowActive]} 
            onPress={() => setWarranty('standard')}
          >
            <Ionicons name={warranty === 'standard' ? "radio-button-on" : "radio-button-off"} size={18} color={warranty === 'standard' ? "#d70018" : "#d1d5db"} />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Bảo hành tiêu chuẩn (6 tháng)</Text>
            </View>
            <Text style={styles.optionPrice}>Miễn phí</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.optionRow, warranty === 'gold' && styles.optionRowActive]} 
            onPress={() => setWarranty('gold')}
          >
            <Ionicons name={warranty === 'gold' ? "radio-button-on" : "radio-button-off"} size={18} color={warranty === 'gold' ? "#d70018" : "#d1d5db"} />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Bảo hành Vàng (12 tháng)</Text>
            </View>
            <Text style={styles.optionPrice}>+ 300.000đ</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.optionRow, warranty === 'diamond' && styles.optionRowActive]} 
            onPress={() => setWarranty('diamond')}
          >
            <Ionicons name={warranty === 'diamond' ? "radio-button-on" : "radio-button-off"} size={18} color={warranty === 'diamond' ? "#d70018" : "#d1d5db"} />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Bảo hành Kim Cương (24 tháng)</Text>
            </View>
            <Text style={styles.optionPrice}>+ 500.000đ</Text>
          </TouchableOpacity>
        </View>

        {/* PHƯƠNG THỨC THANH TOÁN */}
        <View style={styles.sectionHeader}>
          <Ionicons name="card" size={20} color="#d70018" />
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        </View>
        <View style={[styles.cardBox, { borderColor: paymentMethod === 'qr' ? '#d70018' : '#e5e7eb', borderWidth: 1, padding: 12 }]}>
          <TouchableOpacity 
            style={styles.paymentHeader} 
            onPress={() => setPaymentMethod('qr')}
          >
            <Ionicons name={paymentMethod === 'qr' ? "radio-button-on" : "radio-button-off"} size={20} color={paymentMethod === 'qr' ? "#d70018" : "#d1d5db"} />
            <Ionicons name="qr-code-outline" size={20} color="#4b5563" style={{marginLeft: 12}} />
            <Text style={styles.paymentTitle}>Chuyển khoản Ngân hàng qua QR</Text>
            <View style={styles.badgeRecommend}>
              <Text style={styles.badgeText}>KHUYÊN DÙNG</Text>
            </View>
          </TouchableOpacity>
          {paymentMethod === 'qr' && (
            <View style={styles.qrDetailBox}>
              <View style={styles.qrImagePlaceholder}>
                 <Ionicons name="qr-code" size={40} color="#d70018" />
                 <Text style={styles.qrDesc}>Quét mã bằng Ngân hàng</Text>
              </View>
              <View style={styles.bankInfo}>
                <View style={styles.bankInfoRow}>
                  <Text style={styles.bankLabel}>NGÂN HÀNG</Text>
                  <Text style={styles.bankValue}>MBBank</Text>
                </View>
                <View style={styles.bankInfoRow}>
                  <Text style={styles.bankLabel}>SỐ TÀI KHOẢN</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.bankValue}>1024 5588 999</Text>
                    <TouchableOpacity><Text style={styles.copyText}>Sao chép</Text></TouchableOpacity>
                  </View>
                </View>
                <View style={styles.bankInfoRow}>
                  <Text style={styles.bankLabel}>CHỦ TÀI KHOẢN</Text>
                  <Text style={styles.bankValue}>CONG TY TNHH APPLESTORE</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={[styles.cardBox, { borderColor: paymentMethod === 'cod' ? '#d70018' : '#e5e7eb', borderWidth: 1, marginTop: 12, padding: 12 }]}>
          <TouchableOpacity 
            style={styles.paymentHeader} 
            onPress={() => setPaymentMethod('cod')}
          >
            <Ionicons name={paymentMethod === 'cod' ? "radio-button-on" : "radio-button-off"} size={20} color={paymentMethod === 'cod' ? "#d70018" : "#d1d5db"} />
            <Ionicons name="cash-outline" size={20} color="#4b5563" style={{marginLeft: 12}} />
            <Text style={styles.paymentTitle}>Thanh toán khi nhận hàng (COD)</Text>
          </TouchableOpacity>
        </View>

        {/* MÃ GIẢM GIÁ / QUÀ TẶNG */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ticket" size={20} color="#d70018" />
          <Text style={styles.sectionTitle}>Mã giảm giá / Quà tặng</Text>
        </View>
        <View style={styles.cardBox}>
          <View style={styles.voucherRow}>
            <TextInput 
              style={styles.voucherInput} 
              placeholder="Nhập mã ưu đãi (VD: GIAM50K)" 
              value={voucherInput}
              onChangeText={setVoucherInput}
              editable={!appliedVoucher}
            />
            {!appliedVoucher ? (
              <TouchableOpacity style={styles.voucherBtn} onPress={handleApplyVoucher}>
                <Text style={styles.voucherBtnText}>Áp dụng</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.voucherRemoveBtn} onPress={handleRemoveVoucher}>
                <Text style={styles.voucherBtnText}>Hủy bỏ</Text>
              </TouchableOpacity>
            )}
          </View>
          {appliedVoucher && (
            <Text style={styles.voucherSuccessText}>Đã áp dụng mã: {appliedVoucher}</Text>
          )}
          {/* Scroll danh sách mã giảm giá */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.voucherScroll}>
            {availableVouchers.map(v => {
              const remaining = (v.soLuong || 0) - (v.daSuDung || 0);
              const isSelected = appliedVoucher === v.ma;
              const isEligible = checkedTotal >= (v.donHangToiThieu || 0);
              return (
                <TouchableOpacity 
                  key={v.id} 
                  style={[
                    styles.voucherCard,
                    isSelected && styles.voucherCardActive,
                    !isEligible && styles.voucherCardDisabled
                  ]}
                  onPress={() => handleApplyVoucherCode(v.ma)}
                  disabled={!!appliedVoucher}
                >
                  <View style={[styles.voucherCardLeft, !isEligible && { backgroundColor: '#9ca3af' }]}>
                    <Ionicons name="ticket-outline" size={14} color="#fff" />
                    <Text style={styles.voucherCardDiscount}>
                      {v.loaiGiam === 'PhanTram' ? `${v.giaTriGiam}%` : `${v.giaTriGiam/1000}K`}
                    </Text>
                    <Text style={styles.voucherCardDiscountLabel}>GIẢM</Text>
                  </View>
                  <View style={styles.voucherCardRight}>
                    <Text style={[styles.voucherCardCode, isSelected && { color: '#d70018' }]}>{v.ma}</Text>
                    <Text style={styles.voucherCardMin}>
                      {v.donHangToiThieu ? `Đơn tối thiểu ${(v.donHangToiThieu/1000).toFixed(0)}k` : 'Không giới hạn'}
                    </Text>
                    <View style={styles.voucherCardFooter}>
                      <Text style={styles.voucherCardRemaining}>Còn {remaining}/{v.soLuong} lượt</Text>
                    </View>
                    {/* Thanh % */}
                    <View style={styles.voucherProgressBar}>
                      <View style={[
                        styles.voucherProgressFill,
                        {
                          width: `${Math.round((remaining / (v.soLuong || 1)) * 100)}%`,
                          backgroundColor: remaining / (v.soLuong || 1) > 0.5 ? '#16a34a' : remaining / (v.soLuong || 1) > 0.2 ? '#f59e0b' : '#d70018'
                        }
                      ]} />
                    </View>
                  </View>
                  {isSelected && (
                    <View style={styles.voucherSelectedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#d70018" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* TÓM TẮT ĐƠN HÀNG */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>
          
          {checkoutItems.map((item) => (
             <View key={item.cartItemId || item.id} style={styles.summaryItem}>
               <View style={styles.summaryItemImage}>
                 {item.imageUrl ? (
                    <Image source={{ uri: fixImageUrl(item.imageUrl) }} style={{width: '100%', height: '100%', borderRadius: 4}} resizeMode="contain" />
                 ) : (
                    <Ionicons name="phone-portrait-outline" size={32} color="#9ca3af" />
                 )}
               </View>
               <View style={styles.summaryItemContent}>
                 <Text style={styles.summaryItemTitle}>{item.title}</Text>
                 <Text style={styles.summaryItemSubtitle}>SL: {item.quantity}</Text>
               </View>
               <Text style={styles.summaryItemPrice}>{Number(item.rawPrice || item.price || 0).toLocaleString('vi-VN')} ₫</Text>
             </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>
            <Text style={styles.summaryValue}>{checkedTotal.toLocaleString('vi-VN')} ₫</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
            <Text style={deliveryFee === 0 ? styles.freeText : styles.summaryValue}>
              {deliveryFee === 0 ? "Miễn phí" : `${deliveryFee.toLocaleString('vi-VN')} ₫`}
            </Text>
          </View>
          {warrantyFee > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí bảo hành</Text>
              <Text style={styles.summaryValue}>{warrantyFee.toLocaleString('vi-VN')} ₫</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Thuế (8%)</Text>
            <Text style={styles.summaryValue}>{taxAmount.toLocaleString('vi-VN')} ₫</Text>
          </View>
          {discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Giảm giá</Text>
              <Text style={[styles.summaryValue, {color: '#d70018'}]}>- {discountAmount.toLocaleString('vi-VN')} ₫</Text>
            </View>
          )}
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{Math.max(0, finalTotal).toLocaleString('vi-VN')} ₫</Text>
          </View>
        </View>

      </ScrollView>

      {/* FOOTER ACTIONS */}
      <View style={styles.bottomActionContainer}>
        <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder} disabled={loading}>
          {loading ? (
             <ActivityIndicator color="#fff" />
          ) : (
             <Text style={styles.placeOrderText}>Đặt hàng ngay</Text>
          )}
        </TouchableOpacity>
        <View style={styles.secureContainer}>
          <Ionicons name="lock-closed" size={12} color="#9ca3af" />
          <Text style={styles.secureText}>Thanh toán bảo mật SSL 256-bit</Text>
        </View>
      </View>
      
      {renderLocationModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#fff' },
  headerIcon: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 110, paddingTop: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginLeft: 8 },
  
  cardBox: { backgroundColor: '#ffffff', borderRadius: 12, padding: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2, marginBottom: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  inputGroupContainer: { flex: 1, marginHorizontal: 4, marginBottom: 12 },
  inputGroupContainerFull: { marginHorizontal: 4, marginBottom: 12 },
  inputLabel: { fontSize: 10, fontWeight: '700', color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' },
  input: { backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 10, fontSize: 13, color: '#111827' },
  selector: { backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 12, justifyContent: 'center' },
  selectorText: { fontSize: 13, color: '#111827' },
  selectorPlaceholder: { fontSize: 13, color: '#9ca3af' },

  deliveryCard: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, marginHorizontal: 4, alignItems: 'flex-start' },
  deliveryCardActive: { borderColor: '#d70018', backgroundColor: '#fef2f2' },
  deliveryTitle: { fontSize: 13, fontWeight: '700', color: '#111827', marginTop: 8, marginBottom: 2 },
  deliverySubtitle: { fontSize: 11, color: '#6b7280', marginBottom: 4 },
  deliveryPrice: { fontSize: 13, fontWeight: '700', color: '#d70018' },

  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  optionRowActive: { },
  optionContent: { flex: 1, marginLeft: 8 },
  optionTitle: { fontSize: 13, color: '#111827', fontWeight: '500' },
  optionPrice: { fontSize: 13, fontWeight: '600', color: '#111827' },

  paymentHeader: { flexDirection: 'row', alignItems: 'center' },
  paymentTitle: { fontSize: 14, fontWeight: '600', color: '#111827', marginLeft: 8, flex: 1 },
  badgeRecommend: { backgroundColor: '#fef2f2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 9, fontWeight: '700', color: '#d70018' },
  qrDetailBox: { marginTop: 12, flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 12 },
  qrImagePlaceholder: { width: 100, height: 110, backgroundColor: '#f3f4f6', borderRadius: 8, alignItems: 'center', justifyContent: 'center', padding: 8, marginRight: 12 },
  qrDesc: { fontSize: 9, color: '#6b7280', textAlign: 'center', marginTop: 6 },
  bankInfo: { flex: 1, justifyContent: 'space-around' },
  bankInfoRow: { marginBottom: 8 },
  bankLabel: { fontSize: 9, color: '#6b7280', fontWeight: '700', marginBottom: 2 },
  bankValue: { fontSize: 13, fontWeight: '700', color: '#111827', marginRight: 8 },
  copyText: { fontSize: 11, color: '#d70018', fontWeight: '600' },

  voucherRow: { flexDirection: 'row', alignItems: 'center' },
  voucherInput: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#111827', marginRight: 8 },
  voucherBtn: { backgroundColor: '#d70018', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, justifyContent: 'center' },
  voucherRemoveBtn: { backgroundColor: '#6b7280', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, justifyContent: 'center' },
  voucherBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  voucherSuccessText: { color: '#16a34a', fontSize: 12, fontWeight: '600', marginTop: 8 },
  voucherScroll: { marginTop: 12, paddingBottom: 4 },
  voucherCard: { flexDirection: 'row', backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 10, marginRight: 10, overflow: 'hidden', width: 185 },
  voucherCardActive: { borderColor: '#d70018', backgroundColor: '#fff9f9' },
  voucherCardDisabled: { opacity: 0.55 },
  voucherCardLeft: { backgroundColor: '#d70018', paddingVertical: 10, paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center', width: 56 },
  voucherCardDiscount: { color: '#fff', fontSize: 13, fontWeight: '800', textAlign: 'center', lineHeight: 16 },
  voucherCardDiscountLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 8, fontWeight: '700', textAlign: 'center', marginTop: 2 },
  voucherCardRight: { padding: 8, flex: 1, justifyContent: 'center' },
  voucherCardCode: { fontSize: 12, fontWeight: '700', color: '#111827', marginBottom: 2 },
  voucherCardMin: { fontSize: 9, color: '#6b7280', marginBottom: 3 },
  voucherCardFooter: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  voucherCardRemaining: { fontSize: 9, color: '#6b7280', fontWeight: '600' },
  voucherProgressBar: { height: 4, backgroundColor: '#f3f4f6', borderRadius: 2, overflow: 'hidden' },
  voucherProgressFill: { height: 4, borderRadius: 2 },
  voucherSelectedBadge: { position: 'absolute', top: 4, right: 4 },

  summaryBox: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginTop: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  summaryTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 12 },
  summaryItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  summaryItemImage: { width: 40, height: 40, backgroundColor: '#f3f4f6', borderRadius: 8, marginRight: 12, padding: 4 },
  summaryItemContent: { flex: 1 },
  summaryItemTitle: { fontSize: 13, fontWeight: '600', color: '#111827', marginBottom: 2 },
  summaryItemSubtitle: { fontSize: 11, color: '#6b7280' },
  summaryItemPrice: { fontSize: 13, fontWeight: '700', color: '#111827' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 13, color: '#4b5563' },
  summaryValue: { fontSize: 13, color: '#111827', fontWeight: '500' },
  freeText: { fontSize: 13, color: '#d70018', fontWeight: '600' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  totalLabel: { fontSize: 15, fontWeight: '700', color: '#111827' },
  totalValue: { fontSize: 18, fontWeight: '800', color: '#d70018' },

  bottomActionContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24, borderTopWidth: 1, borderColor: '#f3f4f6' },
  placeOrderBtn: { backgroundColor: '#d70018', borderRadius: 8, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  placeOrderText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  secureContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  secureText: { fontSize: 11, color: '#9ca3af', marginLeft: 4 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, height: '60%', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  modalTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  modalItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  modalItemText: { fontSize: 14, color: '#111827' }
});
