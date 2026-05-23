import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';

export default function OtpInput({ length = 6, value, onChangeText, label }) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const renderBoxes = () => {
    const boxes = [];
    for (let i = 0; i < length; i++) {
      const char = value[i] || '';
      const isCurrentBox = value.length === i || (value.length === length && i === length - 1);
      const isBoxActive = isFocused && isCurrentBox;

      boxes.push(
        <View
          key={i}
          style={[
            styles.box,
            isBoxActive && styles.boxActive,
            char && styles.boxFilled
          ]}
        >
          <Text style={styles.boxText}>{char}</Text>
        </View>
      );
    }
    return boxes;
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable style={styles.boxesContainer} onPress={handlePress}>
        {renderBoxes()}
      </Pressable>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          if (text.length <= length) {
            onChangeText(text.replace(/[^0-9]/g, ''));
          }
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        keyboardType="number-pad"
        maxLength={length}
        style={styles.hiddenInput}
        caretHidden={true}
        // Tắt các tính năng auto để nhập mượt hơn
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  boxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  box: {
    flex: 1,
    height: 56,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  boxActive: {
    borderColor: '#d70018', // Màu đỏ brand của PhoneHub
    borderWidth: 2,
    backgroundColor: '#fff5f5',
    shadowColor: '#d70018',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    transform: [{ scale: 1.05 }], // Phóng to nhẹ ô đang nhập
  },
  boxFilled: {
    borderColor: '#d70018',
    borderWidth: 1.5,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  boxText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
  },
});
