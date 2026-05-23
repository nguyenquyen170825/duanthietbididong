import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNav from '../components/BottomNav';
import SearchResultCard from '../components/SearchResultCard';
import { useCart } from '../context/CartContext';

const FilterPill = ({ title, isActive, hasDropdown }) => (
  <TouchableOpacity style={[styles.filterPill, isActive && styles.filterPillActive]}>
    <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>{title}</Text>
    {hasDropdown && (
      <Ionicons
        name="chevron-down"
        size={14}
        color={isActive ? '#d70018' : '#6b7280'}
        style={{ marginLeft: 4 }}
      />
    )}
  </TouchableOpacity>
);

const RecentSearchPill = ({ title, onPress }) => (
  <TouchableOpacity style={styles.recentPill} onPress={onPress}>
    <Ionicons name="time-outline" size={14} color="#4b5563" />
    <Text style={styles.recentPillText}>{title}</Text>
  </TouchableOpacity>
);

export default function SearchScreen() {
  const router = useRouter();
  const { cartCount } = useCart();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(["Galaxy S24 Ultra", "iPhone 15 Pro", "AirPods Pro 2"]);

  const handleSearch = async (text) => {
    setKeyword(text);
    if (!text || text.trim().length === 0) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/public/products/search?keyword=${text}`);
      setResults(response.data);
    } catch (error) {
      console.error('Search error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecent = (term) => {
    handleSearch(term);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Red CellphoneS-style Header for Search */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.brandText}>Tìm kiếm sản phẩm</Text>
          <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/cart')}>
            <Ionicons name="cart" size={24} color="#ffffff" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Integrated Search Bar inside Red Header */}
        <View style={styles.searchBarWrapper}>
          <Ionicons name="search-outline" size={18} color="#94a3b8" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Bạn cần tìm gì hôm nay?" 
            placeholderTextColor="#94a3b8"
            value={keyword}
            onChangeText={handleSearch}
            autoFocus={true}
          />
          {keyword.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <FilterPill title="Thương hiệu" isActive={true} hasDropdown={true} />
          <FilterPill title="Giá bán" isActive={false} hasDropdown={true} />
          <FilterPill title="Hệ điều hành" isActive={false} hasDropdown={true} />
          <FilterPill title="RAM" isActive={false} hasDropdown={false} />
        </ScrollView>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
              <TouchableOpacity onPress={handleClearRecent}>
                <Text style={styles.clearAllText}>Xóa tất cả</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.recentSearchesWrapper}>
              {recentSearches.map((item, index) => (
                <RecentSearchPill 
                  key={`recent-${index}`} 
                  title={item} 
                  onPress={() => handleSelectRecent(item)} 
                />
              ))}
            </View>
          </>
        )}

        {/* Search Results */}
        <View style={[styles.sectionHeader, { marginTop: 24, marginBottom: 16 }]}>
          <Text style={styles.sectionTitle}>
            {keyword.length > 0 ? 'Kết quả tìm kiếm' : 'Gợi ý cho bạn'}
            {results.length > 0 && ` (${results.length})`}
          </Text>
        </View>

        <View style={styles.resultsWrapper}>
          {loading ? (
            <ActivityIndicator size="large" color="#d70018" style={{ marginTop: 20 }} />
          ) : results.length > 0 ? (
            results.map(product => (
              <SearchResultCard
                key={product.id}
                id={product.id}
                title={product.title}
                badgeText={product.brand}
                specs={product.description?.substring(0, 50) + '...'}
                price={`${Number(product.price).toLocaleString('vi-VN')} ₫`}
                rawPrice={product.price}
                oldPrice={product.isSale ? `${(Number(product.price) + 2500000).toLocaleString('vi-VN')} ₫` : null}
                isBlueBadge={true}
                imageUrl={product.images && product.images.length > 0 ? product.images[0].imageUrl : null}
              />
            ))
          ) : (
            keyword.length > 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#94a3b8" />
                <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào phù hợp.</Text>
              </View>
            ) : (
              <Text style={styles.infoText}>Nhập từ khóa để bắt đầu tìm kiếm sản phẩm.</Text>
            )
          )}
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav activeTab="search" />
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
  backBtn: {
    padding: 2,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
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
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '600',
    padding: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
  },
  filtersScroll: {
    marginBottom: 16,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterPillActive: {
    backgroundColor: '#fef2f2',
    borderColor: '#f87171',
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#d70018',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d70018',
  },
  recentSearchesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  recentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recentPillText: {
    fontSize: 12,
    color: '#475569',
    marginLeft: 6,
    fontWeight: '500',
  },
  resultsWrapper: {
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 12,
    fontWeight: '500',
  },
  infoText: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 24,
    fontSize: 14,
    fontStyle: 'italic',
  },
});

