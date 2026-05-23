import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { statsAPI } from '../../services/api';
import { LineChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 32;

const ReportScreen = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchReport = async () => {
        try {
            const data = await statsAPI.getReport();
            setReport(data);
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReport(); }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchReport();
        setRefreshing(false);
    }, []);

    const formatCurrency = (val) => {
        const num = Number(val || 0);
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'tr';
        if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
        return num.toLocaleString('vi-VN');
    };

    const formatFullCurrency = (val) => Number(val || 0).toLocaleString('vi-VN') + ' ₫';

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={{ marginTop: 12, color: '#64748b' }}>Đang tải báo cáo...</Text>
            </View>
        );
    }

    const monthlyData = report?.monthlyRevenue || [];
    const topSelling = report?.topSellingProducts || [];
    const slowSelling = report?.slowSellingProducts || [];
    const lowStock = report?.lowStockProducts || [];
    const revByCategory = report?.revenueByCategory || [];

    // Prepare chart data
    const barChartData = {
        labels: monthlyData.map(m => m.month || ''),
        datasets: [{ data: monthlyData.map(m => Number(m.revenue) || 0) }],
    };

    const pieColors = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
    const pieChartData = revByCategory.map((item, i) => ({
        name: item.category || 'Khác',
        revenue: Number(item.revenue) || 0,
        color: pieColors[i % pieColors.length],
        legendFontColor: '#4b5563',
        legendFontSize: 12,
    }));

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        labelColor: () => '#64748b',
        style: { borderRadius: 16 },
        propsForBackgroundLines: { strokeDasharray: '', stroke: '#e5e7eb', strokeWidth: 1 },
        barPercentage: 0.6,
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 40 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />}
        >
            <Text style={styles.pageTitle}>📊 Báo cáo & Thống kê</Text>

            {/* Monthly Revenue Chart */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="bar-chart" size={20} color="#3b82f6" />
                    <Text style={styles.cardTitle}>Doanh thu theo tháng</Text>
                </View>
                {monthlyData.length > 0 ? (
                    <LineChart
                        data={barChartData}
                        width={screenWidth - 32}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={{
                            ...chartConfig,
                            propsForDots: {
                                r: "4",
                                strokeWidth: "2",
                                stroke: "#2563eb"
                            }
                        }}
                        style={{ borderRadius: 12 }}
                        bezier
                        fromZero
                        formatYLabel={(val) => formatCurrency(val)}
                    />
                ) : (
                    <Text style={styles.emptyText}>Chưa có dữ liệu doanh thu</Text>
                )}
            </View>

            {/* Revenue by Category */}
            {pieChartData.length > 0 && (
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="pie-chart" size={20} color="#8b5cf6" />
                        <Text style={styles.cardTitle}>Doanh thu theo danh mục</Text>
                    </View>
                    <PieChart
                        data={pieChartData}
                        width={screenWidth - 32}
                        height={200}
                        chartConfig={chartConfig}
                        accessor="revenue"
                        backgroundColor="transparent"
                        paddingLeft="0"
                        absolute
                    />
                </View>
            )}

            {/* Top Selling Products */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="trending-up" size={20} color="#10b981" />
                    <Text style={styles.cardTitle}>Top sản phẩm bán chạy</Text>
                </View>
                {topSelling.length > 0 ? (
                    topSelling.map((item, i) => (
                        <View key={i} style={styles.rankRow}>
                            <View style={[styles.rankBadge, i === 0 && { backgroundColor: '#f59e0b' }, i === 1 && { backgroundColor: '#94a3b8' }, i === 2 && { backgroundColor: '#cd7f32' }]}>
                                <Text style={styles.rankText}>{i + 1}</Text>
                            </View>
                            <Text style={styles.rankTitle} numberOfLines={2}>{item.title}</Text>
                            <View style={styles.rankSold}>
                                <Ionicons name="cart" size={12} color="#10b981" />
                                <Text style={styles.rankSoldText}>{item.quantitySold || 0}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Chưa có dữ liệu bán hàng</Text>
                )}
            </View>

            {/* Slow Selling Products */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="trending-down" size={20} color="#ef4444" />
                    <Text style={styles.cardTitle}>Sản phẩm bán chậm</Text>
                </View>
                {slowSelling.length > 0 ? (
                    slowSelling.map((item, i) => (
                        <View key={i} style={styles.rankRow}>
                            <View style={[styles.rankBadge, { backgroundColor: '#fecaca' }]}>
                                <Text style={[styles.rankText, { color: '#dc2626' }]}>{i + 1}</Text>
                            </View>
                            <Text style={styles.rankTitle} numberOfLines={2}>{item.title}</Text>
                            <View style={styles.rankSold}>
                                <Ionicons name="alert-circle" size={12} color="#ef4444" />
                                <Text style={[styles.rankSoldText, { color: '#ef4444' }]}>{item.quantitySold || 0}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
                )}
            </View>

            {/* Low Stock Products */}
            <View style={[styles.card, lowStock.length > 0 && { borderColor: '#fecaca', borderWidth: 1 }]}>
                <View style={styles.cardHeader}>
                    <Ionicons name="warning" size={20} color="#f59e0b" />
                    <Text style={styles.cardTitle}>⚠️ Sản phẩm tồn kho thấp</Text>
                    {lowStock.length > 0 && (
                        <View style={styles.alertBadge}>
                            <Text style={styles.alertBadgeText}>{lowStock.length}</Text>
                        </View>
                    )}
                </View>
                {lowStock.length > 0 ? (
                    lowStock.map((item, i) => (
                        <View key={i} style={styles.stockRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.stockName} numberOfLines={1}>{item.productName || 'N/A'}</Text>
                                <Text style={styles.stockSku}>SKU: {item.sku || '—'} • {item.color} • {item.capacity}</Text>
                            </View>
                            <View style={[styles.stockBadge, item.stockQuantity === 0 && { backgroundColor: '#fef2f2' }]}>
                                <Text style={[styles.stockCount, item.stockQuantity === 0 && { color: '#dc2626' }]}>
                                    {item.stockQuantity === 0 ? 'Hết hàng' : `Còn ${item.stockQuantity}`}
                                </Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptySuccess}>
                        <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                        <Text style={styles.emptySuccessText}>Tất cả sản phẩm đều đủ tồn kho</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f7fe', padding: 16, paddingTop: 60 },
    pageTitle: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 20 },
    card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginLeft: 8, flex: 1 },
    emptyText: { textAlign: 'center', color: '#94a3b8', fontSize: 13, paddingVertical: 20 },
    rankRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    rankBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    rankText: { fontSize: 12, fontWeight: '800', color: '#fff' },
    rankTitle: { flex: 1, fontSize: 13, fontWeight: '600', color: '#374151' },
    rankSold: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    rankSoldText: { fontSize: 12, fontWeight: '700', color: '#10b981' },
    stockRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    stockName: { fontSize: 13, fontWeight: '700', color: '#1f2937' },
    stockSku: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
    stockBadge: { backgroundColor: '#fffbeb', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    stockCount: { fontSize: 12, fontWeight: '700', color: '#f59e0b' },
    alertBadge: { backgroundColor: '#ef4444', width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    alertBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
    emptySuccess: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, gap: 8 },
    emptySuccessText: { color: '#10b981', fontSize: 13, fontWeight: '600' },
});

export default ReportScreen;
