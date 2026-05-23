import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categoryAPI } from '../../services/api';

const CategoriesScreen = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryAPI.getAll();
            setCategories(data);
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tải danh mục");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!name.trim()) return Alert.alert("Lỗi", "Vui lòng nhập tên danh mục");
        try {
            await categoryAPI.create({ name: name.trim(), description: description.trim() });
            Alert.alert("Thành công", "Đã thêm danh mục mới");
            setName('');
            setDescription('');
            fetchCategories();
        } catch (error) {
            Alert.alert("Lỗi", "Thêm thất bại");
        }
    };

    const executeDelete = async (item) => {
        try {
            await categoryAPI.delete(item.id);
            if (Platform.OS === 'web') window.alert("Đã xóa danh mục");
            else Alert.alert("Thành công", "Đã xóa danh mục");
            fetchCategories();
        } catch (error) {
            if (Platform.OS === 'web') window.alert("Xóa thất bại. Có thể danh mục đang chứa sản phẩm.");
            else Alert.alert("Lỗi", "Xóa thất bại. Có thể danh mục đang chứa sản phẩm.");
        }
    };

    const handleDelete = (item) => {
        if (Platform.OS === 'web') {
            if (window.confirm(`Bạn có chắc muốn xóa danh mục "${item.name}"?\nCác sản phẩm thuộc danh mục này cũng có thể bị ảnh hưởng.`)) {
                executeDelete(item);
            }
        } else {
            Alert.alert(
                "Xác nhận xóa",
                `Bạn có chắc muốn xóa danh mục "${item.name}"?\nCác sản phẩm thuộc danh mục này cũng có thể bị ảnh hưởng.`,
                [
                    { text: "Hủy", style: "cancel" },
                    { text: "Xóa", style: "destructive", onPress: () => executeDelete(item) }
                ]
            );
        }
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setEditName(item.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
    };

    const handleSaveEdit = async (id) => {
        if (!editName.trim()) return Alert.alert("Lỗi", "Tên danh mục không được để trống");
        try {
            await categoryAPI.update(id, { name: editName.trim() });
            Alert.alert("Thành công", "Đã cập nhật danh mục");
            cancelEdit();
            fetchCategories();
        } catch (error) {
            Alert.alert("Lỗi", "Cập nhật thất bại");
        }
    };

    const filteredCategories = categories.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quản lý danh mục</Text>

            {/* Search Box */}
            <View style={styles.searchBox}>
                <Ionicons name="search" size={20} color="#9ca3af" />
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Tìm kiếm danh mục..." 
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Add Form */}
            <View style={styles.formCard}>
                <View style={styles.formHeader}>
                    <Ionicons name="add-circle" size={20} color="#16a34a" />
                    <Text style={styles.formHeaderText}>Thêm danh mục mới</Text>
                </View>
                <TextInput placeholder="Tên danh mục *" placeholderTextColor="#9ca3af" style={styles.input} value={name} onChangeText={setName} />
                <TextInput placeholder="Mô tả (tùy chọn)" placeholderTextColor="#9ca3af" style={styles.input} value={description} onChangeText={setDescription} />
                <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                    <Ionicons name="checkmark-circle" size={18} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.addBtnText}>Thêm Danh Mục</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.listHeader}>Danh sách ({filteredCategories.length})</Text>

            {loading ? <ActivityIndicator size="large" color="#3b82f6" /> : (
                <FlatList
                    data={filteredCategories}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <View style={styles.row}>
                            {editingId === item.id ? (
                                /* Edit mode */
                                <View style={styles.editRow}>
                                    <TextInput
                                        style={styles.editInput}
                                        value={editName}
                                        onChangeText={setEditName}
                                        autoFocus
                                    />
                                    <TouchableOpacity style={styles.saveEditBtn} onPress={() => handleSaveEdit(item.id)}>
                                        <Ionicons name="checkmark" size={18} color="#fff" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.cancelEditBtn} onPress={cancelEdit}>
                                        <Ionicons name="close" size={18} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                /* View mode */
                                <>
                                    <View style={styles.rowInfo}>
                                        <View style={styles.catIcon}>
                                            <Ionicons name="folder-open" size={18} color="#3b82f6" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.rowTitle}>{item.name}</Text>
                                            {item.description ? <Text style={styles.rowDesc}>{item.description}</Text> : null}
                                        </View>
                                    </View>
                                    <View style={styles.actionCol}>
                                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#fef3c7' }]} onPress={() => startEdit(item)}>
                                            <Ionicons name="create-outline" size={16} color="#f59e0b" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#fee2e2' }]} onPress={() => handleDelete(item)}>
                                            <Ionicons name="trash-outline" size={16} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 60, backgroundColor: '#f4f7fe' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#1f2937' },
    searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 16 },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1f2937' },
    formCard: { backgroundColor: '#fff', padding: 16, borderRadius: 14, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
    formHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    formHeaderText: { fontSize: 14, fontWeight: '700', color: '#16a34a', marginLeft: 6 },
    input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, marginBottom: 10, fontSize: 14, backgroundColor: '#f9fafb' },
    addBtn: { backgroundColor: '#16a34a', padding: 13, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    listHeader: { fontSize: 15, fontWeight: '700', color: '#64748b', marginBottom: 10 },
    row: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 8, elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4 },
    rowInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    catIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    rowTitle: { fontWeight: '700', fontSize: 15, color: '#1f2937' },
    rowDesc: { color: '#6b7280', fontSize: 12, marginTop: 2 },
    actionCol: { flexDirection: 'row', gap: 6, marginTop: 10, justifyContent: 'flex-end' },
    actionBtn: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    editRow: { flexDirection: 'row', alignItems: 'center' },
    editInput: { flex: 1, borderWidth: 1, borderColor: '#3b82f6', borderRadius: 8, padding: 10, fontSize: 14, backgroundColor: '#eff6ff', marginRight: 8 },
    saveEditBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center', marginRight: 6 },
    cancelEditBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#6b7280', alignItems: 'center', justifyContent: 'center' },
});

export default CategoriesScreen;
