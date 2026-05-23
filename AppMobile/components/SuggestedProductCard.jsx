import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SuggestedProductCard({ title, price, bgColor = '#f3f4f6' }) {
  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <View style={styles.leftContent}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>{price}</Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={16} color="#16a34a" />
        </TouchableOpacity>
      </View>

      <View style={styles.rightImageMock}>
        <Ionicons name="cube-outline" size={48} color="rgba(0,0,0,0.1)" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 4,
    padding: 24,
    marginBottom: 16,
    height: 120,
    overflow: 'hidden',
    position: 'relative',
  },
  leftContent: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    color: '#4b5563',
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rightImageMock: {
    position: 'absolute',
    right: -20,
    top: -20,
    bottom: -20,
    width: 140,
    backgroundColor: 'rgba(0,0,0,0.05)',
    transform: [{ rotate: '15deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
