import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ProductDetailScreen from '../../screens/ProductDetailScreen';

export default function ProductDetailRoute() {
  const { id } = useLocalSearchParams();
  
  // We can pass the id down if needed, but for now we render the static mock view
  return <ProductDetailScreen />;
}
