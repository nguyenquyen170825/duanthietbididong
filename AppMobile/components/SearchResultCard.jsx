import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { fixImageUrl } from '../config/apiConfig';

export default function SearchResultCard({ id, title, badgeText, specs, price, rawPrice, oldPrice, isFoldable, isBlueBadge, imageUrl }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const handleCardPress = () => {
    router.push(`/product/${id}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleCardPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        {fixImageUrl(imageUrl) ? (
          <Image source={{ uri: fixImageUrl(imageUrl) }} style={styles.productImage} resizeMode="contain" />
        ) : (
          <Ionicons name="phone-portrait-outline" size={48} color="#9ca3af" />
        )}
        {isFoldable && <Text style={styles.placeholderLabel}>SAFE</Text>}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        
        <View style={styles.metadataRow}>
          {badgeText && (
            <View style={[styles.badge, isBlueBadge ? styles.badgeBlue : styles.badgeGreen]}>
              <Text style={[styles.badgeText, isBlueBadge ? styles.badgeTextBlue : styles.badgeTextGreen]}>
                {badgeText}
              </Text>
            </View>
          )}
          <Text style={styles.specsText}>{specs}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>{price}</Text>
          {oldPrice && <Text style={styles.oldPrice}>{oldPrice}</Text>}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.cartButton} 
        onPress={(e) => {
          e.stopPropagation();
          if (isLoggedIn) addToCart({ id, title, subtitle: specs, price, imageUrl, rawPrice });
          else router.push('/login');
        }}
      >
        <Ionicons name="cart-outline" size={20} color="#d70018" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  placeholderLabel: {
    color: '#d70018',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  badgeBlue: {
    backgroundColor: '#fef2f2',
  },
  badgeGreen: {
    backgroundColor: '#fef2f2',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  badgeTextBlue: {
    color: '#d70018',
  },
  badgeTextGreen: {
    color: '#d70018',
  },
  specsText: {
    fontSize: 11,
    color: '#64748b',
    flexShrink: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '900',
    color: '#d70018',
  },
  oldPrice: {
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  cartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
});
