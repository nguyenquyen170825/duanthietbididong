import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Input({
  label,
  placeholder,
  leftIconName,
  secureTextEntry,
  value,
  onChangeText,
  rightIconName,
  rightIconColor,
  errorMessage,
}) {
  const [isPasswordHidden, setIsPasswordHidden] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, errorMessage && styles.inputError]}>
        {leftIconName && (
          <Ionicons name={leftIconName} size={20} color="#6b7280" style={styles.icon} />
        )}
        <TextInput
          style={[styles.input, !leftIconName && styles.inputNoLeftPadding]}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          secureTextEntry={isPasswordHidden}
          value={value}
          onChangeText={onChangeText}
        />
        {rightIconName ? (
          <Ionicons
            name={rightIconName}
            size={20}
            color={rightIconColor || "#6b7280"}
            style={styles.rightIcon}
          />
        ) : secureTextEntry ? (
          <TouchableOpacity onPress={() => setIsPasswordHidden(!isPasswordHidden)}>
            <Ionicons
              name={isPasswordHidden ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#6b7280"
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    paddingHorizontal: 16,
    height: 56,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  inputNoLeftPadding: {
    marginLeft: 4,
  },
  rightIcon: {
    marginLeft: 12,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    marginLeft: 4,
  },
});
