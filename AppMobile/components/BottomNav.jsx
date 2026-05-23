import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { notificationAPI } from '../services/api';

export default function BottomNav({ activeTab }) {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const { cartCount } = useCart();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isLoggedIn) {
      notificationAPI.getUnreadCount()
        .then(data => setUnreadCount(data.unreadCount || 0))
        .catch(err => console.log('Lỗi lấy số thông báo BottomNav:', err));
    } else {
      setUnreadCount(0);
    }
  }, [isLoggedIn]);

  const getStyle = (tabName) => {
    const isActive = activeTab === tabName;
    return {
      textColor: isActive ? '#d70018' : '#708090',
      iconColor: isActive ? '#d70018' : '#708090',
    };
  };

  const getIconName = (tabName) => {
    const isActive = activeTab === tabName;
    switch (tabName) {
      case 'home':
        return isActive ? 'home' : 'home-outline';
      case 'categories':
        return isActive ? 'grid' : 'grid-outline';
      case 'cart':
        return isActive ? 'cart' : 'cart-outline';
      case 'notifications':
        return isActive ? 'notifications' : 'notifications-outline';
      case 'account':
        return isActive ? 'person' : 'person-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const handlePress = (tabName) => {
    if (tabName === 'home') router.push('/home');
    if (tabName === 'categories') router.push('/categories');
    if (tabName === 'cart') router.push('/cart');
    if (tabName === 'notifications') router.push('/notifications');
    if (tabName === 'account') router.push('/account');
  };

  // Lấy 2 chữ cái đầu tên người dùng cho avatar
  const getInitials = () => {
    if (!user?.fullName) return '';
    const parts = user.fullName.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const isAccountActive = activeTab === 'account';

  return (
    <View style={styles.bottomNav}>
      {/* Trang chủ */}
      <TouchableOpacity style={styles.navItem} onPress={() => handlePress('home')}>
        <Ionicons name={getIconName('home')} size={22} color={getStyle('home').iconColor} />
        <Text style={[styles.navText, { color: getStyle('home').textColor }]}>Trang chủ</Text>
      </TouchableOpacity>

      {/* Danh mục */}
      <TouchableOpacity style={styles.navItem} onPress={() => handlePress('categories')}>
        <Ionicons name={getIconName('categories')} size={22} color={getStyle('categories').iconColor} />
        <Text style={[styles.navText, { color: getStyle('categories').textColor }]}>Danh mục</Text>
      </TouchableOpacity>

      {/* Giỏ hàng */}
      <TouchableOpacity style={styles.navItem} onPress={() => handlePress('cart')}>
        <View style={{ position: 'relative' }}>
          <Ionicons name={getIconName('cart')} size={22} color={getStyle('cart').iconColor} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.navText, { color: getStyle('cart').textColor }]}>Giỏ hàng</Text>
      </TouchableOpacity>

      {/* Thông báo */}
      <TouchableOpacity style={styles.navItem} onPress={() => handlePress('notifications')}>
        <View style={{ position: 'relative' }}>
          <Ionicons name={getIconName('notifications')} size={22} color={getStyle('notifications').iconColor} />
          {unreadCount > 0 && (
            <View style={styles.notiBadge}>
              <Text style={styles.notiBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.navText, { color: getStyle('notifications').textColor }]}>Thông báo</Text>
      </TouchableOpacity>

      {/* Smember - Nổi bật khi đăng nhập */}
      <TouchableOpacity
        style={[styles.navItem, isLoggedIn && styles.navItemSmemberActive]}
        onPress={() => handlePress('account')}
      >
        {isLoggedIn ? (
          // Khi đã đăng nhập: hiển thị avatar chữ cái + badge xanh
          <View style={[styles.smemberAvatarWrap, isAccountActive && styles.smemberAvatarWrapActive]}>
            <View style={[styles.smemberAvatar, isAccountActive && styles.smemberAvatarActiveBg]}>
              <Text style={[styles.smemberAvatarText, isAccountActive && { color: '#ffffff' }]}>
                {getInitials() || <Ionicons name="person" size={13} color={isAccountActive ? '#ffffff' : '#d70018'} />}
              </Text>
            </View>
            {/* Dấu xanh online */}
            <View style={styles.onlineDot} />
          </View>
        ) : (
          // Khi chưa đăng nhập: icon person bình thường
          <Ionicons name={getIconName('account')} size={22} color={getStyle('account').iconColor} />
        )}
        <Text style={[
          styles.navText,
          { color: isAccountActive ? '#d70018' : (isLoggedIn ? '#d70018' : '#708090') },
          isLoggedIn && styles.navTextSmember,
        ]}>
          {isLoggedIn ? 'Smember ✓' : 'Smember'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navItemSmemberActive: {
    // Khi đã đăng nhập, navItem Smember có glow nhẹ
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  navTextSmember: {
    fontSize: 9,
    fontWeight: '800',
    color: '#d70018',
  },

  // Cart badge
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#d70018',
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '900',
  },

  // Notification badge
  notiBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#d70018',
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  notiBadgeText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '900',
  },

  // Smember avatar khi đã đăng nhập
  smemberAvatarWrap: {
    position: 'relative',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smemberAvatarWrapActive: {
    // Thêm ring đỏ khi tab đang active
  },
  smemberAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffebee',
    borderWidth: 1.5,
    borderColor: '#d70018',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smemberAvatarActiveBg: {
    backgroundColor: '#d70018',
    borderColor: '#d70018',
  },
  smemberAvatarText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#d70018',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
});
