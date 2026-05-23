package com.phonehub.api.controller;

import com.phonehub.api.model.*;
import com.phonehub.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/stats")
public class AdminStatsController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @GetMapping
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        List<Order> allOrders = orderRepository.findAll();

        BigDecimal totalRevenue = allOrders.stream()
                .map(Order::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long pendingOrders = allOrders.stream()
                .filter(o -> "Chờ xác nhận".equals(o.getOrderStatus()))
                .count();

        long deliveredOrders = allOrders.stream()
                .filter(o -> "Đã giao".equals(o.getOrderStatus()))
                .count();

        long cancelledOrders = allOrders.stream()
                .filter(o -> "Đã hủy".equals(o.getOrderStatus()))
                .count();

        stats.put("totalRevenue", totalRevenue);
        stats.put("pendingOrders", pendingOrders);
        stats.put("totalProducts", productRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalOrders", (long) allOrders.size());
        stats.put("deliveredOrders", deliveredOrders);
        stats.put("cancelledOrders", cancelledOrders);

        return stats;
    }

    @GetMapping("/report")
    public Map<String, Object> getReport() {
        Map<String, Object> report = new HashMap<>();

        // Monthly revenue for last 6 months
        List<Order> allOrders = orderRepository.findAll();
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MONTH, -6);
        Date sixMonthsAgo = cal.getTime();

        Map<String, BigDecimal> monthlyMap = new LinkedHashMap<>();
        for (Order order : allOrders) {
            if (order.getOrderDate() != null && order.getOrderDate().after(sixMonthsAgo)) {
                Calendar orderCal = Calendar.getInstance();
                orderCal.setTime(order.getOrderDate());
                int month = orderCal.get(Calendar.MONTH) + 1;
                int year = orderCal.get(Calendar.YEAR);
                String key = year + "-" + String.format("%02d", month);
                monthlyMap.merge(key, order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO, BigDecimal::add);
            }
        }

        List<Map<String, Object>> monthlyRevenue = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : monthlyMap.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("month", entry.getKey());
            item.put("revenue", entry.getValue());
            monthlyRevenue.add(item);
        }
        monthlyRevenue.sort(Comparator.comparing(m -> (String) m.get("month")));
        report.put("monthlyRevenue", monthlyRevenue);

        // Top 5 selling products
        List<Product> allProducts = productRepository.findAll();
        List<Map<String, Object>> topSelling = allProducts.stream()
                .sorted(Comparator.comparingInt((Product p) -> p.getQuantitySold() != null ? p.getQuantitySold() : 0).reversed())
                .limit(5)
                .map(p -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", p.getId());
                    item.put("title", p.getTitle());
                    item.put("quantitySold", p.getQuantitySold() != null ? p.getQuantitySold() : 0);
                    return item;
                })
                .collect(Collectors.toList());
        report.put("topSellingProducts", topSelling);

        // Bottom 5 slow selling products
        List<Map<String, Object>> slowSelling = allProducts.stream()
                .sorted(Comparator.comparingInt((Product p) -> p.getQuantitySold() != null ? p.getQuantitySold() : 0))
                .limit(5)
                .map(p -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", p.getId());
                    item.put("title", p.getTitle());
                    item.put("quantitySold", p.getQuantitySold() != null ? p.getQuantitySold() : 0);
                    return item;
                })
                .collect(Collectors.toList());
        report.put("slowSellingProducts", slowSelling);

        // Low stock products (stockQuantity < 5)
        List<ProductVariant> allVariants = productVariantRepository.findAll();
        List<Map<String, Object>> lowStock = allVariants.stream()
                .filter(v -> v.getStockQuantity() != null && v.getStockQuantity() < 5)
                .map(v -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", v.getId());
                    item.put("sku", v.getSku());
                    item.put("productName", v.getProduct() != null ? v.getProduct().getTitle() : "");
                    item.put("stockQuantity", v.getStockQuantity());
                    item.put("color", v.getColor());
                    item.put("capacity", v.getCapacity());
                    return item;
                })
                .collect(Collectors.toList());
        report.put("lowStockProducts", lowStock);

        // Revenue by category
        List<OrderDetail> allDetails = orderDetailRepository.findAll();
        Map<String, BigDecimal> categoryRevenueMap = new HashMap<>();
        for (OrderDetail detail : allDetails) {
            String categoryName = "Không xác định";
            if (detail.getProduct() != null && detail.getProduct().getCategory() != null) {
                categoryName = detail.getProduct().getCategory().getName();
            }
            BigDecimal revenue = detail.getUnitPrice().multiply(BigDecimal.valueOf(detail.getQuantity()));
            categoryRevenueMap.merge(categoryName, revenue, BigDecimal::add);
        }

        List<Map<String, Object>> revenueByCategory = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : categoryRevenueMap.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("category", entry.getKey());
            item.put("revenue", entry.getValue());
            revenueByCategory.add(item);
        }
        report.put("revenueByCategory", revenueByCategory);

        return report;
    }
}
