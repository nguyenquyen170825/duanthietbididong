import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput, ScrollView, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { productVariantAPI, productAPI } from '../../../../services/api';

const ProductVariantsScreen = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [variants, setVariants] = useState([]);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentVariantId, setCurrentVariantId] = useState(null);
    
    // Form state
    const [formData, setFormData] = useState({
        sku: '',
        color: '',
        capacity: '',
        ram: '',
        price: '',
        oldPrice: '',
        stockQuantity: '0',
        imageUrl: '',
        status: true
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productRes, variantsRes] = await Promise.all([
                productAPI.getById(id),
                productVariantAPI.getByProduct(id)
            ]);
            setProduct(productRes);
            setVariants(variantsRes || []);
        } catch (error) {
            console.log("Error fetching variants", error);
            Alert.alert("Lỗi", "Không thể tải dữ liệu biến thể");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            sku: '',
            color: '',
            capacity: '',
            ram: '',
            price: '',
            oldPrice: '',
            stockQuantity: '0',
            imageUrl: '',
            status: true
        });
        setIsEditing(false);
        setCurrentVariantId(null);
    };

    const openAddModal = () => {
        resetForm();
        setModalVisible(true);
    };

    const openEditModal = (item) => {
        setFormData({
            sku: item.sku || '',
            color: item.color || '',
            capacity: item.capacity || '',
            ram: item.ram || '',
            price: item.price?.toString() || '',
            oldPrice: item.oldPrice?.toString() || '',
            stockQuantity: item.stockQuantity?.toString() || '0',
            imageUrl: item.images && item.images.length > 0 ? item.images[0].imageUrl : '',
            status: item.status !== false
        });
        setIsEditing(true);
        setCurrentVariantId(item.id);
        setModalVisible(true);
    };

    const executeDelete = async (variantId) => {
        try {
            await productVariantAPI.delete(variantId);
            if (Platform.OS === 'web') window.alert("Đã xóa biến thể");
            else Alert.alert("Thành công", "Đã xóa biến thể");
            fetchData();
        } catch (error) {
            if (Platform.OS === 'web') window.alert("Xóa biến thể thất bại");
            else Alert.alert("Lỗi", "Xóa biến thể thất bại");
        }
    };

    const handleDelete = (variantId) => {
        if (Platform.OS === 'web') {
            if (window.confirm("Bạn có chắc chắn muốn xóa biến thể này?")) {
                executeDelete(variantId);
            }
        } else {
            Alert.alert(
                "Xác nhận",
                "Bạn có chắc chắn muốn xóa biến thể này?",
                [
                    { text: "Hủy", style: "cancel" },
                    { text: "Xóa", style: "destructive", onPress: () => executeDelete(variantId) }
                ]
            );
        }
    };

    const handleSave = async () => {
        if (!formData.color || !formData.capacity || !formData.price) {
            Alert.alert("Lỗi", "Vui lòng nhập Màu sắc, Dung lượng và Giá");
            return;
        }

        setSaving(true);
        const payload = {
            ...formData,
            price: parseFloat(formData.price) || 0,
            oldPrice: parseFloat(formData.oldPrice) || 0,
            stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
            images: formData.imageUrl ? [{ imageUrl: formData.imageUrl, isMain: true }] : []
        };

        try {
            if (isEditing) {
                await productVariantAPI.update(currentVariantId, payload);
                Alert.alert("Thành công", "Đã cập nhật biến thể");
            } else {
                await productVariantAPI.create(id, payload);
                Alert.alert("Thành công", "Đã thêm biến thể mới");
            }
            setModalVisible(false);
            fetchData();
        } catch (error) {
            Alert.alert("Lỗi", "Lưu biến thể thất bại");
            console.log(error);
        } finally {
            setSaving(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.skuBadge}>
                    <Text style={styles.skuText}>{item.sku || 'N/A'}</Text>
                </View>
                <View style={styles.actionRow}>
                    <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionBtn}>
                        <Ionicons name="create-outline" size={20} color="#f59e0b" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.actionBtn, {marginLeft: 8}]}>
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={styles.contentRow}>
                {item.images && item.images.length > 0 ? (
                    <Image source={{ uri: item.images[0].imageUrl }} style={styles.variantImage} />
                ) : (
                    <View style={styles.variantImagePlaceholder}>
                        <Ionicons name="image-outline" size={24} color="#94a3b8" />
                    </View>
                )}
                
                <View style={{flex: 1}}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoCol}>
                            <Text style={styles.infoLabel}>Màu sắc</Text>
                            <Text style={styles.infoValue}>{item.color}</Text>
                        </View>
                        <View style={styles.infoCol}>
                            <Text style={styles.infoLabel}>Dung lượng</Text>
                            <Text style={styles.infoValue}>{item.capacity}</Text>
                        </View>
                        <View style={styles.infoCol}>
                            <Text style={styles.infoLabel}>Kho</Text>
                            <Text style={styles.infoValue}>{item.stockQuantity}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />
                    
                    <View style={styles.priceRow}>
                        <View>
                            <Text style={styles.priceLabel}>Giá bán:</Text>
                            <Text style={styles.priceValue}>{Number(item.price).toLocaleString('vi-VN')} ₫</Text>
                        </View>
                        {item.oldPrice > 0 && (
                            <View style={{alignItems: 'flex-end'}}>
                                <Text style={styles.priceLabel}>Giá cũ:</Text>
                                <Text style={styles.oldPriceValue}>{Number(item.oldPrice).toLocaleString('vi-VN')} ₫</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#1f2937" />
                </TouchableOpacity>
                <Text style={styles.title} numberOfLines={1}>Biến thể: {product?.title || 'Đang tải...'}</Text>
            </View>

            <View style={styles.subHeader}>
                <Text style={styles.countText}>Tổng: {variants.length} biến thể</Text>
                <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                    <Ionicons name="add-circle" size={20} color="#fff" />
                    <Text style={styles.addBtnText}>Thêm mới</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                </View>
            ) : (
                <FlatList
                    data={variants}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="cube-outline" size={48} color="#9ca3af" />
                            <Text style={styles.emptyText}>Sản phẩm này chưa có biến thể nào</Text>
                        </View>
                    }
                />
            )}

            {/* Modal Add/Edit */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{isEditing ? 'Sửa biến thể' : 'Thêm biến thể mới'}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#111" />
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.inputLabel}>SKU (Mã phiên bản)</Text>
                            <TextInput style={styles.input} value={formData.sku} onChangeText={(v) => setFormData({...formData, sku: v})} placeholder="VD: IPH15-PRO-256" />

                            <View style={styles.rowInputs}>
                                <View style={{flex: 1, marginRight: 8}}>
                                    <Text style={styles.inputLabel}>Màu sắc (*)</Text>
                                    <TextInput style={styles.input} value={formData.color} onChangeText={(v) => setFormData({...formData, color: v})} placeholder="VD: Đen Titan" />
                                </View>
                                <View style={{flex: 1, marginLeft: 8}}>
                                    <Text style={styles.inputLabel}>Dung lượng (*)</Text>
                                    <TextInput style={styles.input} value={formData.capacity} onChangeText={(v) => setFormData({...formData, capacity: v})} placeholder="VD: 256GB" />
                                </View>
                            </View>

                            <View style={styles.rowInputs}>
                                <View style={{flex: 1, marginRight: 8}}>
                                    <Text style={styles.inputLabel}>RAM</Text>
                                    <TextInput style={styles.input} value={formData.ram} onChangeText={(v) => setFormData({...formData, ram: v})} placeholder="VD: 8GB" />
                                </View>
                                <View style={{flex: 1, marginLeft: 8}}>
                                    <Text style={styles.inputLabel}>Số lượng kho</Text>
                                    <TextInput style={styles.input} value={formData.stockQuantity} onChangeText={(v) => setFormData({...formData, stockQuantity: v})} keyboardType="numeric" />
                                </View>
                            </View>

                            <Text style={styles.inputLabel}>URL Hình ảnh</Text>
                            <TextInput style={styles.input} value={formData.imageUrl} onChangeText={(v) => setFormData({...formData, imageUrl: v})} placeholder="http://..." />

                            <Text style={styles.inputLabel}>Giá bán (VNĐ) (*)</Text>
                            <TextInput style={styles.input} value={formData.price} onChangeText={(v) => setFormData({...formData, price: v})} keyboardType="numeric" placeholder="VD: 25000000" />

                            <Text style={styles.inputLabel}>Giá cũ (VNĐ)</Text>
                            <TextInput style={styles.input} value={formData.oldPrice} onChangeText={(v) => setFormData({...formData, oldPrice: v})} keyboardType="numeric" placeholder="VD: 28000000" />

                            <TouchableOpacity style={styles.submitBtn} onPress={handleSave} disabled={saving}>
                                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Lưu biến thể</Text>}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f7fe', paddingTop: 40 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    backBtn: { padding: 4, marginRight: 12 },
    title: { fontSize: 18, fontWeight: '800', color: '#1f2937', flex: 1 },
    subHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 16, marginBottom: 8 },
    countText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
    addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3b82f6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13, marginLeft: 6 },
    
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
    emptyText: { marginTop: 12, fontSize: 15, color: '#64748b' },
    
    card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    skuBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    skuText: { fontSize: 12, fontWeight: '700', color: '#475569' },
    actionRow: { flexDirection: 'row' },
    actionBtn: { padding: 4 },
    
    contentRow: { flexDirection: 'row', alignItems: 'center' },
    variantImage: { width: 60, height: 60, borderRadius: 8, marginRight: 16, backgroundColor: '#f8fafc' },
    variantImagePlaceholder: { width: 60, height: 60, borderRadius: 8, marginRight: 16, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
    
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    infoCol: { flex: 1 },
    infoLabel: { fontSize: 11, color: '#94a3b8', marginBottom: 2 },
    infoValue: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
    
    divider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 12 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    priceLabel: { fontSize: 11, color: '#94a3b8', marginBottom: 2 },
    priceValue: { fontSize: 16, fontWeight: '800', color: '#d70018' },
    oldPriceValue: { fontSize: 13, fontWeight: '600', color: '#94a3b8', textDecorationLine: 'line-through' },
    
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    modalTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
    inputLabel: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 6, marginTop: 12 },
    input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, fontSize: 14, color: '#1e293b', backgroundColor: '#fff' },
    rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
    submitBtn: { backgroundColor: '#3b82f6', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 24, marginBottom: 20 },
    submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' }
});

export default ProductVariantsScreen;
