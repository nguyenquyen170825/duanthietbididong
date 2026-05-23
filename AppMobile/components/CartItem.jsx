import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fixImageUrl } from '../config/apiConfig';

export default function CartItem({ 
  title, 
  subtitle, 
  price, 
  quantity = 1, 
  imagePlaceholderColor = '#f1f5f9', 
  imageUrl, 
  onIncrement, 
  onDecrement, 
  onRemove,
  checked = false,
  onToggleCheck
}) {
  return (
    <View style={styles.card}>
      {/* Checkbox for item selection */}
      <TouchableOpacity style={styles.checkboxContainer} onPress={onToggleCheck} activeOpacity={0.7}>
        {checked ? (
          <View style={styles.checkboxChecked}>
            <Ionicons name="checkmark" size={12} color="#ffffff" />
          </View>
        ) : (
          <View style={styles.checkboxUnchecked} />
        )}
      </TouchableOpacity>

      <View style={[styles.imageContainer, { backgroundColor: imagePlaceholderColor }]}>
        {fixImageUrl(imageUrl) ? (
            <Image source={{ uri: fixImageUrl(imageUrl) }} style={styles.productImage} resizeMode="contain" />
        ) : (
            <Ionicons name="phone-portrait-outline" size={32} color="#94a3b8" style={{ opacity: 0.5 }} />
        )}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        
        <View style={styles.bottomRow}>
          <View style={styles.quantityPicker}>
            <TouchableOpacity style={styles.qtyBtn} onPress={onDecrement}>
              <Ionicons name="remove" size={16} color="#4b5563" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={onIncrement}>
              <Ionicons name="add" size={16} color="#4b5563" />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
             <Text style={styles.price}>{price}</Text>
             <TouchableOpacity style={{marginLeft: 12}} onPress={onRemove}>
                 <Ionicons name="trash-outline" size={18} color="#ef4444" />
             </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  checkboxContainer: {
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#d70018',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxUnchecked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    width: 76,
    height: 76,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  qtyBtn: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    marginHorizontal: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '900',
    color: '#d70018',
  },
  productImage: {
    width: '90%',
    height: '90%',
    borderRadius: 6,
  },
});
