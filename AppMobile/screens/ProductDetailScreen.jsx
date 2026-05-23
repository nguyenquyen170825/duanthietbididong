import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_BASE_URL, fixImageUrl } from '../config/apiConfig';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

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

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { cartCount, addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedCapacity, setSelectedCapacity] = useState(null);

  // States mới cho thông số mở rộng & Hỏi đáp
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [qaMessage, setQaMessage] = useState('');
  const [questions, setQuestions] = useState([
    {
      id: 1,
      user: 'Nguyễn Văn Nam',
      question: 'Sản phẩm này có được bảo hành chính hãng tại Việt Nam không?',
      answer: 'Chào bạn, sản phẩm được bảo hành 12 tháng chính hãng tại các trung tâm bảo hành ủy quyền của hãng tại Việt Nam bạn nhé.',
      date: '2 ngày trước'
    },
    {
      id: 2,
      user: 'Trần Thị Thuỷ',
      question: 'Máy có kèm theo củ sạc trong hộp không ạ?',
      answer: 'Chào bạn, hộp sản phẩm chỉ bao gồm cáp sạc USB-C, không đi kèm củ sạc nhằm mục đích bảo vệ môi trường theo chính sách của hãng ạ.',
      date: '1 tuần trước'
    }
  ]);

  const handleSendQuestion = () => {
    if (!newQuestion.trim() || newQuestion.trim().length < 10) {
      Alert.alert('Thông báo', 'Vui lòng nhập câu hỏi dài hơn 10 ký tự nhé!');
      return;
    }
    const newId = questions.length + 1;
    const newQObj = {
      id: newId,
      user: 'Khách hàng',
      question: newQuestion,
      answer: 'Chào bạn, cảm ơn bạn đã gửi câu hỏi. Chúng tôi đã nhận được câu hỏi của bạn và sẽ phản hồi trong vòng 5-10 phút nữa nhé.',
      date: 'Vừa xong'
    };
    setQuestions([newQObj, ...questions]);
    setNewQuestion('');
    setQaMessage('Gửi câu hỏi thành công! Đang chờ duyệt.');
    setTimeout(() => {
      setQaMessage('');
    }, 4000);
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/public/products/${id}`);
        setProduct(response.data);
        if (response.data?.productVariants?.length > 0) {
            setSelectedColor(response.data.productVariants[0].color);
            setSelectedCapacity(response.data.productVariants[0].capacity);
        }
      } catch (error) {
        console.error('Error fetching detail', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/public/products`);
        if (response.data && response.data.length > 0) {
          setAllProducts(response.data);
        } else {
          setAllProducts(fallbackProducts);
        }
      } catch (error) {
        console.error('Error fetching all products for related:', error);
        setAllProducts(fallbackProducts);
      }
    };
    fetchAllProducts();
  }, []);

  const getColorCode = (colorName) => {
    const map = {
        'Đen': '#0f172a', 'Trắng': '#f8fafc', 'Xanh': '#1e3a8a', 'Lá': '#14532d',
        'Đỏ': '#991b1b', 'Vàng': '#ca8a04', 'Bạc': '#cbd5e1', 'Hồng': '#fbcfe8',
        'Tím': '#581c87', 'Xám': '#475569', 'Titan': '#a3a3a3'
    };
    if (!colorName) return '#000';
    for (let key in map) {
       if (colorName.toLowerCase().includes(key.toLowerCase())) return map[key];
    }
    return '#94a3b8'; 
  };

  const getSpecIcon = (name) => {
    if (!name) return 'settings-outline';
    const lower = name.toLowerCase();
    if (lower.includes('camera') || lower.includes('máy ảnh')) return 'camera';
    if (lower.includes('pin') || lower.includes('battery')) return 'battery-charging';
    if (lower.includes('màn hình') || lower.includes('screen')) return 'phone-portrait';
    if (lower.includes('chip') || lower.includes('cpu')) return 'hardware-chip';
    if (lower.includes('ram')) return 'server';
    return 'settings-outline';
  };

  // Lấy TẤT CẢ các màu và dung lượng độc nhất có trong các biến thể sản phẩm
  const uniqueColors = product?.productVariants 
    ? [...new Set(product.productVariants.map(v => v.color).filter(Boolean))] 
    : [];

  const uniqueCapacities = product?.productVariants 
    ? [...new Set(product.productVariants.map(v => v.capacity).filter(Boolean))] 
    : [];

  // Logic lọc chéo:
  // 1. Màu sắc khả dụng dựa trên dung lượng đang chọn
  const isColorAvailable = (color) => {
    if (!selectedCapacity) return true;
    return product?.productVariants?.some(v => v.color === color && v.capacity === selectedCapacity);
  };

  // 2. Dung lượng khả dụng dựa trên màu sắc đang chọn
  const isCapacityAvailable = (capacity) => {
    if (!selectedColor) return true;
    return product?.productVariants?.some(v => v.color === selectedColor && v.capacity === capacity);
  };

  const getSimilarProducts = () => {
    if (!product) return [];
    const currentCatName = product.category?.name || '';
    const currentCatId = product.category?.id;
    
    let filtered = allProducts.filter(p => {
      if (p.id === product.id) return false;
      if (currentCatId && p.category?.id === currentCatId) return true;
      if (currentCatName && p.category?.name?.toLowerCase() === currentCatName.toLowerCase()) return true;
      return false;
    });
    
    if (filtered.length === 0) {
      filtered = allProducts.filter(p => p.id !== product.id && p.brand?.toLowerCase() === product.brand?.toLowerCase());
    }
    
    return filtered.slice(0, 6);
  };

  const getSuggestedAccessories = () => {
    if (!product) return [];
    let accessoriesList = allProducts.filter(p => {
      if (p.id === product.id) return false;
      const catName = p.category?.name?.toLowerCase() || '';
      return catName.includes('airpods') || catName.includes('watch') || catName.includes('tai nghe') || catName.includes('phụ kiện') || p.title?.toLowerCase().includes('sạc') || p.title?.toLowerCase().includes('ốp lưng');
    });
    
    if (accessoriesList.length === 0) {
      accessoriesList = allProducts.filter(p => p.id !== product.id && p.category?.id !== product.category?.id);
    }
    
    return accessoriesList.slice(0, 6);
  };

  const similarProducts = getSimilarProducts();
  const accessories = getSuggestedAccessories();

  const currentVariant = product?.productVariants?.find(v => v.color === selectedColor && v.capacity === selectedCapacity);
  const displayPrice = currentVariant && currentVariant.price ? currentVariant.price : product?.price;

  if (loading || !product) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#d70018" />
      </SafeAreaView>
    );
  }

  const rawImageUrl = currentVariant && currentVariant.imageUrl ? currentVariant.imageUrl : (product.images && product.images.length > 0 ? product.images[0].imageUrl : null);
  const imageUrl = fixImageUrl(rawImageUrl);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Red CellphoneS-style Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            if (router.canGoBack && router.canGoBack()) {
              router.back();
            } else {
              router.push('/');
            }
          }} 
          style={styles.headerIcon}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <Text style={styles.brandText}>Chi tiết sản phẩm</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="share-social-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerIcon, { marginLeft: 12 }]} onPress={() => router.push('/cart')}>
            <Ionicons name="cart" size={24} color="#ffffff" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Image Showcase */}
        <View style={styles.imageShowcase}>
          <View style={styles.mainImagePlaceholder}>
            {imageUrl ? (
               <Image source={{ uri: imageUrl }} style={{ width: '90%', height: '90%' }} resizeMode="contain" />
            ) : (
               <View style={styles.mockPhone}>
                 <View style={styles.mockCamera} />
               </View>
            )}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoWrapper}>
          <View style={styles.metaRow}>
            {(product.isSale || (currentVariant && currentVariant.discount > 0)) && (
              <View style={styles.newReleaseBadge}>
                <Text style={styles.newReleaseText}>GIẢM GIÁ</Text>
              </View>
            )}
            <Text style={styles.ratingText}>★ {product.rating || '5.0'}</Text>
          </View>

          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productPrice}>{Number(displayPrice).toLocaleString('vi-VN')} ₫</Text>

          {/* Colors */}
          {uniqueColors.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>MÀU SẮC: {selectedColor ? selectedColor.toUpperCase() : 'CHƯA CHỌN'}</Text>
              <View style={styles.colorSelector}>
                {uniqueColors.map(color => {
                  const isAvailable = isColorAvailable(color);
                  const isSelected = selectedColor === color;
                  return (
                    <TouchableOpacity 
                      key={color}
                      disabled={!isAvailable}
                      style={[
                        styles.colorRingActive, 
                        { 
                          borderColor: isSelected ? '#d70018' : 'transparent', 
                          marginRight: 12,
                          opacity: isAvailable ? 1 : 0.3
                        }
                      ]}
                      onPress={() => setSelectedColor(isSelected ? null : color)}
                    >
                      <View style={[styles.colorDot, { backgroundColor: getColorCode(color) }]} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {/* Storage */}
          {uniqueCapacities.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>DUNG LƯỢNG: {selectedCapacity ? selectedCapacity.toUpperCase() : 'CHƯA CHỌN'}</Text>
              <View style={styles.storageSelector}>
                {uniqueCapacities.map(cap => {
                  const isAvailable = isCapacityAvailable(cap);
                  const isSelected = selectedCapacity === cap;
                  return (
                    <TouchableOpacity 
                      key={cap}
                      disabled={!isAvailable}
                      style={[
                        styles.storageBtn, 
                        isSelected && styles.storageBtnActive,
                        !isAvailable && { opacity: 0.3 }
                      ]}
                      onPress={() => setSelectedCapacity(isSelected ? null : cap)}
                    >
                      <Text style={[
                        styles.storageText, 
                        isSelected && styles.storageTextActive
                      ]}>{cap}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {/* Variant Info Card */}
          {currentVariant ? (
            <View style={styles.variantCard}>
              <View style={styles.variantHeader}>
                <Ionicons name="information-circle-outline" size={18} color="#d70018" style={{ marginRight: 6 }} />
                <Text style={styles.variantTitle}>CHI TIẾT PHIÊN BẢN CHỌN</Text>
              </View>
              <View style={styles.variantDetailRow}>
                <Text style={styles.variantLabel}>Mã SKU:</Text>
                <Text style={styles.variantValue}>{currentVariant.sku || 'N/A'}</Text>
              </View>
              <View style={styles.variantDetailRow}>
                <Text style={styles.variantLabel}>RAM:</Text>
                <Text style={styles.variantValue}>{currentVariant.ram || 'N/A'}</Text>
              </View>
              <View style={styles.variantDetailRow}>
                <Text style={styles.variantLabel}>Màu sắc:</Text>
                <Text style={styles.variantValue}>{currentVariant.color || 'N/A'}</Text>
              </View>
              <View style={styles.variantDetailRow}>
                <Text style={styles.variantLabel}>Dung lượng:</Text>
                <Text style={styles.variantValue}>{currentVariant.capacity || 'N/A'}</Text>
              </View>
              <View style={styles.variantDetailRow}>
                <Text style={styles.variantLabel}>Tồn kho:</Text>
                <Text style={[
                  styles.variantValue, 
                  currentVariant.stockQuantity > 0 ? { color: '#16a34a' } : { color: '#dc2626' }
                ]}>
                  {currentVariant.stockQuantity > 0 ? `Còn hàng (${currentVariant.stockQuantity} sản phẩm)` : 'Hết hàng'}
                </Text>
              </View>
              {(currentVariant.oldPrice && currentVariant.oldPrice > currentVariant.price) ? (
                <View style={styles.variantDetailRow}>
                  <Text style={styles.variantLabel}>Tiết kiệm:</Text>
                  <Text style={[styles.variantValue, { color: '#d70018', fontWeight: '800' }]}>
                    {Number(currentVariant.oldPrice - currentVariant.price).toLocaleString('vi-VN')} ₫
                  </Text>
                </View>
              ) : null}

              {/* Đặc điểm nổi bật của phiên bản chọn */}
              <View style={styles.variantHighlights}>
                <Text style={styles.highlightsTitle}>Đặc điểm nổi bật:</Text>
                {product.subtitle ? (
                  <Text style={[styles.highlightText, { fontWeight: '800', fontSize: 13, color: '#1e293b', marginBottom: 6 }]}>
                    {product.subtitle}
                  </Text>
                ) : null}
                {product.description ? (
                  <Text style={[styles.highlightText, { fontWeight: '500', fontSize: 12, color: '#475569', lineHeight: 18 }]}>
                    {product.description}
                  </Text>
                ) : null}
              </View>
            </View>
          ) : (
            <View style={[styles.variantCard, { borderColor: '#e2e8f0', backgroundColor: '#f1f5f9' }]}>
              <Text style={[styles.variantTitle, { color: '#64748b', textAlign: 'center' }]}>
                Vui lòng chọn màu sắc và dung lượng phù hợp
              </Text>
            </View>
          )}

          {/* Specs */}
          {product.technicalSpecifications && product.technicalSpecifications.length > 0 && (
            <View style={styles.specsRow}>
              {product.technicalSpecifications.slice(0, 3).map((spec, index) => (
                <View key={index} style={styles.specCard}>
                  <Ionicons name={getSpecIcon(spec.specificationName || spec.specName)} size={24} color="#d70018" />
                  <Text style={styles.specLabel} numberOfLines={1}>{(spec.specificationName || spec.specName)?.toUpperCase()}</Text>
                  <Text style={styles.specValue} numberOfLines={2}>{spec.specificationValue || spec.specValue}</Text>
                </View>
              ))}
            </View>
          )}



          {/* Detailed Specifications Accordion */}
          {product.technicalSpecifications && product.technicalSpecifications.length > 0 && (
            <View style={styles.fullSpecsContainer}>
              <Text style={styles.sectionTitle}>Thông số kỹ thuật chi tiết</Text>
              <View style={[styles.specsTable, !showAllSpecs && { maxHeight: 180, overflow: 'hidden' }]}>
                {product.technicalSpecifications.map((spec, index) => {
                  const sName = spec.specName || spec.specificationName || 'N/A';
                  const sVal = spec.specValue || spec.specificationValue || 'N/A';
                  
                  // Translate core system keys to user-friendly Vietnamese labels
                  const displayLabel = {
                    'geekbench_single': 'Geekbench 6 (Đơn nhân)',
                    'geekbench_multi': 'Geekbench 6 (Đa nhân)',
                    'battery_hours': 'Thời lượng pin (Lướt web liên tục)',
                    'peak_brightness': 'Độ sáng màn hình tối đa'
                  }[sName] || sName;

                  return (
                    <View key={index} style={[styles.specsTableRow, index % 2 === 1 && { backgroundColor: '#f8fafc' }]}>
                      <Text style={styles.specsTableLabel}>{displayLabel}</Text>
                      <Text style={styles.specsTableValue}>{sVal}</Text>
                    </View>
                  );
                })}
                
                {/* Fade overlay when collapsed */}
                {!showAllSpecs && (
                  <View style={styles.specsFadeOverlay} />
                )}
              </View>
              
              <TouchableOpacity 
                style={styles.specsToggleBtn} 
                onPress={() => setShowAllSpecs(!showAllSpecs)}
              >
                <Text style={styles.specsToggleBtnText}>
                  {showAllSpecs ? 'Thu gọn cấu hình' : 'Xem cấu hình chi tiết'}
                </Text>
                <Ionicons 
                  name={showAllSpecs ? 'chevron-up' : 'chevron-down'} 
                  size={14} 
                  color="#d70018" 
                  style={{ marginLeft: 6 }} 
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Sản phẩm tương tự */}
          {similarProducts.length > 0 && (
            <View style={[styles.relatedSection, styles.similarProductsContainer]}>
              <View style={styles.similarHeaderRow}>
                <Ionicons name="sparkles" size={18} color="#d70018" style={{ marginRight: 6 }} />
                <Text style={[styles.sectionTitle, { marginBottom: 0, color: '#d70018', fontWeight: '900' }]}>Sản phẩm tương tự</Text>
                <View style={styles.hotBadge}>
                  <Text style={styles.hotBadgeText}>GỢI Ý</Text>
                </View>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollContent}
              >
                {similarProducts.map((p) => (
                  <ProductCard
                    key={`similar-${p.id}`}
                    id={p.id}
                    title={p.title}
                    subtitle={p.description || p.subtitle}
                    price={`${Number(p.price).toLocaleString('vi-VN')} ₫`}
                    rawPrice={p.price}
                    rating={p.rating}
                    isSale={p.isSale}
                    imageUrl={p.images && p.images.length > 0 ? p.images[0].imageUrl : null}
                    style={styles.horizontalCard}
                    productVariants={p.productVariants}
                    quantitySold={p.quantitySold}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Phụ kiện gợi ý đi kèm */}
          {accessories.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.sectionTitle}>Phụ kiện gợi ý đi kèm</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollContent}
              >
                {accessories.map((p) => (
                  <ProductCard
                    key={`accessory-${p.id}`}
                    id={p.id}
                    title={p.title}
                    subtitle={p.description || p.subtitle}
                    price={`${Number(p.price).toLocaleString('vi-VN')} ₫`}
                    rawPrice={p.price}
                    rating={p.rating}
                    isSale={p.isSale}
                    imageUrl={p.images && p.images.length > 0 ? p.images[0].imageUrl : null}
                    style={styles.horizontalCard}
                    productVariants={p.productVariants}
                    quantitySold={p.quantitySold}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Reviews */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Đánh giá</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllBtn}>Xem tất cả 2.4k</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.reviewCard}>
            <View style={styles.reviewMeta}>
              <Text style={styles.reviewerName}>Alex Thompson</Text>
              <Text style={styles.reviewStars}>★★★★★</Text>
            </View>
            <Text style={styles.reviewText}>
              "Chất lượng máy ảnh thực sự tuyệt vời. Nâng cấp từ Pro 13 mang lại sự khác biệt lớn khi chụp đêm."
            </Text>
          </View>

          {/* Q&A Section */}
          <View style={styles.qaContainer}>
            <Text style={styles.sectionTitle}>Hỏi đáp về sản phẩm</Text>
            
            {/* Input field to ask new question */}
            <View style={styles.qaForm}>
              <View style={styles.qaInputWrapper}>
                <Ionicons name="chatbox-ellipses-outline" size={20} color="#94a3b8" style={{ marginRight: 8 }} />
                <TextInput 
                  placeholder="Nhập câu hỏi của bạn (tối thiểu 10 ký tự)..."
                  placeholderTextColor="#94a3b8"
                  style={styles.qaInput}
                  value={newQuestion}
                  onChangeText={setNewQuestion}
                  multiline={true}
                />
              </View>
              {qaMessage ? (
                <Text style={styles.qaSuccessText}>{qaMessage}</Text>
              ) : null}
              <TouchableOpacity style={styles.qaSubmitBtn} onPress={handleSendQuestion}>
                <Ionicons name="paper-plane-outline" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.qaSubmitBtnText}>Gửi câu hỏi</Text>
              </TouchableOpacity>
            </View>

            {/* List of Q&As */}
            <View style={styles.qaList}>
              {questions.map((item) => (
                <View key={item.id} style={styles.qaItem}>
                  <View style={styles.questionRow}>
                    <View style={styles.qaBadgeQ}>
                      <Text style={styles.qaBadgeText}>Q</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.questionText}>{item.question}</Text>
                      <Text style={styles.qaMetaText}>{item.user} • {item.date}</Text>
                    </View>
                  </View>
                  {item.answer ? (
                    <View style={styles.answerRow}>
                      <View style={styles.qaBadgeA}>
                        <Text style={styles.qaBadgeText}>A</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.answerText}>{item.answer}</Text>
                        <Text style={styles.qaMetaText}>Quản trị viên PhoneHub • Vừa xong</Text>
                      </View>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
          
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.bottomActionBar}>
        <TouchableOpacity 
          style={styles.compareBtn} 
          onPress={() => router.push({
            pathname: '/compare',
            params: { p1: product.id }
          })}
        >
          <Ionicons name="swap-horizontal" size={18} color="#2563eb" style={{ marginRight: 4 }} />
          <Text style={styles.compareBtnText}>So sánh</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.addToCartBtn} 
          onPress={() => {
            if (!isLoggedIn) {
              router.push('/login');
              return;
            }
            if (product.productVariants && product.productVariants.length > 0 && (!selectedColor || !selectedCapacity)) {
              Alert.alert('Thông báo', 'Vui lòng chọn đầy đủ Màu sắc và Dung lượng sản phẩm nhé!');
              return;
            }
            addToCart({ 
                id: product.id, 
                variantId: currentVariant?.id,
                title: product.title, 
                subtitle: currentVariant ? `${currentVariant.color} - ${currentVariant.capacity}` : product.subtitle, 
                price: displayPrice, 
                imageUrl, 
                rawPrice: displayPrice 
            });
            showToast({ message: `Đã thêm vào giỏ hàng: ${product.title?.substring(0, 30)}...`, type: 'cart', duration: 2500 });
          }}
        >
          <Ionicons name="cart-outline" size={18} color="#d70018" style={{ marginRight: 4 }} />
          <Text style={styles.addToCartText}>Thêm giỏ</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.buyNowBtn} 
          onPress={() => {
            if (!isLoggedIn) {
              router.push('/login');
              return;
            }
            if (product.productVariants && product.productVariants.length > 0 && (!selectedColor || !selectedCapacity)) {
              Alert.alert('Thông báo', 'Vui lòng chọn đầy đủ Màu sắc và Dung lượng sản phẩm nhé!');
              return;
            }
            addToCart({ 
                id: product.id, 
                variantId: currentVariant?.id,
                title: product.title, 
                subtitle: currentVariant ? `${currentVariant.color} - ${currentVariant.capacity}` : product.subtitle, 
                price: displayPrice, 
                imageUrl, 
                rawPrice: displayPrice 
            });
            router.push('/checkout');
          }}
        >
          <Text style={styles.buyNowText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  brandText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerIcon: {
    padding: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
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
  scrollContent: {
    paddingBottom: 120,
  },
  imageShowcase: {
    alignItems: 'center',
    marginTop: 16,
  },
  mainImagePlaceholder: {
    width: '85%',
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  mockPhone: {
    width: 120,
    height: 250,
    backgroundColor: '#111827',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#374151',
    alignItems: 'center',
  },
  mockCamera: {
    width: 32,
    height: 48,
    backgroundColor: '#000',
    borderRadius: 8,
    marginTop: 16,
    marginLeft: -48,
  },
  infoWrapper: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  newReleaseBadge: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#f87171',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  newReleaseText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#d70018',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ca8a04',
  },
  productTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e293b',
    lineHeight: 30,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#d70018',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 12,
  },
  colorSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  colorRingActive: {
    borderWidth: 2,
    borderRadius: 4,
    padding: 2,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  storageSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  storageBtn: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  storageBtnActive: {
    backgroundColor: '#d70018',
    borderColor: '#d70018',
    borderWidth: 1,
  },
  storageText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  storageTextActive: {
    color: '#ffffff',
  },
  specsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  specCard: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  specLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748b',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  specValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 24,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllBtn: {
    fontSize: 12,
    fontWeight: '700',
    color: '#d70018',
  },
  reviewCard: {
    marginBottom: 32,
  },
  reviewMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  reviewStars: {
    color: '#fbbf24',
    fontSize: 12,
  },
  reviewText: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  compareBtn: {
    flex: 0.8,
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  compareBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563eb',
  },
  addToCartBtn: {
    flex: 1.2,
    flexDirection: 'row',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#f87171',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  addToCartText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#d70018',
  },
  buyNowBtn: {
    flex: 1.2,
    backgroundColor: '#d70018',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  buyNowText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  variantCard: {
    backgroundColor: '#fff5f5',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#fca5a5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  variantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#fee2e2',
    paddingBottom: 8,
  },
  variantTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#d70018',
    letterSpacing: 0.5,
  },
  variantDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#fee2e2',
  },
  variantHighlights: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#fee2e2',
  },
  highlightsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#d70018',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  variantLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginRight: 6,
  },
  variantValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e293b',
  },
  relatedSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  similarProductsContainer: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    shadowColor: '#d70018',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  similarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  hotBadge: {
    backgroundColor: '#d70018',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  hotBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  horizontalScrollContent: {
    paddingRight: 16,
    paddingVertical: 8,
  },
  horizontalCard: {
    width: 150,
    marginRight: 12,
    marginBottom: 0,
  },
  fullSpecsContainer: {
    marginBottom: 24,
  },
  specsTable: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  specsTableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  specsTableLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  specsTableValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    color: '#1e293b',
  },
  specsFadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  specsToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: '#fef2f2',
  },
  specsToggleBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#d70018',
  },
  qaContainer: {
    marginBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 24,
  },
  qaForm: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  qaInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    marginBottom: 12,
  },
  qaInput: {
    flex: 1,
    fontSize: 13,
    color: '#1e293b',
    fontWeight: '600',
    textAlignVertical: 'top',
    padding: 0,
  },
  qaSubmitBtn: {
    flexDirection: 'row',
    backgroundColor: '#d70018',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qaSubmitBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  qaSuccessText: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  qaList: {
    marginTop: 10,
  },
  qaItem: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
  },
  qaBadgeQ: {
    backgroundColor: '#d70018',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  qaBadgeA: {
    backgroundColor: '#16a34a',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  qaBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  questionText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
    lineHeight: 18,
  },
  answerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
    lineHeight: 18,
  },
  qaMetaText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
});

