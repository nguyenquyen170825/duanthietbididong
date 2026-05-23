import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({ placeholder }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color="#6b7280" />
      <TextInput 
        style={styles.input} 
        placeholder={placeholder} 
        placeholderTextColor="#9ca3af"
      />
      <Ionicons name="options-outline" size={20} color="#16a34a" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    paddingHorizontal: 16,
    height: 48,
    marginVertical: 16,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1f2937',
  },
});
