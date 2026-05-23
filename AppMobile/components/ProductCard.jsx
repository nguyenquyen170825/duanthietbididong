import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { fixImageUrl } from '../config/apiConfig';

export default function ProductCard({ 
  id, 
  title, 
  subtitle, 
  price, 
  rawPrice, 
  rating, 
  isSale, 
  imageUrl, 
  style, 
  productVariants, 
  isFlashSale,
  quantitySold = 0
}) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const handleCardPress = () => {
    router.push(`/product/${id}`);
  };

  const rawPriceVal = Number(rawPrice) || 0;
  
  // Lấy oldPrice từ biến thể đầu tiên nếu có
  const firstVariant = productVariants && productVariants.length > 0 ? productVariants[0] : null;
  let oldPriceVal = firstVariant && firstVariant.oldPrice ? Number(firstVariant.oldPrice) : null;
  
  // Nếu là sản phẩm sale/flash sale nhưng không có oldPrice, tự tính toán để giao diện hiển thị đẹp mắt
  if ((isSale || isFlashSale) && (!oldPriceVal || oldPriceVal <= rawPriceVal)) {
    oldPriceVal = Math.round(rawPriceVal * 1.15); // Giá gốc cao hơn 15%
  }
  
  const hasDiscount = oldPriceVal && oldPriceVal > rawPriceVal;
  const discountPercent = hasDiscount ? Math.round(((oldPriceVal - rawPriceVal) / oldPriceVal) * 100) : 0;
  const formattedOldPrice = hasDiscount ? `${Number(oldPriceVal).toLocaleString('vi-VN')} ₫` : null;

  // Số lượng còn lại và đã bán
  const quantityRemaining = firstVariant && typeof firstVariant.stockQuantity === 'number' ? firstVariant.stockQuantity : 10;
  const totalQty = quantitySold + quantityRemaining;
  const progressPercent = totalQty > 0 ? Math.round((quantitySold / totalQty) * 100) : 0;

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={handleCardPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        {isSale && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleText}>GIẢM GIÁ</Text>
          </View>
        )}
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart" size={16} color="#ef4444" />
        </TouchableOpacity>
        {fixImageUrl(imageUrl) ? (
          <Image source={{ uri: fixImageUrl(imageUrl) }} style={styles.productImage} resizeMode="contain" />
        ) : (
          <Ionicons name="phone-portrait-outline" size={48} color="#cbd5e1" style={styles.placeholderImg} />
        )}
      </View>

      <View style={styles.detailsContainer}>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
          </View>
          
          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={10} color="#ffffff" />
              <Text style={styles.ratingText}>{rating || '5.0'}</Text>
            </View>
            <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
          </View>
        </View>
        
        <View>
          {/* Lượng đã bán cho khung thường */}
          {!isFlashSale && (
            <View style={styles.soldTextContainer}>
              <Text style={styles.soldText}>Đã bán {quantitySold}</Text>
            </View>
          )}

          {/* Khối hiển thị tiến trình cho Flash Sale */}
          {isFlashSale && (
            <View style={styles.flashSaleContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                <View style={styles.progressBarTextWrapper}>
                  <Ionicons name="flame" size={10} color="#eab308" style={{ marginRight: 2 }} />
                  <Text style={styles.progressBarText}>
                    {quantityRemaining === 0 ? 'Hết hàng' : `Còn lại ${quantityRemaining}`}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.priceRow}>
            <View style={styles.priceCol}>
              <Text style={styles.price}>{price}</Text>
              {hasDiscount && (
                <View style={styles.oldPriceRow}>
                  <Text style={styles.oldPrice}>{formattedOldPrice}</Text>
                  <Text style={styles.discountPercent}>-{discountPercent}%</Text>
                </View>
              )}
            </View>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={(e) => {
                e.stopPropagation();
                if (isLoggedIn) addToCart({ id, title, subtitle, price, imageUrl, rawPrice });
                else router.push('/login');
              }}
            >
              <Ionicons name="cart" size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    width: '48.5%', // 2 products per row
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  imageContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  placeholderImg: {
    opacity: 0.5,
  },
  favoriteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#ffffff',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    zIndex: 10,
  },
  saleBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#d70018',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  saleText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '800',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleRow: {
    marginBottom: 4,
    height: 36, // fix height for 2 lines of text to align cards
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b', // amber star badge
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  ratingText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
    marginLeft: 2,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  priceCol: {
    flexDirection: 'column',
    flex: 1,
  },
  price: {
    fontSize: 13,
    fontWeight: '800',
    color: '#d70018', // CellphoneS Red
    marginRight: 4,
  },
  oldPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
    gap: 4,
  },
  oldPrice: {
    fontSize: 10,
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  discountPercent: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#d70018',
    paddingHorizontal: 3,
    paddingVertical: 0.5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  soldTextContainer: {
    marginTop: 4,
    marginBottom: 2,
  },
  soldText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  flashSaleContainer: {
    marginTop: 4,
    marginBottom: 2,
    width: '100%',
  },
  progressBar: {
    height: 14,
    backgroundColor: '#ffedd5', // light orange
    borderRadius: 7,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#f97316', // orange / flame color
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 7,
  },
  progressBarTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  progressBarText: {
    color: '#431407', // very dark brown/red for excellent contrast
    fontSize: 8.5,
    fontWeight: '800',
  },
  addButton: {
    backgroundColor: '#d70018', // CellphoneS Red
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '85%',
    height: '85%',
    borderRadius: 4,
  },
});
