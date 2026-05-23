import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [checkedItemIds, setCheckedItemIds] = useState([]);

  // Auto check new items added to cart
  useEffect(() => {
    const itemIds = cartItems.map(item => item.cartItemId || item.id);
    // Keep only checked IDs that still exist in cart
    setCheckedItemIds(prev => {
      const validChecked = prev.filter(id => itemIds.includes(id));
      // If there are new items not in validChecked, add them as checked by default
      const newItems = itemIds.filter(id => !prev.includes(id));
      if (newItems.length > 0) {
        return [...validChecked, ...newItems];
      }
      return validChecked;
    });
  }, [cartItems]);

  const addToCart = (product) => {
    if (!product || !product.id) return;
    // Sử dụng cartItemId để phân biệt các biến thể khác nhau của cùng 1 sản phẩm
    const cartItemId = product.variantId ? `${product.id}-${product.variantId}` : product.id;
    
    setCartItems(prev => {
      const existing = prev.find(item => (item.cartItemId || item.id) === cartItemId);
      if (existing) {
        return prev.map(item => (item.cartItemId || item.id) === cartItemId ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prev, { ...product, cartItemId, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => (item.cartItemId || item.id) !== cartItemId));
    setCheckedItemIds(prev => prev.filter(id => id !== cartItemId));
  };

  const updateQuantity = (cartItemId, delta) => {
    setCartItems(prev => prev.map(item => {
      if ((item.cartItemId || item.id) === cartItemId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const toggleItemCheck = (cartItemId) => {
    setCheckedItemIds(prev => 
      prev.includes(cartItemId)
        ? prev.filter(id => id !== cartItemId)
        : [...prev, cartItemId]
    );
  };

  const toggleAllItemsCheck = (isChecked) => {
    if (isChecked) {
      setCheckedItemIds(cartItems.map(item => item.cartItemId || item.id));
    } else {
      setCheckedItemIds([]);
    }
  };

  const removeMultipleFromCart = (ids) => {
    setCartItems(prev => prev.filter(item => !ids.includes(item.cartItemId || item.id)));
    setCheckedItemIds(prev => prev.filter(id => !ids.includes(id)));
  };

  const clearCart = () => {
    setCartItems([]);
    setCheckedItemIds([]);
  };

  const clearCheckedItems = () => {
    setCartItems(prev => prev.filter(item => !checkedItemIds.includes(item.cartItemId || item.id)));
    setCheckedItemIds([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate raw total assuming item.rawPrice exists or parse from item.price String
  const cartTotal = cartItems.reduce((sum, item) => {
      let numericPrice = 0;
      if (item.rawPrice) {
          numericPrice = parseFloat(item.rawPrice);
      } else if (item.price) {
          numericPrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
      }
      return sum + (numericPrice * item.quantity);
  }, 0);

  // Calculate checked total
  const checkedTotal = cartItems
    .filter(item => checkedItemIds.includes(item.cartItemId || item.id))
    .reduce((sum, item) => {
      let numericPrice = 0;
      if (item.rawPrice) {
          numericPrice = parseFloat(item.rawPrice);
      } else if (item.price) {
          numericPrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
      }
      return sum + (numericPrice * item.quantity);
    }, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartCount, 
      cartTotal, 
      checkedItemIds, 
      checkedTotal, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      toggleItemCheck, 
      toggleAllItemsCheck, 
      removeMultipleFromCart, 
      clearCart, 
      clearCheckedItems 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
