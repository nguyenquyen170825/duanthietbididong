import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNav from '../components/BottomNav';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartScreen() {
  const router = useRouter();
  const { 
    cartItems, 
    cartCount, 
    checkedItemIds, 
    checkedTotal, 
    updateQuantity, 
    removeFromCart, 
    toggleItemCheck, 
    toggleAllItemsCheck, 
    removeMultipleFromCart 
  } = useCart();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={{ width: 28 }} />
          <Text style={styles.brandText}>PhoneHub</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <Ionicons name="cart-outline" size={80} color="#cbd5e1" style={{ marginBottom: 16 }} />
          <Text style={styles.pageTitle}>Giỏ hàng của bạn</Text>
          <Text style={{ textAlign: 'center', marginTop: 8, color: '#64748b', fontSize: 13, lineHeight: 18 }}>Đăng nhập để thêm sản phẩm vào giỏ hàng và thanh toán dễ dàng.</Text>
          <TouchableOpacity style={{ backgroundColor: '#d70018', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8, marginTop: 24 }} onPress={() => router.push('/login')}>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800' }}>Đăng nhập để mua sắm</Text>
          </TouchableOpacity>
        </View>
        <BottomNav activeTab="cart" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 28 }} />
        <Text style={styles.brandText}>PhoneHub</Text>
        <TouchableOpacity style={styles.cartBtn}>
          <Ionicons name="cart" size={24} color="#d70018" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Giỏ hàng của bạn</Text>
          <Text style={styles.pageSubtitle}>{cartCount} sản phẩm sẵn sàng thanh toán</Text>
        </View>

        {/* Checkbox Select All bar */}
        {cartItems.length > 0 && (
          <View style={styles.selectAllHeader}>
            <TouchableOpacity 
              style={styles.selectAllCheckboxContainer} 
              onPress={() => toggleAllItemsCheck(checkedItemIds.length !== cartItems.length)}
              activeOpacity={0.7}
            >
              <View style={checkedItemIds.length === cartItems.length ? styles.checkboxChecked : styles.checkboxUnchecked}>
                {checkedItemIds.length === cartItems.length && <Ionicons name="checkmark" size={12} color="#ffffff" />}
              </View>
              <Text style={styles.selectAllText}>Chọn tất cả ({cartItems.length} sản phẩm)</Text>
            </TouchableOpacity>
            {checkedItemIds.length > 0 && (
              <TouchableOpacity 
                style={styles.deleteSelectedBtn} 
                onPress={() => removeMultipleFromCart(checkedItemIds)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={14} color="#ef4444" style={{ marginRight: 4 }} />
                <Text style={styles.deleteSelectedText}>Xóa đã chọn ({checkedItemIds.length})</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Cart Items */}
        <View style={styles.itemsWrapper}>
          {cartItems.map((item) => {
             const isChecked = checkedItemIds.includes(item.cartItemId || item.id);
             return (
               <CartItem
                 key={item.cartItemId || item.id}
                 title={item.title}
                 subtitle={item.subtitle || 'Phiên bản Tiêu chuẩn'}
                 price={`${Number(item.rawPrice || item.price || 0).toLocaleString('vi-VN')} ₫`}
                 quantity={item.quantity}
                 imageUrl={item.imageUrl}
                 onIncrement={() => updateQuantity(item.cartItemId || item.id, 1)}
                 onDecrement={() => updateQuantity(item.cartItemId || item.id, -1)}
                 onRemove={() => removeFromCart(item.cartItemId || item.id)}
                 checked={isChecked}
                 onToggleCheck={() => toggleItemCheck(item.cartItemId || item.id)}
               />
             );
          })}
          {cartItems.length === 0 && (
             <View style={{padding: 60, alignItems: 'center'}}>
                <Ionicons name="cart-outline" size={64} color="#cbd5e1" style={{ marginBottom: 12 }} />
                <Text style={{color: '#94a3b8', fontWeight: '600'}}>Giỏ hàng của bạn đang trống.</Text>
             </View>
          )}
        </View>

        {/* Summary Block */}
        {cartItems.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tạm tính</Text>
              <Text style={styles.summaryValue}>{checkedTotal.toLocaleString('vi-VN')} ₫</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí giao hàng</Text>
              <Text style={[styles.summaryValue, { color: '#d70018', fontWeight: '700' }]}>Miễn phí</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Thuế (8%)</Text>
              <Text style={styles.summaryValue}>{(checkedTotal * 0.08).toLocaleString('vi-VN')} ₫</Text>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>{(checkedTotal * 1.08).toLocaleString('vi-VN')} ₫</Text>
            </View>

            <TouchableOpacity 
              style={[
                styles.checkoutBtn,
                checkedItemIds.length === 0 && styles.checkoutBtnDisabled
              ]} 
              onPress={() => checkedItemIds.length > 0 && router.push('/checkout')}
              disabled={checkedItemIds.length === 0}
              activeOpacity={0.8}
            >
              <Text style={styles.checkoutBtnText}>
                Thanh toán ({checkedItemIds.length})
              </Text>
            </TouchableOpacity>
            <Text style={styles.checkoutNote}>Giao hàng tiêu chuẩn 2-3 ngày và thanh toán bảo mật mã hóa SSL.</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav activeTab="cart" />
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#d70018',
  },
  cartBtn: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff3b30',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 2,
  },
  pageSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  selectAllHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  selectAllCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#d70018',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxUnchecked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    marginRight: 10,
  },
  selectAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  deleteSelectedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  deleteSelectedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ef4444',
  },
  itemsWrapper: {
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    color: '#1e293b',
    fontWeight: '700',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#d70018',
  },
  checkoutBtn: {
    backgroundColor: '#d70018',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#d70018',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  checkoutBtnDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  checkoutNote: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 14,
    fontWeight: '500',
  },
});
