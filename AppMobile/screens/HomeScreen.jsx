import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import CategoryPill from '../components/CategoryPill';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';
import { useCart } from '../context/CartContext';

// Premium mock products in case API returns empty or database is offline
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

export default function HomeScreen() {
  const router = useRouter();
  const { cartCount } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'iPhone' },
    { id: 2, name: 'MacBook' },
    { id: 3, name: 'AirPods' },
    { id: 4, name: 'Apple Watch' }
  ]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [selectedCapacity, setSelectedCapacity] = useState('Tất cả');
  const [selectedPriceRange, setSelectedPriceRange] = useState('Tất cả');
  const [selectedColor, setSelectedColor] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('Phổ biến');

  // Reset bộ lọc khi đổi danh mục
  useEffect(() => {
    setSelectedCapacity('Tất cả');
    setSelectedPriceRange('Tất cả');
    setSelectedColor('Tất cả');
    setSortBy('Phổ biến');
  }, [activeCategory]);

  const handleClearAllFilters = () => {
    setSelectedCapacity('Tất cả');
    setSelectedPriceRange('Tất cả');
    setSelectedColor('Tất cả');
    setSortBy('Phổ biến');
  };

  // Live Countdown Timer State for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 42, seconds: 18 });

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
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              // Loop back for simulated countdown
              hours = 2;
              minutes = 0;
              seconds = 0;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products by active category pill
  const getCategoryProducts = () => {
    if (activeCategory === 'Tất cả') return products;

    return products.filter(p => {
      // 1. Check matching category object from database/API
      if (p.category) {
        if (typeof p.category === 'object' && p.category.name) {
          return p.category.name.toLowerCase() === activeCategory.toLowerCase();
        }
        if (typeof p.category === 'object' && p.category.id) {
          const activeCatObj = categories.find(c => c.name.toLowerCase() === activeCategory.toLowerCase());
          if (activeCatObj && p.category.id === activeCatObj.id) {
            return true;
          }
        }
        if (typeof p.category === 'string') {
          return p.category.toLowerCase() === activeCategory.toLowerCase();
        }
        if (typeof p.category === 'number') {
          const activeCatObj = categories.find(c => c.name.toLowerCase() === activeCategory.toLowerCase());
          if (activeCatObj && p.category === activeCatObj.id) {
            return true;
          }
        }
      }

      // 2. Fallback matching using title/brand/description keywords
      const titleLower = p.title?.toLowerCase() || '';
      const brandLower = p.brand?.toLowerCase() || '';
      const descLower = p.description?.toLowerCase() || '';
      const catLower = activeCategory.toLowerCase();

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

  // Categorizations for dashboard
  const flashSaleProducts = products.filter(p => p.isSale).slice(0, 4);
  const flashSaleDisplay = flashSaleProducts.length > 0 ? flashSaleProducts : products.slice(0, 4);

  const featuredProducts = products.filter(p => p.brand?.toLowerCase() === 'apple' || p.brand?.toLowerCase() === 'samsung').slice(0, 4);
  const featuredDisplay = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  const trendingProducts = products.filter(p => p.brand?.toLowerCase() === 'xiaomi' || p.isSale === false).slice(0, 4);
  const trendingDisplay = trendingProducts.length > 0 ? trendingProducts : products.slice(2, 6);

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Red CellphoneS-style Top Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <TouchableOpacity style={styles.headerMenuBtn}>
            <Ionicons name="menu-outline" size={26} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.brandText}>PhoneHub</Text>
          <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/cart')}>
            <Ionicons name="cart" size={24} color="#ffffff" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar wraps to navigate to search screen */}
        <TouchableOpacity style={styles.searchBarWrapper} onPress={() => router.push('/search')} activeOpacity={0.9}>
          <Ionicons name="search-outline" size={18} color="#94a3b8" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Bạn cần tìm gì?</Text>
          <Ionicons name="camera-outline" size={18} color="#94a3b8" style={{marginLeft: 'auto'}} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Brand Categories Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          <CategoryPill 
            title="Tất cả" 
            icon="apps-outline" 
            isActive={activeCategory === 'Tất cả'} 
            onPress={() => setActiveCategory('Tất cả')} 
          />
          {categories.map((cat) => (
            <CategoryPill 
              key={`category-${cat.id}`}
              title={cat.name} 
              icon={getCategoryIcon(cat.name)}
              isActive={activeCategory === cat.name} 
              onPress={() => setActiveCategory(cat.name)} 
            />
          ))}
        </ScrollView>

        {activeCategory === 'Tất cả' ? (
          <>
            {/* Hero Slider Banner */}
            <View style={styles.heroBanner}>
              <View style={styles.newArrivalBadge}>
                <Ionicons name="sparkles" size={10} color="#ffffff" style={{marginRight: 4}} />
                <Text style={styles.newArrivalText}>DEAL HOT HÔM NAY</Text>
              </View>
              <Text style={styles.heroTitle}>Galaxy S24 Ultra</Text>
              <Text style={styles.heroSubtitle}>
                Trải nghiệm AI di động đột phá. Khai phá các khả năng sáng tạo vượt mong đợi.
              </Text>
              <TouchableOpacity style={styles.shopNowBtn} onPress={() => router.push('/product/2')}>
                <Text style={styles.shopNowText}>Mua ngay</Text>
                <Ionicons name="chevron-forward" size={14} color="#d70018" style={{marginLeft: 4}} />
              </TouchableOpacity>
            </View>

            {/* Flash Sale Section */}
            <View style={styles.flashSaleContainer}>
              <View style={styles.flashSaleHeader}>
                <View style={styles.flashSaleTitleRow}>
                  <Ionicons name="flash" size={18} color="#ffffff" style={{marginRight: 4}} />
                  <Text style={styles.flashSaleTitle}>FLASH SALE GIA TỐT</Text>
                </View>
                <View style={styles.countdownTimer}>
                  <View style={styles.timerBox}>
                    <Text style={styles.timerText}>{formatNumber(timeLeft.hours)}</Text>
                  </View>
                  <Text style={styles.timerSeparator}>:</Text>
                  <View style={styles.timerBox}>
                    <Text style={styles.timerText}>{formatNumber(timeLeft.minutes)}</Text>
                  </View>
                  <Text style={styles.timerSeparator}>:</Text>
                  <View style={styles.timerBox}>
                    <Text style={styles.timerText}>{formatNumber(timeLeft.seconds)}</Text>
                  </View>
                </View>
              </View>

              {loading ? (
                <ActivityIndicator size="large" color="#ffffff" style={{ marginVertical: 20 }} />
              ) : (
                <View style={styles.productsGrid}>
                  {flashSaleDisplay.map((product) => (
                    <ProductCard
                      key={`flash-${product.id}`}
                      id={product.id}
                      title={product.title}
                      subtitle={product.description || product.subtitle}
                      price={`${Number(product.price).toLocaleString('vi-VN')} ₫`}
                      rawPrice={product.price}
                      rating={product.rating}
                      isSale={true}
                      imageUrl={product.images && product.images.length > 0 ? product.images[0].imageUrl : null}
                      productVariants={product.productVariants}
                      isFlashSale={true}
                      quantitySold={product.quantitySold}
                    />
                  ))}
                </View>
              )}
            </View>

            {/* Featured Phones Section */}
            <View style={styles.featuredContainer}>
              <View style={[styles.sectionHeader, { borderBottomWidth: 1, borderBottomColor: 'rgba(226, 232, 240, 0.8)', paddingBottom: 6, marginBottom: 12 }]}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="star" size={20} color="#eab308" style={{ marginRight: 6 }} />
                  <Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/search')}>
                  <Text style={styles.viewAllText}>Xem tất cả</Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <ActivityIndicator size="large" color="#d70018" />
              ) : (
                <View style={styles.productsGrid}>
                  {featuredDisplay.map((product) => (
                    <ProductCard
                      key={`featured-${product.id}`}
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
              )}
            </View>

            {/* Trending Section */}
            <View style={styles.trendingContainer}>
              <View style={[styles.sectionHeader, { borderBottomWidth: 1, borderBottomColor: 'rgba(226, 232, 240, 0.8)', paddingBottom: 6, marginBottom: 12 }]}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="flame" size={20} color="#f97316" style={{ marginRight: 6 }} />
                  <Text style={styles.sectionTitle}>Sản phẩm thịnh hành</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/search')}>
                  <Text style={styles.viewAllText}>Xem tất cả</Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <ActivityIndicator size="large" color="#d70018" />
              ) : (
                <View style={styles.productsGrid}>
                  {trendingDisplay.map((product) => (
                    <ProductCard
                      key={`trending-${product.id}`}
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
              )}
            </View>
          </>
        ) : (
          /* Filtered Brand Product Grid */
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionIndicator} />
                <Text style={styles.sectionTitle}>{activeCategory}</Text>
              </View>
              <Text style={styles.itemCount}>{filteredList.length} sản phẩm</Text>
            </View>

             {/* Bộ lọc và Sắp xếp CellphoneS style */}
             <View style={styles.filterSection}>
               {/* Header của Bộ lọc với nút Xóa tất cả */}
               <View style={styles.filterHeaderRow}>
                 <View style={styles.filterHeaderTitleRow}>
                   <Ionicons name="funnel-outline" size={15} color="#d70018" style={{ marginRight: 6 }} />
                   <Text style={styles.filterHeaderTitle}>Bộ lọc sản phẩm</Text>
                 </View>
                 {(selectedCapacity !== 'Tất cả' || selectedColor !== 'Tất cả' || selectedPriceRange !== 'Tất cả' || sortBy !== 'Phổ biến') && (
                   <TouchableOpacity style={styles.clearAllBtn} onPress={handleClearAllFilters}>
                     <Ionicons name="trash-outline" size={13} color="#d70018" style={{ marginRight: 4 }} />
                     <Text style={styles.clearAllText}>Xóa tất cả</Text>
                   </TouchableOpacity>
                 )}
               </View>

               {/* Sắp xếp */}
               <View style={styles.filterGroup}>
                 <Text style={styles.filterLabel}>Sắp xếp theo:</Text>
                 <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
                   {['Phổ biến', 'Bán chạy', 'Giá thấp - cao', 'Giá cao - thấp'].map((option) => (
                     <TouchableOpacity
                       key={option}
                       style={[styles.filterChip, sortBy === option && styles.activeFilterChip]}
                       onPress={() => setSortBy(sortBy === option ? 'Phổ biến' : option)}
                     >
                       <Text style={[styles.filterChipText, sortBy === option && styles.activeFilterChipText]}>
                         {option}
                       </Text>
                     </TouchableOpacity>
                   ))}
                 </ScrollView>
               </View>

               {/* Dung lượng trích xuất động */}
               {dynamicCapacities.length > 0 && (
                 <View style={styles.filterGroup}>
                   <Text style={styles.filterLabel}>Dung lượng:</Text>
                   <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
                     <TouchableOpacity
                       style={[styles.filterChip, selectedCapacity === 'Tất cả' && styles.activeFilterChip]}
                       onPress={() => setSelectedCapacity('Tất cả')}
                     >
                       <Text style={[styles.filterChipText, selectedCapacity === 'Tất cả' && styles.activeFilterChipText]}>
                         Tất cả
                       </Text>
                     </TouchableOpacity>
                     {dynamicCapacities.map((cap) => (
                       <TouchableOpacity
                         key={cap}
                         style={[styles.filterChip, selectedCapacity === cap && styles.activeFilterChip]}
                         onPress={() => setSelectedCapacity(selectedCapacity === cap ? 'Tất cả' : cap)}
                       >
                         <Text style={[styles.filterChipText, selectedCapacity === cap && styles.activeFilterChipText]}>
                           {cap}
                         </Text>
                       </TouchableOpacity>
                     ))}
                   </ScrollView>
                 </View>
               )}

               {/* Màu sắc trích xuất động */}
               {dynamicColors.length > 0 && (
                 <View style={styles.filterGroup}>
                   <Text style={styles.filterLabel}>Màu sắc:</Text>
                   <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
                     <TouchableOpacity
                       style={[styles.filterChip, selectedColor === 'Tất cả' && styles.activeFilterChip]}
                       onPress={() => setSelectedColor('Tất cả')}
                     >
                       <Text style={[styles.filterChipText, selectedColor === 'Tất cả' && styles.activeFilterChipText]}>
                         Tất cả
                       </Text>
                     </TouchableOpacity>
                     {dynamicColors.map((col) => (
                       <TouchableOpacity
                         key={col}
                         style={[styles.filterChip, selectedColor === col && styles.activeFilterChip]}
                         onPress={() => setSelectedColor(selectedColor === col ? 'Tất cả' : col)}
                       >
                         <Text style={[styles.filterChipText, selectedColor === col && styles.activeFilterChipText]}>
                           {col}
                         </Text>
                       </TouchableOpacity>
                     ))}
                   </ScrollView>
                 </View>
               )}

               {/* Giá bán */}
               <View style={styles.filterGroup}>
                 <Text style={styles.filterLabel}>Giá bán:</Text>
                 <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
                   {['Tất cả', 'Dưới 10 triệu', '10 - 15 triệu', '15 - 20 triệu', 'Trên 20 triệu'].map((range) => (
                     <TouchableOpacity
                       key={range}
                       style={[styles.filterChip, selectedPriceRange === range && styles.activeFilterChip]}
                       onPress={() => setSelectedPriceRange(selectedPriceRange === range ? 'Tất cả' : range)}
                     >
                       <Text style={[styles.filterChipText, selectedPriceRange === range && styles.activeFilterChipText]}>
                         {range}
                       </Text>
                     </TouchableOpacity>
                   ))}
                 </ScrollView>
               </View>
             </View>

            {loading ? (
              <ActivityIndicator size="large" color="#d70018" />
            ) : filteredList.length > 0 ? (
              <View style={styles.productsGrid}>
                {filteredList.map((product) => (
                  <ProductCard
                    key={`filtered-${product.id}`}
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
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name={getCategoryIcon(activeCategory)} size={48} color="#94a3b8" />
                <Text style={styles.emptyText}>Chưa có sản phẩm nào cho danh mục này</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav activeTab="home" />
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerMenuBtn: {
    padding: 2,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  cartBtn: {
    position: 'relative',
    padding: 2,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
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
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 90,
  },
  categoriesScroll: {
    marginBottom: 14,
    flexDirection: 'row',
  },
  heroBanner: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  newArrivalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(215, 0, 24, 0.85)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 10,
  },
  newArrivalText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#cbd5e1',
    fontSize: 12,
    marginBottom: 14,
    lineHeight: 18,
  },
  shopNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  shopNowText: {
    color: '#d70018',
    fontSize: 12,
    fontWeight: '800',
  },
  flashSaleContainer: {
    backgroundColor: '#d70018',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  flashSaleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  flashSaleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flashSaleTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  countdownTimer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerBox: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    width: 22,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    color: '#d70018',
    fontSize: 11,
    fontWeight: '900',
  },
  timerSeparator: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 12,
    marginHorizontal: 3,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  featuredContainer: {
    backgroundColor: '#fff5f5', // soft red background to pop white cards
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    borderTopWidth: 4,
    borderTopColor: '#d70018',
    shadowColor: '#d70018',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ffe4e6',
  },
  trendingContainer: {
    backgroundColor: '#eff6ff', // soft blue background to pop white cards
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    borderTopWidth: 4,
    borderTopColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIndicator: {
    width: 4,
    height: 16,
    backgroundColor: '#d70018',
    borderRadius: 2,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#d70018',
  },
  itemCount: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  filterSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffe4e6', // Viền đỏ/hồng nhạt
    borderLeftWidth: 4,
    borderLeftColor: '#d70018', // Điểm nhấn cạnh trái đỏ CellphoneS
    shadowColor: '#d70018',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  filterHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
    marginBottom: 12,
  },
  filterHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#d70018',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffe4e6',
  },
  clearAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#d70018',
  },
  filterGroup: {
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  filterChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  filterChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#d70018',
    borderColor: '#d70018',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  activeFilterChipText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
