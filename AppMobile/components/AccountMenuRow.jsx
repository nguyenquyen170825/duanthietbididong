import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AccountMenuRow({ title, subtitle, iconName, iconBgColor, onPress, isLast = false }) {
  return (
    <TouchableOpacity style={[styles.container, !isLast && styles.borderBottom]} onPress={onPress}>
      <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
        <Ionicons name={iconName} size={20} color="#111827" />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
});
