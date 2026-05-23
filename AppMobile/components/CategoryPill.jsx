import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CategoryPill({ title, icon, isActive, onPress }) {
  return (
    <TouchableOpacity 
      style={[styles.pill, isActive && styles.activePill]} 
      onPress={onPress}
    >
      <View style={styles.content}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={16} 
            color={isActive ? '#ffffff' : '#4b5563'} 
            style={styles.icon} 
          />
        )}
        <Text style={[styles.text, isActive && styles.activeText]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePill: {
    backgroundColor: '#d70018', // CellphoneS Red
    borderColor: '#d70018',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  activeText: {
    color: '#ffffff',
  },
});
