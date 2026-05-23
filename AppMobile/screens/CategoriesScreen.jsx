import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';
import { useCart } from '../context/CartContext';

// Mock catalog for offline/fallback mode
const fallbackProducts = [
  {
    id: 991,
    title: 'iPhone 15 Pro Max 256GB Chính hãng',
    brand: 'Apple',
    description: 'Chip A17 Pro mạnh mẽ, camera zoom quang học 5x sắc nét.',
    price: '29490000',
    rating: '5.0',
    isSale: true,
    category: { id: 1, name: 'iPhone' },
    images: [{ imageUrl: 'https://cdn2.cellphones.com.vn/insecure/x358,webp/media/catalog/product/i/p/iphone-15-pro-max_3.png' }]
  },
  {
    id: 992,
    title: 'MacBook Air 13 inch M2 8GB 256GB',
    brand: 'Apple',
    description: 'Chip Apple M2 mạnh mẽ vượt trội, thiết kế siêu mỏng nhẹ sang trọng.',
    price: '24990000',
    rating: '4.9',
    isSale: false,
    category: { id: 2, name: 'MacBook' },
    images: [{ imageUrl: 'https://cdn2.cellphones.com.vn/insecure/x358,webp/media/catalog/product/m/a/macbook-air-m2-xam_1.png' }]
  },
  {
    id: 993,
    title: 'AirPods Pro 2 USB-C Chính hãng',
    brand: 'Apple',
    description: 'Chống ồn chủ động vượt trội gấp 2 lần, cổng sạc USB-C mới.',
    price: '5790000',
    rating: '4.8',
    isSale: true,
    category: { id: 3, name: 'AirPods' },
    images: [{ imageUrl: 'https://cdn2.cellphones.com.vn/insecure/x358,webp/media/catalog/product/a/i/airpods-pro-2-usb-c_1.png' }]
  },
  {
    id: 994,
    title: 'Apple Watch Series 9 GPS 41mm viền nhôm',
    brand: 'Apple',
    description: 'Chip S9 SiP tiên tiến, tính năng chạm hai lần tiện lợi, màn hình sáng gấp đôi.',
    price: '9490000',
    rating: '4.9',
    isSale: false,
    category: { id: 4, name: 'Apple Watch' },
    images: [{ imageUrl: 'https://cdn2.cellphones.com.vn/insecure/x358,webp/media/catalog/product/a/p/apple-watch-s9-41mm_1.png' }]
  },
  {
    id: 995,
    title: 'iPhone 15 128GB | Chính hãng VN/A',
    brand: 'Apple',
    description: 'Dynamic Island thời thượng, camera 48MP siêu sắc nét.',
    price: '19790000',
    rating: '4.9',
    isSale: true,
    category: { id: 1, name: 'iPhone' },
    images: [{ imageUrl: 'https://cdn2.cellphones.com.vn/insecure/x358,webp/media/catalog/product/i/p/iphone-15_1_.png' }]
  },
  {
    id: 996,
    title: 'MacBook Pro 14 inch M3 8GB 512GB',
    brand: 'Apple',
    description: 'Chip M3 đỉnh cao, thời lượng pin lên đến 22 giờ, màn hình Liquid Retina XDR.',
    price: '39990000',
    rating: '5.0',
    isSale: true,
    category: { id: 2, name: 'MacBook' },
    images: [{ imageUrl: 'https://cdn2.cellphones.com.vn/insecure/x358,webp/media/catalog/product/m/a/macbook-pro-m3_1.png' }]
  }
];

const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name === 'tất cả') return 'apps-outline';
  if (name.includes('iphone') || name.includes('phone') || name.includes('điện thoại')) {
    return 'phone-portrait-outline';
  }
  if (name.includes('macbook') || name.includes('laptop') || name.includes('máy tính') || name.includes('mac')) {
    return 'laptop-outline';
  }
  if (name.includes('airpods') || name.includes('tai nghe') || name.includes('headphone') || name.includes('earbuds') || name.includes('airpod')) {
    return 'headset-outline';
  }
  if (name.includes('watch') || name.includes('đồng hồ')) {
    return 'watch-outline';
  }
  return 'cube-outline';
};

export default function CategoriesScreen() {
  const router = useRouter();
  const { cartCount } = useCart();
  const [categories, setCategories] = useState([
    { id: 1, name: 'iPhone' },
    { id: 2, name: 'MacBook' },
    { id: 3, name: 'AirPods' },
    { id: 4, name: 'Apple Watch' }
  ]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('iPhone');
  const [selectedCapacity, setSelectedCapacity] = useState('Tất cả');
  const [selectedPriceRange, setSelectedPriceRange] = useState('Tất cả');
  const [selectedColor, setSelectedColor] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('Phổ biến');
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    if (currentOffset > 50) {
      if (!isFilterCollapsed) {
        setIsFilterCollapsed(true);
      }
    } else if (currentOffset < 10) {
      if (isFilterCollapsed) {
        setIsFilterCollapsed(false);
      }
    }
  };

  // Reset bộ lọc khi thay đổi danh mục
  useEffect(() => {
    setSelectedCapacity('Tất cả');
    setSelectedPriceRange('Tất cả');
    setSelectedColor('Tất cả');
    setSortBy('Phổ biến');
  }, [selectedCategory]);

  const handleClearAllFilters = () => {
    setSelectedCapacity('Tất cả');
    setSelectedPriceRange('Tất cả');
    setSelectedColor('Tất cả');
    setSortBy('Phổ biến');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products
        const productsResponse = await axios.get(`${API_BASE_URL}/public/products`);
        if (productsResponse.data && productsResponse.data.length > 0) {
          setProducts(productsResponse.data);
        } else {
          setProducts(fallbackProducts);
        }
      } catch (error) {
        console.error('Error fetching public products:', error);
        setProducts(fallbackProducts);
      }

      try {
        // Fetch categories from DB
        const categoriesResponse = await axios.get(`${API_BASE_URL}/public/categories`);
        if (categoriesResponse.data && categoriesResponse.data.length > 0) {
          setCategories(categoriesResponse.data);
          // Set the first category as active initially
          setSelectedCategory(categoriesResponse.data[0].name);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter products by selected category
  const getCategoryProducts = () => {
    return products.filter(p => {
      // 1. Check matching category object from database/API
      if (p.category) {
        if (typeof p.category === 'object' && p.category.name) {
          return p.category.name.toLowerCase() === selectedCategory.toLowerCase();
        }
        if (typeof p.category === 'object' && p.category.id) {
          const activeCatObj = categories.find(c => c.name.toLowerCase() === selectedCategory.toLowerCase());
          if (activeCatObj && p.category.id === activeCatObj.id) {
            return true;
          }
        }
        if (typeof p.category === 'string') {
          return p.category.toLowerCase() === selectedCategory.toLowerCase();
        }
        if (typeof p.category === 'number') {
          const activeCatObj = categories.find(c => c.name.toLowerCase() === selectedCategory.toLowerCase());
          if (activeCatObj && p.category === activeCatObj.id) {
            return true;
          }
        }
      }

      // 2. Fallback matching using title/brand/description keywords
      const titleLower = p.title?.toLowerCase() || '';
      const brandLower = p.brand?.toLowerCase() || '';
      const descLower = p.description?.toLowerCase() || '';
      const catLower = selectedCategory.toLowerCase();

      if (catLower === 'iphone') {
        return brandLower === 'apple' && (titleLower.includes('iphone') || (!titleLower.includes('macbook') && !titleLower.includes('watch') && !titleLower.includes('airpods')));
      }
      if (catLower === 'macbook') {
        return titleLower.includes('macbook') || titleLower.includes('mac') || descLower.includes('macbook');
      }
      if (catLower === 'airpods') {
        return titleLower.includes('airpods') || titleLower.includes('airpod') || titleLower.includes('tai nghe');
      }
      if (catLower === 'apple watch') {
        return titleLower.includes('watch') || titleLower.includes('đồng hồ');
      }

      return titleLower.includes(catLower) || brandLower.includes(catLower);
    });
  };

  const getGbValue = (cap) => {
    const match = cap.match(/^(\d+)\s*(GB|TB)$/i);
    if (!match) return 0;
    const val = parseInt(match[1]);
    const unit = match[2].toUpperCase();
    return unit === 'TB' ? val * 1024 : val;
  };

  const getDynamicCapacities = (productList) => {
    const caps = new Set();
    productList.forEach(p => {
      if (p.productVariants && p.productVariants.length > 0) {
        p.productVariants.forEach(v => {
          if (v.capacity) {
            caps.add(v.capacity.trim());
          }
        });
      } else {
        const titleMatches = p.title.match(/\b\d+\s*(?:GB|TB)\b/gi);
        if (titleMatches) {
          titleMatches.forEach(m => caps.add(m.trim().toUpperCase()));
        }
      }
    });
    return Array.from(caps).sort((a, b) => getGbValue(a) - getGbValue(b));
  };

  const getDynamicColors = (productList) => {
    const colors = new Set();
    productList.forEach(p => {
      if (p.productVariants && p.productVariants.length > 0) {
        p.productVariants.forEach(v => {
          if (v.color) {
            colors.add(v.color.trim());
          }
        });
      }
    });
    return Array.from(colors).sort();
  };

  const categoryProducts = getCategoryProducts();
  const dynamicCapacities = getDynamicCapacities(categoryProducts);
  const dynamicColors = getDynamicColors(categoryProducts);

  const getFilteredProducts = () => {
    let result = [...categoryProducts];

    // Lọc theo dung lượng
    if (selectedCapacity !== 'Tất cả') {
      result = result.filter(p => {
        if (p.productVariants && p.productVariants.length > 0) {
          return p.productVariants.some(v => v.capacity && v.capacity.trim().toLowerCase() === selectedCapacity.toLowerCase());
        }
        return p.title.toLowerCase().includes(selectedCapacity.toLowerCase());
      });
    }

    // Lọc theo màu sắc
    if (selectedColor !== 'Tất cả') {
      result = result.filter(p => {
        if (p.productVariants && p.productVariants.length > 0) {
          return p.productVariants.some(v => v.color && v.color.trim().toLowerCase() === selectedColor.toLowerCase());
        }
        return false;
      });
    }

    // Lọc theo khoảng giá
    if (selectedPriceRange !== 'Tất cả') {
      result = result.filter(p => {
        const priceNum = Number(p.price);
        if (selectedPriceRange === 'Dưới 10 triệu') {
          return priceNum < 10000000;
        } else if (selectedPriceRange === '10 - 15 triệu') {
          return priceNum >= 10000000 && priceNum <= 15000000;
        } else if (selectedPriceRange === '15 - 20 triệu') {
          return priceNum >= 15000000 && priceNum <= 20000000;
        } else if (selectedPriceRange === 'Trên 20 triệu') {
          return priceNum > 20000000;
        }
        return true;
      });
    }

    // Sắp xếp
    if (sortBy === 'Phổ biến') {
      result.sort((a, b) => Number(b.rating || 5.0) - Number(a.rating || 5.0));
    } else if (sortBy === 'Bán chạy') {
      result.sort((a, b) => {
        const isSaleA = a.isSale || false;
        const isSaleB = b.isSale || false;
        if (isSaleA !== isSaleB) {
          return isSaleB ? 1 : -1;
        }
        return Number(b.rating || 5.0) - Number(a.rating || 5.0);
      });
    } else if (sortBy === 'Giá thấp - cao') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'Giá cao - thấp') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  };

  const filteredList = getFilteredProducts();

  const hasActiveFilters = selectedCapacity !== 'Tất cả' || selectedColor !== 'Tất cả' || selectedPriceRange !== 'Tất cả' || sortBy !== 'Phổ biến';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header (Cố định trên cùng) */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh mục sản phẩm</Text>
        <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/cart')}>
          <Ionicons name="cart" size={24} color="#ffffff" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Sticky Header: Categories + Filters (Cố định ở trên cao khi lướt sản phẩm) */}
      <View style={styles.stickyHeaderContainer}>
        {/* Thanh danh mục cuộn ngang */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={`cat-tab-${cat.id}`}
                style={[styles.categoryTab, isActive && styles.activeCategoryTab]}
                onPress={() => setSelectedCategory(cat.name)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={getCategoryIcon(cat.name)}
                  size={16}
                  color={isActive ? '#ffffff' : '#475569'}
                  style={styles.tabIcon}
                />
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Thanh Bộ Lọc & Sắp Xếp */}
        <View style={styles.filterSection}>
          {/* Header của Bộ lọc với nút Xóa tất cả */}
          <TouchableOpacity 
            style={styles.filterHeaderRow}
            onPress={() => setIsFilterCollapsed(!isFilterCollapsed)}
            activeOpacity={0.7}
          >
            <View style={styles.filterHeaderTitleRow}>
              <Ionicons name="funnel-outline" size={14} color="#d70018" style={{ marginRight: 6 }} />
              <Text style={styles.filterHeaderTitle}>Bộ lọc sản phẩm</Text>
              <Ionicons 
                name={isFilterCollapsed ? "chevron-down" : "chevron-up"} 
                size={14} 
                color="#d70018" 
                style={{ marginLeft: 6 }} 
              />
            </View>
            <TouchableOpacity 
              style={[
                styles.clearAllBtn, 
                !hasActiveFilters && styles.disabledClearAllBtn
              ]} 
              onPress={handleClearAllFilters}
              disabled={!hasActiveFilters}
            >
              <Ionicons 
                name="trash-outline" 
                size={12} 
                color={hasActiveFilters ? "#d70018" : "#94a3b8"} 
                style={{ marginRight: 4 }} 
              />
              <Text style={[
                styles.clearAllText, 
                !hasActiveFilters && styles.disabledClearAllText
              ]}>Xóa tất cả</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {!isFilterCollapsed && (
            <>
              {/* Sắp xếp */}
              <View style={styles.filterRow}>
                <Text style={styles.filterLabelText}>Sắp xếp:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
                  {['Phổ biến', 'Bán chạy', 'Giá thấp-cao', 'Giá cao-thấp'].map((opt) => {
                    const displayOpt = opt === 'Giá thấp-cao' ? 'Giá ↑' : opt === 'Giá cao-thấp' ? 'Giá ↓' : opt;
                    const targetValue = opt === 'Giá thấp-cao' ? 'Giá thấp - cao' : opt === 'Giá cao-thấp' ? 'Giá cao - thấp' : opt;
                    const isAct = sortBy === targetValue;
                    const isAnyOtherSortActive = sortBy !== 'Phổ biến';
                    const opacityStyle = isAnyOtherSortActive && !isAct ? { opacity: 0.35 } : { opacity: 1 };
                    return (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.filterChip, isAct && styles.activeFilterChip, opacityStyle]}
                        onPress={() => setSortBy(isAct ? 'Phổ biến' : targetValue)}
                      >
                        <Text style={[styles.filterChipText, isAct && styles.activeFilterChipText]}>
                          {displayOpt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Dung lượng (Chỉ hiện khi có dung lượng) */}
              {dynamicCapacities.length > 0 && (
                <View style={styles.filterRow}>
                  <Text style={styles.filterLabelText}>Dung lượng:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
                    {(() => {
                      const isAnyOtherCapActive = selectedCapacity !== 'Tất cả';
                      const allOpacity = isAnyOtherCapActive && selectedCapacity !== 'Tất cả' ? { opacity: 0.35 } : { opacity: 1 };
                      return (
                        <TouchableOpacity
                          style={[styles.filterChip, selectedCapacity === 'Tất cả' && styles.activeFilterChip, allOpacity]}
                          onPress={() => setSelectedCapacity('Tất cả')}
                        >
                          <Text style={[styles.filterChipText, selectedCapacity === 'Tất cả' && styles.activeFilterChipText]}>
                            Tất cả GB
                          </Text>
                        </TouchableOpacity>
                      );
                    })()}
                    {dynamicCapacities.map((cap) => {
                      const isAct = selectedCapacity === cap;
                      const isAnyOtherCapActive = selectedCapacity !== 'Tất cả';
                      const opacityStyle = isAnyOtherCapActive && !isAct ? { opacity: 0.35 } : { opacity: 1 };
                      return (
                        <TouchableOpacity
                          key={cap}
                          style={[styles.filterChip, isAct && styles.activeFilterChip, opacityStyle]}
                          onPress={() => setSelectedCapacity(selectedCapacity === cap ? 'Tất cả' : cap)}
                        >
                          <Text style={[styles.filterChipText, isAct && styles.activeFilterChipText]}>
                            {cap}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* Màu sắc (Chỉ hiện khi có màu sắc) */}
              {dynamicColors.length > 0 && (
                <View style={styles.filterRow}>
                  <Text style={styles.filterLabelText}>Màu sắc:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
                    {(() => {
                      const isAnyOtherColActive = selectedColor !== 'Tất cả';
                      const allOpacity = isAnyOtherColActive && selectedColor !== 'Tất cả' ? { opacity: 0.35 } : { opacity: 1 };
                      return (
                        <TouchableOpacity
                          style={[styles.filterChip, selectedColor === 'Tất cả' && styles.activeFilterChip, allOpacity]}
                          onPress={() => setSelectedColor('Tất cả')}
                        >
                          <Text style={[styles.filterChipText, selectedColor === 'Tất cả' && styles.activeFilterChipText]}>
                            Tất cả màu
                          </Text>
                        </TouchableOpacity>
                      );
                    })()}
                    {dynamicColors.map((col) => {
                      const isAct = selectedColor === col;
                      const isAnyOtherColActive = selectedColor !== 'Tất cả';
                      const opacityStyle = isAnyOtherColActive && !isAct ? { opacity: 0.35 } : { opacity: 1 };
                      return (
                        <TouchableOpacity
                          key={col}
                          style={[styles.filterChip, isAct && styles.activeFilterChip, opacityStyle]}
                          onPress={() => setSelectedColor(selectedColor === col ? 'Tất cả' : col)}
                        >
                          <Text style={[styles.filterChipText, isAct && styles.activeFilterChipText]}>
                            {col}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* Giá bán */}
              <View style={styles.filterRow}>
                <Text style={styles.filterLabelText}>Giá bán:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
                  {['Tất cả', 'Dưới 10 triệu', '10 - 15 triệu', '15 - 20 triệu', 'Trên 20 triệu'].map((range) => {
                    const displayRange = range === 'Dưới 10 triệu' ? '<10Tr' : range === '10 - 15 triệu' ? '10-15Tr' : range === '15 - 20 triệu' ? '15-20Tr' : range === 'Trên 20 triệu' ? '>20Tr' : 'Tất cả giá';
                    const isAct = selectedPriceRange === range;
                    const isAnyOtherPriceActive = selectedPriceRange !== 'Tất cả';
                    const opacityStyle = isAnyOtherPriceActive && !isAct ? { opacity: 0.35 } : { opacity: 1 };
                    return (
                      <TouchableOpacity
                        key={range}
                        style={[styles.filterChip, isAct && styles.activeFilterChip, opacityStyle]}
                        onPress={() => setSelectedPriceRange(isAct ? 'Tất cả' : range)}
                      >
                        <Text style={[styles.filterChipText, isAct && styles.activeFilterChipText]}>
                          {displayRange}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Danh sách sản phẩm cuộn dọc bên dưới */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#d70018" />
        </View>
      ) : filteredList.length > 0 ? (
        <ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Header hiển thị số lượng sản phẩm */}
          <View style={styles.paneHeader}>
            <Text style={styles.paneTitle}>{selectedCategory}</Text>
            <Text style={styles.paneCount}>{filteredList.length} sản phẩm</Text>
          </View>

          <View style={styles.productsGrid}>
            {filteredList.map((product) => (
              <ProductCard
                key={`cat-prod-${product.id}`}
                id={product.id}
                title={product.title}
                subtitle={product.description || product.subtitle}
                price={`${Number(product.price).toLocaleString('vi-VN')} ₫`}
                rawPrice={product.price}
                rating={product.rating}
                isSale={product.isSale}
                imageUrl={product.images && product.images.length > 0 ? product.images[0].imageUrl : null}
                productVariants={product.productVariants}
                quantitySold={product.quantitySold}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name={getCategoryIcon(selectedCategory)} size={48} color="#cbd5e1" />
          <Text style={styles.emptyText}>Chưa có sản phẩm nào cho danh mục này</Text>
        </View>
      )}

      {/* Điều hướng dưới cùng */}
      <BottomNav activeTab="categories" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#d70018',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    zIndex: 10,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  cartBtn: {
    position: 'relative',
    padding: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ffbe00',
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#1e293b',
    fontSize: 8,
    fontWeight: '900',
  },
  stickyHeaderContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 5,
  },
  categoriesScroll: {
    marginBottom: 8,
  },
  categoriesScrollContent: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeCategoryTab: {
    backgroundColor: '#d70018',
    borderColor: '#d70018',
    shadowColor: '#d70018',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  activeTabText: {
    color: '#ffffff',
  },
  filterSection: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    borderLeftColor: '#d70018',
    marginTop: 8,
    shadowColor: '#d70018',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  filterHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 6,
    marginBottom: 8,
  },
  filterHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#d70018',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ffe4e6',
  },
  clearAllText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#d70018',
  },
  disabledClearAllBtn: {
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  disabledClearAllText: {
    color: '#94a3b8',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  filterLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    width: 75,
  },
  filterChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  filterChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#fef2f2',
    borderColor: '#f87171',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  activeFilterChipText: {
    color: '#d70018',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 80,
  },
  paneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 12,
  },
  paneTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  paneCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
