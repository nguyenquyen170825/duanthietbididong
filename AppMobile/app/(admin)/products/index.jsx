import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal, ScrollView, TextInput, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { productAPI, categoryAPI } from '../../../services/api';
import { fixImageUrl } from '../../../config/apiConfig';

const ProductsScreen = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailModal, setDetailModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editData, setEditData] = useState({ title: '', brand: '', description: '' });
    const [addData, setAddData] = useState({ title: '', brand: '', categoryId: null, description: '' });
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState(null);
    const router = useRouter();

    useEffect(() => { 
        fetchProducts(); 
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryAPI.getAll();
            setCategories(data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchProducts = async () => {
        try {
            const data = await productAPI.getAll();
            setProducts(data);
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tải sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const executeDelete = async (item) => {
        try {
            await productAPI.delete(item.id);
            if (Platform.OS === 'web') {
                window.alert("Đã xóa sản phẩm thành công");
            } else {
                Alert.alert("Thành công", "Đã xóa sản phẩm");
            }
            fetchProducts();
        } catch (error) {
            if (Platform.OS === 'web') {
                window.alert("Xóa thất bại");
            } else {
                Alert.alert("Lỗi", "Xóa thất bại");
            }
        }
    };

    const handleDelete = (item) => {
        if (Platform.OS === 'web') {
            const confirmed = window.confirm(`Bạn có chắc muốn xóa "${item.title}"?`);
            if (confirmed) executeDelete(item);
        } else {
            Alert.alert(
                "Xác nhận xóa",
                `Bạn có chắc muốn xóa "${item.title}"?`,
                [
                    { text: "Hủy", style: "cancel" },
                    { text: "Xóa", style: "destructive", onPress: () => executeDelete(item) }
                ]
            );
        }
    };

    const openDetail = (item) => {
        setSelectedProduct(item);
        setDetailModal(true);
    };

    const openEdit = (item) => {
        setSelectedProduct(item);
        setEditData({
            title: item.title || '',
            brand: item.brand || '',
            description: item.description || '',
        });
        setEditModal(true);
    };

    const handleSaveEdit = async () => {
        setSaving(true);
        try {
            await productAPI.update(selectedProduct.id, editData);
            Alert.alert("Thành công", "Đã cập nhật sản phẩm");
            setEditModal(false);
            fetchProducts();
        } catch (error) {
            Alert.alert("Lỗi", "Cập nhật thất bại");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveAdd = async () => {
        if (!addData.title || !addData.categoryId) {
            Alert.alert("Lỗi", "Vui lòng nhập tên và chọn danh mục");
            return;
        }
        setSaving(true);
        try {
            const payload = {
                title: addData.title,
                brand: addData.brand,
                description: addData.description,
                category: { id: addData.categoryId }
            };
            await productAPI.create(payload);
            Alert.alert("Thành công", "Đã thêm sản phẩm");
            setAddModal(false);
            setAddData({ title: '', brand: '', categoryId: null, description: '' });
            fetchProducts();
        } catch (error) {
            Alert.alert("Lỗi", "Thêm thất bại");
        } finally {
            setSaving(false);
        }
    };

    const getImageUrl = (item) => {
        if (item.images && item.images.length > 0) return fixImageUrl(item.images[0].imageUrl);
        if (item.productVariants) {
            for (const v of item.productVariants) {
                if (v.images && v.images.length > 0) return fixImageUrl(v.images[0].imageUrl);
            }
        }
        return null;
    };

    const openVariants = (item) => {
        router.push(`/products/variants/${item.id}`);
    };

    const renderItem = ({ item }) => {
        const imgUrl = getImageUrl(item);
        return (
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    {imgUrl ? (
                        <Image source={{ uri: imgUrl }} style={styles.thumb} resizeMode="contain" />
                    ) : (
                        <View style={[styles.thumb, styles.thumbPlaceholder]}>
                            <Ionicons name="image-outline" size={32} color="#9ca3af" />
                        </View>
                    )}
                    <View style={styles.infoCol}>
                        <Text style={styles.rowTitle} numberOfLines={2}>{item.title || item.name}</Text>
                        <Text style={styles.rowPrice}>{Number(item.price || 0).toLocaleString('vi-VN')} ₫</Text>
                        <Text style={styles.rowBrand}>{item.brand}</Text>
                        
                        <View style={styles.actionRow}>
                            <TouchableOpacity style={[styles.actionBtn, styles.btnView]} onPress={() => openDetail(item)}>
                                <Ionicons name="eye-outline" size={16} color="#3b82f6" />
                                <Text style={[styles.actionText, {color: '#3b82f6'}]}>Xem</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, styles.btnEdit]} onPress={() => openEdit(item)}>
                                <Ionicons name="create-outline" size={16} color="#f59e0b" />
                                <Text style={[styles.actionText, {color: '#f59e0b'}]}>Sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, styles.btnVariant]} onPress={() => openVariants(item)}>
                                <Ionicons name="layers-outline" size={16} color="#8b5cf6" />
                                <Text style={[styles.actionText, {color: '#8b5cf6'}]}>Biến thể</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, styles.btnDelete]} onPress={() => handleDelete(item)}>
                                <Ionicons name="trash-outline" size={16} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const filteredProducts = products.filter(p => {
        const matchQuery = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCat = searchCategory ? p.category?.id === searchCategory : true;
        return matchQuery && matchCat;
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Quản lý sản phẩm</Text>
                    <Text style={styles.subtitle}>{filteredProducts.length} sản phẩm</Text>
                </View>
                <TouchableOpacity style={styles.headerAddBtn} onPress={() => setAddModal(true)}>
                    <Ionicons name="add" size={24} color="#fff" />
                    <Text style={styles.headerAddText}>Thêm</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.filterContainer}>
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color="#9ca3af" />
                    <TextInput 
                        style={styles.searchInput} 
                        placeholder="Tìm theo tên, thương hiệu..." 
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    )}
                </View>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                    <TouchableOpacity 
                        style={[styles.catChip, !searchCategory && styles.catChipActive]}
                        onPress={() => setSearchCategory(null)}
                    >
                        <Text style={[styles.catChipText, !searchCategory && styles.catChipTextActive]}>Tất cả</Text>
                    </TouchableOpacity>
                    {categories.map(cat => (
                        <TouchableOpacity 
                            key={cat.id} 
                            style={[styles.catChip, searchCategory === cat.id && styles.catChipActive]}
                            onPress={() => setSearchCategory(cat.id)}
                        >
                            <Text style={[styles.catChipText, searchCategory === cat.id && styles.catChipTextActive]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? <ActivityIndicator size="large" color="#3b82f6" style={{marginTop: 20}} /> : (
                <FlatList
                    data={filteredProducts}
                    keyExtractor={item => item.id?.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
                />
            )}

            {/* Detail Modal */}
            <Modal visible={detailModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chi tiết sản phẩm</Text>
                            <TouchableOpacity onPress={() => setDetailModal(false)}>
                                <Ionicons name="close" size={24} color="#111" />
                            </TouchableOpacity>
                        </View>
                        {selectedProduct && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {getImageUrl(selectedProduct) && (
                                    <Image source={{ uri: getImageUrl(selectedProduct) }} style={styles.detailImage} resizeMode="contain" />
                                )}
                                <Text style={styles.detailTitle}>{selectedProduct.title}</Text>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Thương hiệu:</Text>
                                    <Text style={styles.detailValue}>{selectedProduct.brand || '—'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Giá:</Text>
                                    <Text style={[styles.detailValue, { color: '#d70018', fontWeight: '800' }]}>{Number(selectedProduct.price || 0).toLocaleString('vi-VN')} ₫</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Danh mục:</Text>
                                    <Text style={styles.detailValue}>{selectedProduct.category?.name || '—'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Đã bán:</Text>
                                    <Text style={styles.detailValue}>{selectedProduct.quantitySold || 0}</Text>
                                </View>

                                {selectedProduct.description && (
                                    <View style={styles.detailSection}>
                                        <Text style={styles.detailSectionTitle}>Mô tả</Text>
                                        <Text style={styles.detailDesc}>{selectedProduct.description}</Text>
                                    </View>
                                )}

                                {selectedProduct.productVariants && selectedProduct.productVariants.length > 0 && (
                                    <View style={styles.detailSection}>
                                        <Text style={styles.detailSectionTitle}>Biến thể ({selectedProduct.productVariants.length})</Text>
                                        {selectedProduct.productVariants.map((v, i) => (
                                            <View key={i} style={styles.variantRow}>
                                                <Text style={styles.variantSku}>SKU: {v.sku || '—'}</Text>
                                                <Text style={styles.variantInfo}>{v.color} • {v.capacity} • RAM: {v.ram}</Text>
                                                <Text style={styles.variantPrice}>{Number(v.price || 0).toLocaleString('vi-VN')} ₫ • Kho: {v.stockQuantity}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                {selectedProduct.technicalSpecifications && selectedProduct.technicalSpecifications.length > 0 && (
                                    <View style={styles.detailSection}>
                                        <Text style={styles.detailSectionTitle}>Thông số kỹ thuật</Text>
                                        {selectedProduct.technicalSpecifications.map((spec, i) => (
                                            <View key={i} style={styles.specRow}>
                                                <Text style={styles.specName}>{spec.specName || spec.specificationName}</Text>
                                                <Text style={styles.specVal}>{spec.specValue || spec.specificationValue}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Edit Modal */}
            <Modal visible={editModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chỉnh sửa sản phẩm</Text>
                            <TouchableOpacity onPress={() => setEditModal(false)}>
                                <Ionicons name="close" size={24} color="#111" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            <Text style={styles.editLabel}>Tên sản phẩm</Text>
                            <TextInput style={styles.editInput} value={editData.title} onChangeText={(v) => setEditData({...editData, title: v})} />

                            <Text style={styles.editLabel}>Thương hiệu</Text>
                            <TextInput style={styles.editInput} value={editData.brand} onChangeText={(v) => setEditData({...editData, brand: v})} />

                            <Text style={styles.editLabel}>Mô tả</Text>
                            <TextInput style={[styles.editInput, { height: 100, textAlignVertical: 'top' }]} value={editData.description} onChangeText={(v) => setEditData({...editData, description: v})} multiline />

                            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit} disabled={saving}>
                                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Lưu thay đổi</Text>}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            {/* Add Modal */}
            <Modal visible={addModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Thêm sản phẩm mới</Text>
                            <TouchableOpacity onPress={() => setAddModal(false)}>
                                <Ionicons name="close" size={24} color="#111" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.editLabel}>Tên sản phẩm (*)</Text>
                            <TextInput style={styles.editInput} value={addData.title} onChangeText={(v) => setAddData({...addData, title: v})} placeholder="VD: iPhone 16 Pro Max" />

                            <Text style={styles.editLabel}>Thương hiệu</Text>
                            <TextInput style={styles.editInput} value={addData.brand} onChangeText={(v) => setAddData({...addData, brand: v})} placeholder="VD: Apple" />

                            <Text style={styles.editLabel}>Danh mục (*)</Text>
                            <View style={styles.catGrid}>
                                {categories.map(cat => (
                                    <TouchableOpacity 
                                        key={cat.id} 
                                        style={[styles.catGridItem, addData.categoryId === cat.id && styles.catGridItemActive]}
                                        onPress={() => setAddData({...addData, categoryId: cat.id})}
                                    >
                                        <Text style={[styles.catGridText, addData.categoryId === cat.id && styles.catGridTextActive]}>{cat.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.editLabel}>Mô tả</Text>
                            <TextInput style={[styles.editInput, { height: 100, textAlignVertical: 'top' }]} value={addData.description} onChangeText={(v) => setAddData({...addData, description: v})} multiline placeholder="Nhập mô tả sản phẩm..." />

                            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveAdd} disabled={saving}>
                                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Tạo sản phẩm</Text>}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60, backgroundColor: '#f4f7fe' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
    title: { fontSize: 24, fontWeight: '800', color: '#1f2937' },
    subtitle: { fontSize: 13, color: '#64748b', marginTop: 2, fontWeight: '600' },
    headerAddBtn: { flexDirection: 'row', backgroundColor: '#3b82f6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
    headerAddText: { color: '#fff', fontWeight: '700', marginLeft: 4, fontSize: 13 },
    
    filterContainer: { paddingHorizontal: 16, marginBottom: 4 },
    searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 12 },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1f2937' },
    catScroll: { flexDirection: 'row', paddingBottom: 8 },
    catChip: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#e5e7eb' },
    catChipActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
    catChipText: { fontSize: 13, color: '#475569', fontWeight: '600' },
    catChipTextActive: { color: '#fff' },
    
    card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, padding: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
    cardContent: { flexDirection: 'row' },
    thumb: { width: 80, height: 80, borderRadius: 12, marginRight: 14, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#f1f5f9' },
    thumbPlaceholder: { alignItems: 'center', justifyContent: 'center' },
    infoCol: { flex: 1 },
    rowTitle: { fontWeight: '800', fontSize: 15, color: '#1e293b', marginBottom: 6, lineHeight: 20 },
    rowPrice: { color: '#d70018', fontSize: 14, fontWeight: '800', marginBottom: 2 },
    rowBrand: { color: '#64748b', fontSize: 12, fontWeight: '600', marginBottom: 12 },
    
    actionRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1 },
    actionText: { fontSize: 11, fontWeight: '700', marginLeft: 4 },
    btnView: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' },
    btnEdit: { backgroundColor: '#fef3c7', borderColor: '#fde68a' },
    btnVariant: { backgroundColor: '#f3e8ff', borderColor: '#e9d5ff' },
    btnDelete: { backgroundColor: '#fef2f2', borderColor: '#fecaca', paddingHorizontal: 8 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '85%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
    modalTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
    detailImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16, backgroundColor: '#f8fafc' },
    detailTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 12 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    detailLabel: { fontSize: 13, color: '#64748b', fontWeight: '600' },
    detailValue: { fontSize: 13, color: '#111', fontWeight: '700' },
    detailSection: { marginTop: 16 },
    detailSectionTitle: { fontSize: 15, fontWeight: '800', color: '#1f2937', marginBottom: 8 },
    detailDesc: { fontSize: 13, color: '#475569', lineHeight: 20 },
    variantRow: { backgroundColor: '#f8fafc', padding: 10, borderRadius: 8, marginBottom: 6 },
    variantSku: { fontSize: 11, color: '#3b82f6', fontWeight: '700' },
    variantInfo: { fontSize: 12, color: '#475569', marginTop: 2 },
    variantPrice: { fontSize: 12, color: '#d70018', fontWeight: '700', marginTop: 2 },
    specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    specName: { fontSize: 12, color: '#64748b', flex: 1 },
    specVal: { fontSize: 12, color: '#111', fontWeight: '600', flex: 1, textAlign: 'right' },
    editLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6, marginTop: 12 },
    editInput: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 12, fontSize: 14, backgroundColor: '#f9fafb' },
    saveBtn: { backgroundColor: '#3b82f6', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 20, marginBottom: 20 },
    saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    catGridItem: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#f9fafb' },
    catGridItemActive: { backgroundColor: '#eff6ff', borderColor: '#3b82f6' },
    catGridText: { fontSize: 13, color: '#475569', fontWeight: '600' },
    catGridTextActive: { color: '#3b82f6' },
});

export default ProductsScreen;
