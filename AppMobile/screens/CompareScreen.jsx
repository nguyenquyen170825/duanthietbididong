import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Modal, FlatList, ActivityIndicator } from 'react-native';
import { API_BASE_URL, fixImageUrl } from '../config/apiConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomNav from '../components/BottomNav';
import axios from 'axios';

export default function CompareScreen() {
  const router = useRouter();
  const { p1, p2 } = useLocalSearchParams();

  const [product1Id, setProduct1Id] = useState(p1 ? Number(p1) : 1);
  const [product2Id, setProduct2Id] = useState(p2 ? Number(p2) : (p1 && Number(p1) === 1 ? 2 : 1));
  const [product1, setProduct1] = useState(null);
  const [product2, setProduct2] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [pickingFor, setPickingFor] = useState(1);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/public/products`);
        setAllProducts(res.data);
        const data = res.data;
        if (data && data.length > 0) {
          if (!p1) {
            setProduct1Id(data[0].id);
            if (!p2 && data.length > 1) {
              setProduct2Id(data[1].id);
            }
          }
        }
      } catch (err) { console.error(err); }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (p1) {
      setProduct1Id(Number(p1));
    }
    if (p2) {
      setProduct2Id(Number(p2));
    } else if (p1) {
      const p1Id = Number(p1);
      if (allProducts && allProducts.length > 1) {
        const otherProduct = allProducts.find(p => p.id !== p1Id);
        if (otherProduct) {
          setProduct2Id(otherProduct.id);
        }
      } else {
        setProduct2Id(p1Id === 1 ? 2 : 1);
      }
    }
  }, [p1, p2, allProducts]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [res1, res2] = await Promise.all([
          axios.get(`${API_BASE_URL}/public/products/${product1Id}`),
          axios.get(`${API_BASE_URL}/public/products/${product2Id}`)
        ]);
        setProduct1(res1.data);
        setProduct2(res2.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    if (product1Id && product2Id) fetchDetails();
  }, [product1Id, product2Id]);

  const handleSwap = () => {
    const temp = product1Id;
    setProduct1Id(product2Id);
    setProduct2Id(temp);
  };

  const getSpec = (product, specKeys) => {
    if (!product || !product.technicalSpecifications) return '';
    const keys = Array.isArray(specKeys) ? specKeys : [specKeys];
    for (const key of keys) {
      const spec = product.technicalSpecifications.find(s => 
        s.specName === key || 
        s.specificationName === key ||
        s.specName?.toLowerCase() === key.toLowerCase()
      );
      if (spec) {
        return spec.specValue || spec.specificationValue || '';
      }
    }
    return '';
  };

  const parseNum = (val) => {
    if (!val) return 0;
    const match = String(val).match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  const getWinner = (val1, val2, reverse = false) => {
    const num1 = parseNum(val1);
    const num2 = parseNum(val2);
    if (num1 === 0 && num2 === 0) return 0; // Both unknown
    if (num1 > 0 && num2 === 0) return 1;
    if (num2 > 0 && num1 === 0) return 2;
    
    if (reverse) {
      if (num1 < num2) return 1;
      if (num2 < num1) return 2;
    } else {
      if (num1 > num2) return 1;
      if (num2 > num1) return 2;
    }
    return 0; // Tie
  };

  const openPicker = (slot) => {
    setPickingFor(slot);
    setModalVisible(true);
  };

  const renderProgressBar = (valueStr, total, color) => {
    const value = parseInt(valueStr) || 0;
    let percentage = (value / total) * 100;
    if (percentage > 100) percentage = 100;
    return (
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    );
  };

  if (loading || !product1 || !product2) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#d70018" />
      </SafeAreaView>
    );
  }

  const p1Single = getSpec(product1, 'geekbench_single');
  const p2Single = getSpec(product2, 'geekbench_single');
  const p1Multi = getSpec(product1, 'geekbench_multi');
  const p2Multi = getSpec(product2, 'geekbench_multi');
  const p1Battery = getSpec(product1, ['battery_hours', 'Thời gian xem video', 'Dung lượng pin']);
  const p2Battery = getSpec(product2, ['battery_hours', 'Thời gian xem video', 'Dung lượng pin']);
  const p1Bright = getSpec(product1, ['peak_brightness', 'Độ sáng tối đa']);
  const p2Bright = getSpec(product2, ['peak_brightness', 'Độ sáng tối đa']);

  const p1Weight = getSpec(product1, ['Trọng lượng', 'Weight']);
  const p2Weight = getSpec(product2, ['Trọng lượng', 'Weight']);
  
  const p1Storage = getSpec(product1, ['Bộ nhớ trong', 'Lưu trữ', 'Storage', 'ROM', 'Dung lượng']);
  const p2Storage = getSpec(product2, ['Bộ nhớ trong', 'Lưu trữ', 'Storage', 'ROM', 'Dung lượng']);

  const p1MainCam = getSpec(product1, ['Camera chính', 'Main Camera']);
  const p2MainCam = getSpec(product2, ['Camera chính', 'Main Camera']);
  const p1UltraCam = getSpec(product1, ['Camera góc siêu rộng', 'Ultrawide Camera']);
  const p2UltraCam = getSpec(product2, ['Camera góc siêu rộng', 'Ultrawide Camera']);
  const p1TeleCam = getSpec(product1, ['Camera Tele', 'Telephoto Camera']);
  const p2TeleCam = getSpec(product2, ['Camera Tele', 'Telephoto Camera']);

  const p1DisplayTech = getSpec(product1, ['Công nghệ màn hình', 'Display Technology']);
  const p2DisplayTech = getSpec(product2, ['Công nghệ màn hình', 'Display Technology']);
  const p1DisplaySize = getSpec(product1, ['Kích thước màn hình', 'Display Size']);
  const p2DisplaySize = getSpec(product2, ['Kích thước màn hình', 'Display Size']);
  const p1Resolution = getSpec(product1, ['Độ phân giải', 'Resolution']);
  const p2Resolution = getSpec(product2, ['Độ phân giải', 'Resolution']);
  const p1RefreshRate = getSpec(product1, ['Tần số quét', 'Refresh Rate']);
  const p2RefreshRate = getSpec(product2, ['Tần số quét', 'Refresh Rate']);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>So sánh thiết bị</Text>
        <TouchableOpacity style={styles.headerIcon} onPress={handleSwap}>
          <Ionicons name="swap-horizontal" size={24} color="#d70018" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Device Headers */}
        <View style={styles.deviceRow}>
          <TouchableOpacity style={styles.deviceCol} onPress={() => openPicker(1)}>
            <View style={styles.phonePlaceholder}>
               {product1.images && product1.images.length > 0 ? (
                 <Image source={{ uri: fixImageUrl(product1.images[0].imageUrl) }} style={styles.deviceImage} resizeMode="contain" />
               ) : (
                 <Ionicons name="phone-portrait-outline" size={48} color="#9ca3af" />
               )}
            </View>
            <Text style={[styles.brandBlue, {color: '#0066ff'}]}>{product1.brand || 'HÃNG'}</Text>
            <Text style={styles.deviceName} numberOfLines={1}>{product1.title}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deviceCol} onPress={() => openPicker(2)}>
             <View style={styles.phonePlaceholder}>
               {product2.images && product2.images.length > 0 ? (
                 <Image source={{ uri: fixImageUrl(product2.images[0].imageUrl) }} style={styles.deviceImage} resizeMode="contain" />
               ) : (
                 <Ionicons name="phone-portrait-outline" size={48} color="#9ca3af" />
               )}
            </View>
            <Text style={[styles.brandGreen, {color: '#16a34a'}]}>{product2.brand || 'HÃNG'}</Text>
            <Text style={styles.deviceName} numberOfLines={1}>{product2.title}</Text>
          </TouchableOpacity>
        </View>

        {/* Performance Benchmarks */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
             <Text style={styles.cardTitle}>Hiệu năng &{'\n'}Điểm số</Text>
             <View style={styles.legendWrap}>
               <View style={[styles.legendDot, { backgroundColor: '#0066ff' }]} />
               <Text style={styles.legendText}>GEEKBENCH{'\n'}6</Text>
             </View>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Điểm đơn nhân</Text>
            <Text style={styles.metricLabelEnd}>Điểm cao hơn là <Text style={{fontWeight: '800', color: '#111827'}}>tốt hơn</Text></Text>
          </View>
          
          {/* P1 Single-core */}
          <View style={styles.scoreRow}>
            <Text style={styles.scoreName}>{product1.title}</Text>
            <Text style={styles.scoreValue}>{p1Single}</Text>
          </View>
          {renderProgressBar(p1Single, 3500, '#0066ff')}

          {/* P2 Single-core */}
          <View style={styles.scoreRow}>
            <Text style={styles.scoreName}>{product2.title}</Text>
            <Text style={styles.scoreValue}>{p2Single}</Text>
          </View>
          {renderProgressBar(p2Single, 3500, '#4ade80')}

          <View style={[styles.metricRow, { marginTop: 24 }]}>
            <Text style={styles.metricLabel}>Điểm đa nhân</Text>
          </View>

           {/* P1 Multi-core */}
           <View style={styles.scoreRow}>
            <Text style={styles.scoreName}>{product1.title}</Text>
            <Text style={styles.scoreValue}>{p1Multi}</Text>
          </View>
          {renderProgressBar(p1Multi, 8500, '#0066ff')}

          {/* P2 Multi-core */}
          <View style={styles.scoreRow}>
            <Text style={styles.scoreName}>{product2.title}</Text>
            <Text style={styles.scoreValue}>{p2Multi}</Text>
          </View>
          {renderProgressBar(p2Multi, 8500, '#4ade80')}
        </View>

         {/* Battery Endurance */}
        <View style={styles.blueCard}>
           <Ionicons name="battery-half" size={24} color="#ffffff" style={{marginBottom: 12}} />
           <Text style={styles.blueCardTitle}>Thời lượng pin</Text>
           <Text style={styles.blueCardDesc}>Lướt web liên tục qua mạng 5G với độ sáng màn hình 150 nits.</Text>
           
           <View style={styles.batteryScoreRow}>
             <Text style={styles.batteryLargeText}>{p1Battery} <Text style={styles.batterySmallHr}>{p1Battery.includes('mAh') ? '' : 'Giờ lướt web'}</Text></Text>
             <Text style={styles.batteryDevice}>{product1.title.toUpperCase()}</Text>
           </View>

           <View style={styles.batteryScoreRow}>
             <Text style={styles.batteryLargeText}>{p2Battery} <Text style={styles.batterySmallHr}>{p2Battery.includes('mAh') ? '' : 'Giờ lướt web'}</Text></Text>
             <Text style={styles.batteryDevice}>{product2.title.toUpperCase()}</Text>
           </View>
        </View>

        {/* Camera Systems */}
        <View style={styles.card}>
          <View style={styles.iconTitleRow}>
            <View style={[styles.titleIconBox, { backgroundColor: '#dcfce7' }]}>
               <Ionicons name="camera" size={16} color="#16a34a" />
            </View>
            <Text style={styles.cardTitleLine}>Hệ thống Camera</Text>
          </View>

          <View style={styles.columnsRow}>
            <View style={styles.colHalf}>
               <Text style={styles.colHeader} numberOfLines={1}>{product1.title.toUpperCase()}</Text>
               <View style={styles.specBlock}>
                 <Text style={styles.specSub}>Camera chính</Text>
                 <Text style={styles.specHero}>{p1MainCam}</Text>
               </View>
               <View style={styles.specBlock}>
                 <Text style={styles.specSub}>Camera góc siêu rộng</Text>
                 <Text style={styles.specHero}>{p1UltraCam}</Text>
               </View>
               <View style={styles.specBlock}>
                 <Text style={styles.specSub}>Camera Tele</Text>
                 <Text style={styles.specHero}>{p1TeleCam}</Text>
               </View>
            </View>

            <View style={[styles.colHalf, { paddingLeft: 12, borderLeftWidth: 1, borderColor: '#e5e7eb' }]}>
               <Text style={styles.colHeader} numberOfLines={1}>{product2.title.toUpperCase()}</Text>
               <View style={styles.specBlock}>
                 <Text style={styles.specSub}>Camera chính</Text>
                 <Text style={styles.specHero}>{p2MainCam}</Text>
               </View>
               <View style={styles.specBlock}>
                 <Text style={styles.specSub}>Camera góc siêu rộng</Text>
                 <Text style={styles.specHero}>{p2UltraCam}</Text>
               </View>
               <View style={styles.specBlock}>
                 <Text style={styles.specSub}>Camera Tele</Text>
                 <Text style={styles.specHero}>{p2TeleCam}</Text>
               </View>
            </View>
          </View>
        </View>

        {/* Display Quality */}
        <View style={styles.card}>
          <View style={styles.iconTitleRow}>
            <View style={[styles.titleIconBox, { backgroundColor: '#e0e7ff' }]}>
               <Ionicons name="desktop-outline" size={16} color="#0066ff" />
            </View>
            <Text style={styles.cardTitleLine}>Chất lượng màn hình</Text>
          </View>

          <View style={styles.brightnessRow}>
             <View style={styles.brightnessBox}>
               <Text style={styles.brightnessLabel}>ĐỘ SÁNG TỐI ĐA</Text>
               <Text style={styles.brightnessValueBlue}>{p1Bright}</Text>
             </View>
             <View style={[styles.brightnessBox, { marginLeft: 8 }]}>
               <Text style={styles.brightnessLabel}>ĐỘ SÁNG TỐI ĐA</Text>
               <Text style={styles.brightnessValueGreen}>{p2Bright}</Text>
             </View>
          </View>

          <View style={styles.columnsRow}>
            <View style={styles.colHalf}>
               <Text style={styles.colHeader} numberOfLines={1}>{product1.title.toUpperCase()}</Text>
               <View style={styles.specBlock}>
                 <Text style={styles.specSub}>Công nghệ</Text>
                 <Text style={styles.specHero}>{p1DisplayTech}</Text>
               </View>
               <View style={styles.specBlock}>
                 <Text style={styles.specSub}>Kích thước</Text>
                 <Text style={styles.specHero}>{p1DisplaySize}</Text>
               </View>
               <View style={styles.specBlock}>
                 <Text style={styles.specSub}>Độ phân giải</Text>
                 <Text style={styles.specHero}>{p1Resolution}</Text>
               </View>
               <View style={styles.specBlock}>
                 <Text style={styles.specSub}>Tần số quét</Text>
                 <Text style={styles.specHero}>{p1RefreshRate}</Text>
               </View>
            </View>

            <View style={[styles.colHalf, { paddingLeft: 12, borderLeftWidth: 1, borderColor: '#e5e7eb' }]}>
               <Text style={styles.colHeader} numberOfLines={1}>{product2.title.toUpperCase()}</Text>
               <View style={styles.specBlock}>
                 <Text style={styles.specSub}>Công nghệ</Text>
                 <Text style={styles.specHero}>{p2DisplayTech}</Text>
               </View>
               <View style={styles.specBlock}>
                 <Text style={styles.specSub}>Kích thước</Text>
                 <Text style={styles.specHero}>{p2DisplaySize}</Text>
               </View>
               <View style={styles.specBlock}>
                 <Text style={styles.specSub}>Độ phân giải</Text>
                 <Text style={styles.specHero}>{p2Resolution}</Text>
               </View>
               <View style={styles.specBlock}>
                 <Text style={styles.specSub}>Tần số quét</Text>
                 <Text style={styles.specHero}>{p2RefreshRate}</Text>
               </View>
            </View>
          </View>
        </View>

        {/* Conclusion Card */}
        <View style={[styles.card, { backgroundColor: '#fef2f2', borderColor: '#fee2e2', borderWidth: 1 }]}>
          <View style={styles.iconTitleRow}>
            <View style={[styles.titleIconBox, { backgroundColor: '#d70018' }]}>
               <Ionicons name="bulb" size={16} color="#ffffff" />
            </View>
            <Text style={styles.cardTitleLine}>Gợi ý từ PhoneHub</Text>
          </View>

          <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 16, lineHeight: 22 }}>
            Dựa trên bảng thông số kỹ thuật thực tế của 2 thiết bị, chúng tôi đưa ra lời khuyên sau:
          </Text>

          {/* Performance Suggestion */}
          <View style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'flex-start' }}>
            <Ionicons name="rocket" size={20} color="#0066ff" style={{ marginTop: 2, marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#111827', marginBottom: 4 }}>Nếu bạn cần máy mạnh (Hiệu năng):</Text>
              <Text style={{ fontSize: 13, color: '#4b5563', lineHeight: 20 }}>
                {(() => {
                  const perfWinner = getWinner(p1Multi, p2Multi) || getWinner(p1Single, p2Single);
                  if (perfWinner === 1) return `Nên chọn ${product1.title} vì có điểm hiệu năng cao hơn.`;
                  if (perfWinner === 2) return `Nên chọn ${product2.title} vì có điểm hiệu năng cao hơn.`;
                  return "Cả hai máy có hiệu năng tương đương hoặc chưa có đủ dữ liệu so sánh.";
                })()}
              </Text>
            </View>
          </View>

          {/* Battery Suggestion */}
          <View style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'flex-start' }}>
            <Ionicons name="battery-full" size={20} color="#16a34a" style={{ marginTop: 2, marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#111827', marginBottom: 4 }}>Nếu bạn ưu tiên Pin trâu:</Text>
              <Text style={{ fontSize: 13, color: '#4b5563', lineHeight: 20 }}>
                {getWinner(p1Battery, p2Battery) === 1 
                  ? `Nên chọn ${product1.title} vì có dung lượng pin / thời gian sử dụng lớn hơn.`
                  : getWinner(p1Battery, p2Battery) === 2 
                    ? `Nên chọn ${product2.title} vì có dung lượng pin / thời gian sử dụng lớn hơn.`
                    : "Cả hai máy có thời lượng pin tương đương hoặc chưa có đủ dữ liệu so sánh."}
              </Text>
            </View>
          </View>

          {/* Camera Suggestion */}
          <View style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'flex-start' }}>
            <Ionicons name="camera" size={20} color="#d946ef" style={{ marginTop: 2, marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#111827', marginBottom: 4 }}>Nếu bạn thích chụp ảnh (Camera):</Text>
              <Text style={{ fontSize: 13, color: '#4b5563', lineHeight: 20 }}>
                {getWinner(p1MainCam, p2MainCam) === 1 
                  ? `Nên chọn ${product1.title} vì có thông số cảm biến Camera chính lớn hơn.`
                  : getWinner(p1MainCam, p2MainCam) === 2 
                    ? `Nên chọn ${product2.title} vì có thông số cảm biến Camera chính lớn hơn.`
                    : "Thông số phần cứng Camera tương đương. Tuy nhiên chất lượng ảnh còn phụ thuộc vào thuật toán phần mềm của hãng."}
              </Text>
            </View>
          </View>

          {/* Weight Suggestion */}
          <View style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'flex-start' }}>
            <Ionicons name="leaf" size={20} color="#14b8a6" style={{ marginTop: 2, marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#111827', marginBottom: 4 }}>Nếu bạn thích sự mỏng nhẹ:</Text>
              <Text style={{ fontSize: 13, color: '#4b5563', lineHeight: 20 }}>
                {getWinner(p1Weight, p2Weight, true) === 1 
                  ? `Nên chọn ${product1.title} vì có trọng lượng nhẹ hơn.`
                  : getWinner(p1Weight, p2Weight, true) === 2 
                    ? `Nên chọn ${product2.title} vì có trọng lượng nhẹ hơn.`
                    : "Trọng lượng của hai thiết bị ngang bằng nhau hoặc không có dữ liệu."}
              </Text>
            </View>
          </View>

          {/* Storage Suggestion */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Ionicons name="server" size={20} color="#f59e0b" style={{ marginTop: 2, marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#111827', marginBottom: 4 }}>Nếu bạn cần lưu trữ nhiều (Dung lượng):</Text>
              <Text style={{ fontSize: 13, color: '#4b5563', lineHeight: 20 }}>
                {getWinner(p1Storage, p2Storage) === 1 
                  ? `Nên chọn ${product1.title} vì có dung lượng lưu trữ mặc định lớn hơn.`
                  : getWinner(p1Storage, p2Storage) === 2 
                    ? `Nên chọn ${product2.title} vì có dung lượng lưu trữ mặc định lớn hơn.`
                    : "Cả hai có chung mức dung lượng lưu trữ cơ bản hoặc không có dữ liệu."}
              </Text>
            </View>
          </View>

        </View>

      </ScrollView>

      {/* Picker Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn thiết bị so sánh</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={allProducts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    if (pickingFor === 1) setProduct1Id(item.id);
                    else setProduct2Id(item.id);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <BottomNav activeTab="compare" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 24,
  },
  deviceCol: {
    flex: 1,
    alignItems: 'center',
  },
  phonePlaceholder: {
    backgroundColor: '#ffffff',
    width: 100,
    height: 120,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  brandBlue: {
    color: '#0066ff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  brandGreen: {
    color: '#16a34a',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 26,
  },
  legendWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 0.5,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  metricLabelEnd: {
    fontSize: 12,
    color: '#6b7280',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  scoreName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  scoreValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  barBackground: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    marginBottom: 16,
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  blueCard: {
    backgroundColor: '#0066cc',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  blueCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  blueCardDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: 24,
  },
  batteryScoreRow: {
    marginBottom: 20,
  },
  batteryLargeText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
  },
  batterySmallHr: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  batteryDevice: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  titleIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitleLine: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  columnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colHalf: {
    flex: 1,
  },
  colHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6b7280',
    letterSpacing: 1,
    marginBottom: 16,
  },
  specBlock: {
    marginBottom: 16,
  },
  specHero: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  specSub: {
    fontSize: 12,
    color: '#6b7280',
  },
  brightnessRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  brightnessBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  brightnessLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#9ca3af',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  brightnessValueBlue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0066ff',
  },
  brightnessValueGreen: {
    fontSize: 18,
    fontWeight: '900',
    color: '#16a34a',
  },
  deviceImage: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
});
