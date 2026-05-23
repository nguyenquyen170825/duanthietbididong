import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ message, type = 'success', duration = 3000 }) => {
    const id = Date.now() + Math.random();
    const animValue = new Animated.Value(0);

    setToasts(prev => [...prev, { id, message, type, animValue }]);

    // Animate in
    Animated.spring(animValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();

    // Auto remove
    setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      });
    }, duration);

    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => {
      const toast = prev.find(t => t.id === id);
      if (toast) {
        Animated.timing(toast.animValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setToasts(p => p.filter(t => t.id !== id));
        });
      }
      return prev;
    });
  }, []);

  const getToastConfig = (type) => {
    switch (type) {
      case 'success':
        return { bg: '#1a7340', iconName: 'checkmark-circle', iconColor: '#4ade80' };
      case 'error':
        return { bg: '#b91c1c', iconName: 'close-circle', iconColor: '#fca5a5' };
      case 'warning':
        return { bg: '#b45309', iconName: 'warning', iconColor: '#fcd34d' };
      case 'info':
        return { bg: '#1d4ed8', iconName: 'information-circle', iconColor: '#93c5fd' };
      case 'cart':
        return { bg: '#1a7340', iconName: 'cart', iconColor: '#4ade80' };
      default:
        return { bg: '#1a7340', iconName: 'checkmark-circle', iconColor: '#4ade80' };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {/* Toast Container - rendered on top of everything */}
      <View style={styles.toastContainer} pointerEvents="box-none">
        {toasts.map((toast) => {
          const config = getToastConfig(toast.type);
          return (
            <Animated.View
              key={toast.id}
              style={[
                styles.toast,
                { backgroundColor: config.bg },
                {
                  opacity: toast.animValue,
                  transform: [
                    {
                      translateY: toast.animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      }),
                    },
                    {
                      scale: toast.animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.toastIconWrap}>
                <Ionicons name={config.iconName} size={22} color={config.iconColor} />
              </View>
              <Text style={styles.toastText} numberOfLines={2}>{toast.message}</Text>
              <TouchableOpacity onPress={() => hideToast(toast.id)} style={styles.toastClose}>
                <Ionicons name="close" size={16} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 52,
    left: 16,
    right: 16,
    zIndex: 99999,
    gap: 8,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    minHeight: 52,
  },
  toastIconWrap: {
    marginRight: 10,
  },
  toastText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  toastClose: {
    marginLeft: 8,
    padding: 2,
  },
});
