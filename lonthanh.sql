CREATE DATABASE  IF NOT EXISTS `duancuahangapple` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `duancuahangapple`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: duancuahangapple
-- ------------------------------------------------------
-- Server version	9.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '0f7641a5-54ed-11f1-8377-cc28aa172e4e:1-99,
452142c5-2dd1-11f1-adbd-5e25c9cdbe8c:1-114';

--
-- Table structure for table `bienthesanpham`
--

DROP TABLE IF EXISTS `bienthesanpham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bienthesanpham` (
  `BienTheId` int NOT NULL AUTO_INCREMENT,
  `SanPhamId` int NOT NULL,
  `Mau` varchar(100) NOT NULL,
  `DungLuong` varchar(100) NOT NULL,
  `Sku` varchar(255) DEFAULT NULL,
  `Ram` varchar(100) DEFAULT NULL,
  `Gia` decimal(18,2) NOT NULL,
  `GiaCu` decimal(18,2) DEFAULT NULL,
  `GiamGia` decimal(18,2) DEFAULT NULL,
  `SoLuongTon` int NOT NULL,
  `TrangThai` tinyint(1) NOT NULL,
  `NgayTao` datetime NOT NULL,
  PRIMARY KEY (`BienTheId`),
  KEY `FK_BienTheSanPham_SanPham` (`SanPhamId`),
  CONSTRAINT `FK_BienTheSanPham_SanPham` FOREIGN KEY (`SanPhamId`) REFERENCES `sanpham` (`SanPhamId`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bienthesanpham`
--

LOCK TABLES `bienthesanpham` WRITE;
/*!40000 ALTER TABLE `bienthesanpham` DISABLE KEYS */;
INSERT INTO `bienthesanpham` VALUES (1,1,'Titan Sa Mạc','256GB',NULL,NULL,30990000.00,34990000.00,NULL,44,1,'2026-04-23 02:48:12'),(2,1,'Titan Đen','256GB',NULL,NULL,30990000.00,34990000.00,NULL,45,1,'2026-04-23 02:48:12'),(3,1,'Titan Trắng','256GB',NULL,NULL,30990000.00,34990000.00,NULL,30,1,'2026-04-23 02:48:12'),(4,1,'Titan Tự Nhiên','512GB',NULL,NULL,36490000.00,38990000.00,NULL,20,1,'2026-04-23 02:48:12'),(5,1,'Titan Sa Mạc','1TB',NULL,NULL,43490000.00,46990000.00,NULL,10,1,'2026-04-23 02:48:12'),(6,2,'Titan Sa Mạc','128GB',NULL,NULL,26490000.00,28990000.00,NULL,39,1,'2026-04-23 02:48:12'),(7,2,'Titan Đen','128GB',NULL,NULL,26490000.00,28990000.00,NULL,35,1,'2026-04-23 02:48:12'),(8,2,'Titan Trắng','256GB',NULL,NULL,28990000.00,31990000.00,NULL,25,1,'2026-04-23 02:48:12'),(9,2,'Titan Tự Nhiên','256GB',NULL,NULL,28990000.00,31990000.00,NULL,20,1,'2026-04-23 02:48:12'),(10,2,'Titan Sa Mạc','512GB',NULL,NULL,33990000.00,36990000.00,NULL,10,1,'2026-04-23 02:48:12'),(11,3,'Xanh Lưu Ly','128GB',NULL,NULL,23490000.00,25990000.00,NULL,60,1,'2026-04-23 02:48:12'),(12,3,'Hồng','128GB',NULL,NULL,23490000.00,25990000.00,NULL,55,1,'2026-04-23 02:48:12'),(13,3,'Xanh Lục Bảo','128GB',NULL,NULL,23490000.00,25990000.00,NULL,45,1,'2026-04-23 02:48:12'),(14,3,'Đen','256GB',NULL,NULL,25990000.00,28990000.00,NULL,30,1,'2026-04-23 02:48:12'),(15,3,'Trắng','512GB',NULL,NULL,31490000.00,34990000.00,NULL,15,1,'2026-04-23 02:48:12'),(16,4,'Xanh Lưu Ly','128GB',NULL,NULL,20690000.00,22990000.00,NULL,100,1,'2026-04-23 02:48:12'),(17,4,'Hồng','128GB',NULL,NULL,20690000.00,22990000.00,NULL,80,1,'2026-04-23 02:48:12'),(18,4,'Đen','256GB',NULL,NULL,23490000.00,25990000.00,NULL,50,1,'2026-04-23 02:48:12'),(19,4,'Trắng','256GB',NULL,NULL,23490000.00,25990000.00,NULL,40,1,'2026-04-23 02:48:12'),(20,4,'Xanh Lục Bảo','512GB',NULL,NULL,28990000.00,31990000.00,NULL,20,1,'2026-04-23 02:48:12'),(21,5,'Titan Tự Nhiên','256GB',NULL,NULL,27490000.00,29990000.00,NULL,30,1,'2026-04-23 02:48:12'),(22,5,'Titan Xanh','256GB',NULL,NULL,27490000.00,29990000.00,NULL,25,1,'2026-04-23 02:48:12'),(23,5,'Titan Đen','256GB',NULL,NULL,27490000.00,29990000.00,NULL,20,1,'2026-04-23 02:48:12'),(24,5,'Titan Trắng','512GB',NULL,NULL,33990000.00,35990000.00,NULL,10,1,'2026-04-23 02:48:12'),(25,5,'Titan Tự Nhiên','1TB',NULL,NULL,41990000.00,43990000.00,NULL,5,1,'2026-04-23 02:48:12'),(26,6,'Titan Tự Nhiên','128GB',NULL,NULL,23490000.00,25990000.00,NULL,40,1,'2026-04-23 02:48:12'),(27,6,'Titan Xanh','128GB',NULL,NULL,23490000.00,25990000.00,NULL,35,1,'2026-04-23 02:48:12'),(28,6,'Titan Đen','256GB',NULL,NULL,26490000.00,29990000.00,NULL,20,1,'2026-04-23 02:48:12'),(29,6,'Titan Trắng','256GB',NULL,NULL,26490000.00,29990000.00,NULL,15,1,'2026-04-23 02:48:12'),(30,6,'Titan Tự Nhiên','512GB',NULL,NULL,31990000.00,33990000.00,NULL,10,1,'2026-04-23 02:48:12'),(31,7,'Hồng','128GB',NULL,NULL,21490000.00,23990000.00,NULL,50,1,'2026-04-23 02:48:12'),(32,7,'Xanh Lá','128GB',NULL,NULL,21490000.00,23990000.00,NULL,40,1,'2026-04-23 02:48:12'),(33,7,'Đen','256GB',NULL,NULL,23990000.00,26990000.00,NULL,30,1,'2026-04-23 02:48:12'),(34,7,'Vàng','256GB',NULL,NULL,23990000.00,26990000.00,NULL,25,1,'2026-04-23 02:48:12'),(35,7,'Xanh Dương','512GB',NULL,NULL,28990000.00,30990000.00,NULL,10,1,'2026-04-23 02:48:12'),(36,8,'Hồng','128GB',NULL,NULL,18490000.00,20990000.00,NULL,80,1,'2026-04-23 02:48:12'),(37,8,'Vàng','128GB',NULL,NULL,18490000.00,20990000.00,NULL,60,1,'2026-04-23 02:48:12'),(38,8,'Xanh Lá','256GB',NULL,NULL,21490000.00,23990000.00,NULL,40,1,'2026-04-23 02:48:12'),(39,8,'Đen','256GB',NULL,NULL,21490000.00,23990000.00,NULL,35,1,'2026-04-23 02:48:12'),(40,8,'Xanh Dương','512GB',NULL,NULL,26490000.00,28990000.00,NULL,15,1,'2026-04-23 02:48:12'),(41,9,'Tím Đậm','128GB',NULL,NULL,21990000.00,24990000.00,NULL,20,1,'2026-04-23 02:48:12'),(42,9,'Vàng','128GB',NULL,NULL,21990000.00,24990000.00,NULL,15,1,'2026-04-23 02:48:12'),(43,9,'Bạc','256GB',NULL,NULL,24490000.00,26990000.00,NULL,10,1,'2026-04-23 02:48:12'),(44,9,'Đen','256GB',NULL,NULL,24490000.00,26990000.00,NULL,8,1,'2026-04-23 02:48:12'),(45,9,'Tím Đậm','512GB',NULL,NULL,29990000.00,32990000.00,NULL,5,1,'2026-04-23 02:48:12'),(46,10,'Tím Đậm','128GB',NULL,NULL,20490000.00,22990000.00,NULL,30,1,'2026-04-23 02:48:12'),(47,10,'Vàng','128GB',NULL,NULL,20490000.00,22990000.00,NULL,25,1,'2026-04-23 02:48:12'),(48,10,'Bạc','256GB',NULL,NULL,22990000.00,24990000.00,NULL,15,1,'2026-04-23 02:48:12'),(49,10,'Đen','256GB',NULL,NULL,22990000.00,24990000.00,NULL,10,1,'2026-04-23 02:48:12'),(50,10,'Tím Đậm','512GB',NULL,NULL,26990000.00,28990000.00,NULL,5,1,'2026-04-23 02:48:12'),(51,11,'Xanh Dương','128GB',NULL,NULL,16990000.00,18990000.00,NULL,40,1,'2026-04-23 02:48:12'),(52,11,'Tím','128GB',NULL,NULL,16990000.00,18990000.00,NULL,35,1,'2026-04-23 02:48:12'),(53,11,'Vàng','128GB',NULL,NULL,16990000.00,18990000.00,NULL,30,1,'2026-04-23 02:48:12'),(54,11,'Đen','256GB',NULL,NULL,19490000.00,21490000.00,NULL,20,1,'2026-04-23 02:48:12'),(55,11,'Đỏ','256GB',NULL,NULL,19490000.00,21490000.00,NULL,10,1,'2026-04-23 02:48:12'),(56,12,'Trắng','128GB',NULL,NULL,13990000.00,15990000.00,NULL,60,1,'2026-04-23 02:48:12'),(57,12,'Đen','128GB',NULL,NULL,13990000.00,15990000.00,NULL,50,1,'2026-04-23 02:48:12'),(58,12,'Đỏ','128GB',NULL,NULL,13990000.00,15990000.00,NULL,40,1,'2026-04-23 02:48:12'),(59,12,'Tím','256GB',NULL,NULL,16990000.00,18990000.00,NULL,25,1,'2026-04-23 02:48:12'),(60,12,'Xanh Dương','256GB',NULL,NULL,16990000.00,18990000.00,NULL,20,1,'2026-04-23 02:48:12'),(61,13,'Hồng','128GB',NULL,NULL,12490000.00,14990000.00,NULL,100,1,'2026-04-23 02:48:12'),(62,13,'Xanh Dương','128GB',NULL,NULL,12490000.00,14990000.00,NULL,80,1,'2026-04-23 02:48:12'),(63,13,'Trắng','128GB',NULL,NULL,12490000.00,14990000.00,NULL,70,1,'2026-04-23 02:48:12'),(64,13,'Đen','256GB',NULL,NULL,14990000.00,16990000.00,NULL,40,1,'2026-04-23 02:48:12'),(65,13,'Đỏ','256GB',NULL,NULL,14990000.00,16990000.00,NULL,20,1,'2026-04-23 02:48:12'),(66,14,'Trắng','64GB',NULL,NULL,10490000.00,12990000.00,NULL,50,1,'2026-04-23 02:48:12'),(67,14,'Đen','64GB',NULL,NULL,10490000.00,12990000.00,NULL,45,1,'2026-04-23 02:48:12'),(68,14,'Xanh Dương','128GB',NULL,NULL,12490000.00,14990000.00,NULL,30,1,'2026-04-23 02:48:12'),(69,14,'Tím','128GB',NULL,NULL,12490000.00,14990000.00,NULL,20,1,'2026-04-23 02:48:12'),(70,14,'Xanh Lá','256GB',NULL,NULL,14990000.00,16990000.00,NULL,10,1,'2026-04-23 02:48:12'),(71,15,'Trắng','64GB',NULL,NULL,8490000.00,10990000.00,NULL,70,1,'2026-04-23 02:48:12'),(72,15,'Đen','64GB',NULL,NULL,8490000.00,10990000.00,NULL,65,1,'2026-04-23 02:48:12'),(73,15,'Vàng','128GB',NULL,NULL,9990000.00,11990000.00,NULL,40,1,'2026-04-23 02:48:12'),(74,15,'Đỏ','128GB',NULL,NULL,9990000.00,11990000.00,NULL,30,1,'2026-04-23 02:48:12'),(75,15,'Xanh','256GB',NULL,NULL,11990000.00,13990000.00,NULL,10,1,'2026-04-23 02:48:12');
/*!40000 ALTER TABLE `bienthesanpham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chitietthanhtoan`
--

DROP TABLE IF EXISTS `chitietthanhtoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chitietthanhtoan` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ThanhToanId` int NOT NULL,
  `SanPhamId` int NOT NULL,
  `BienTheId` int DEFAULT NULL,
  `TenSanPham` varchar(255) NOT NULL,
  `SoLuong` int NOT NULL,
  `DonGia` decimal(18,2) NOT NULL,
  `TenBaoHanh` varchar(255) DEFAULT NULL,
  `GiaBaoHanh` decimal(18,2) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_ChiTietThanhToan_ThanhToan` (`ThanhToanId`),
  KEY `FK_ChiTietThanhToan_SanPham` (`SanPhamId`),
  KEY `FK_ChiTietThanhToan_BienTheSanPham` (`BienTheId`),
  CONSTRAINT `FK_ChiTietThanhToan_BienTheSanPham` FOREIGN KEY (`BienTheId`) REFERENCES `bienthesanpham` (`BienTheId`),
  CONSTRAINT `FK_ChiTietThanhToan_SanPham` FOREIGN KEY (`SanPhamId`) REFERENCES `sanpham` (`SanPhamId`),
  CONSTRAINT `FK_ChiTietThanhToan_ThanhToan` FOREIGN KEY (`ThanhToanId`) REFERENCES `thanhtoan` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chitietthanhtoan`
--

LOCK TABLES `chitietthanhtoan` WRITE;
/*!40000 ALTER TABLE `chitietthanhtoan` DISABLE KEYS */;
/*!40000 ALTER TABLE `chitietthanhtoan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danhmuc`
--

DROP TABLE IF EXISTS `danhmuc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danhmuc` (
  `MaDanhMuc` int NOT NULL AUTO_INCREMENT,
  `TenDanhMuc` varchar(255) NOT NULL,
  `TrangThai` tinyint(1) NOT NULL,
  `NgayTao` datetime NOT NULL,
  PRIMARY KEY (`MaDanhMuc`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danhmuc`
--

LOCK TABLES `danhmuc` WRITE;
/*!40000 ALTER TABLE `danhmuc` DISABLE KEYS */;
INSERT INTO `danhmuc` VALUES (1,'iPhone',1,'2026-05-21 16:40:07'),(2,'MacBook',1,'2026-05-21 16:40:07'),(3,'AirPods',1,'2026-05-21 16:40:07'),(4,'Apple Watch',1,'2026-05-21 16:40:07');
/*!40000 ALTER TABLE `danhmuc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `giohang`
--

DROP TABLE IF EXISTS `giohang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `giohang` (
  `MaGioHang` int NOT NULL AUTO_INCREMENT,
  `MaNguoiDung` int NOT NULL,
  `BienTheId` int NOT NULL,
  `SoLuong` int NOT NULL,
  `NgayThem` datetime NOT NULL,
  `TenBaoHanh` varchar(255) DEFAULT NULL,
  `GiaBaoHanh` decimal(18,2) DEFAULT NULL,
  PRIMARY KEY (`MaGioHang`),
  KEY `FK_GioHang_User` (`MaNguoiDung`),
  KEY `FK_GioHang_BienTheSanPham` (`BienTheId`),
  CONSTRAINT `FK_GioHang_BienTheSanPham` FOREIGN KEY (`BienTheId`) REFERENCES `bienthesanpham` (`BienTheId`),
  CONSTRAINT `FK_GioHang_User` FOREIGN KEY (`MaNguoiDung`) REFERENCES `user` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `giohang`
--

LOCK TABLES `giohang` WRITE;
/*!40000 ALTER TABLE `giohang` DISABLE KEYS */;
/*!40000 ALTER TABLE `giohang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hinhanh`
--

DROP TABLE IF EXISTS `hinhanh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hinhanh` (
  `HinhAnhId` int NOT NULL AUTO_INCREMENT,
  `BienTheId` int NOT NULL,
  `UrlHinhAnh` text NOT NULL,
  `AnhIcon` text,
  `LaAnhChinh` tinyint(1) NOT NULL,
  `ThuTu` int NOT NULL,
  `NgayTao` datetime NOT NULL,
  PRIMARY KEY (`HinhAnhId`),
  KEY `FK_HinhAnh_BienTheSanPham` (`BienTheId`),
  CONSTRAINT `FK_HinhAnh_BienTheSanPham` FOREIGN KEY (`BienTheId`) REFERENCES `bienthesanpham` (`BienTheId`)
) ENGINE=InnoDB AUTO_INCREMENT=226 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hinhanh`
--

LOCK TABLES `hinhanh` WRITE;
/*!40000 ALTER TABLE `hinhanh` DISABLE KEYS */;
INSERT INTO `hinhanh` VALUES (1,1,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png',NULL,1,1,'2026-04-23 02:48:12'),(2,1,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max_1.png',NULL,0,2,'2026-04-23 02:48:12'),(3,1,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max_2.png',NULL,0,3,'2026-04-23 02:48:12'),(4,2,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-titan-den.png',NULL,1,1,'2026-04-23 02:48:12'),(5,2,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-titan-den_1.png',NULL,0,2,'2026-04-23 02:48:12'),(6,2,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-titan-den_2.png',NULL,0,3,'2026-04-23 02:48:12'),(7,3,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-titan-trang.png',NULL,1,1,'2026-04-23 02:48:12'),(8,3,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-titan-trang_1.png',NULL,0,2,'2026-04-23 02:48:12'),(9,3,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-titan-trang_2.png',NULL,0,3,'2026-04-23 02:48:12'),(10,4,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-titan-tu-nhien.png',NULL,1,1,'2026-04-23 02:48:12'),(11,4,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-titan-tu-nhien_1.png',NULL,0,2,'2026-04-23 02:48:12'),(12,4,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-titan-tu-nhien_2.png',NULL,0,3,'2026-04-23 02:48:12'),(13,5,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png',NULL,1,1,'2026-04-23 02:48:12'),(14,5,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max_1.png',NULL,0,2,'2026-04-23 02:48:12'),(15,5,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max_2.png',NULL,0,3,'2026-04-23 02:48:12'),(16,6,'https://cdn.tgdd.vn/Products/Images/42/329143/iphone-16-pro-titan-sa-mac.png',NULL,1,1,'2026-04-23 02:48:12'),(19,7,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-den.png',NULL,1,1,'2026-04-23 02:48:12'),(20,7,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-den_1.png',NULL,0,2,'2026-04-23 02:48:12'),(21,7,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-den_2.png',NULL,0,3,'2026-04-23 02:48:12'),(22,8,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-trang.png',NULL,1,1,'2026-04-23 02:48:12'),(23,8,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-trang_1.png',NULL,0,2,'2026-04-23 02:48:12'),(24,8,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-trang_2.png',NULL,0,3,'2026-04-23 02:48:12'),(25,9,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-tu-nhien.png',NULL,1,1,'2026-04-23 02:48:12'),(26,9,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-tu-nhien_1.png',NULL,0,2,'2026-04-23 02:48:12'),(27,9,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-tu-nhien_2.png',NULL,0,3,'2026-04-23 02:48:12'),(28,10,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-sa-mac.png',NULL,1,1,'2026-04-23 02:48:12'),(29,10,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-sa-mac_1.png',NULL,0,2,'2026-04-23 02:48:12'),(30,10,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-sa-mac_2.png',NULL,0,3,'2026-04-23 02:48:12'),(31,11,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-xanh-luu-ly.png',NULL,1,1,'2026-04-23 02:48:12'),(32,11,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-xanh-luu-ly_1.png',NULL,0,2,'2026-04-23 02:48:12'),(33,11,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-xanh-luu-ly_2.png',NULL,0,3,'2026-04-23 02:48:12'),(34,12,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-hong.png',NULL,1,1,'2026-04-23 02:48:12'),(35,12,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-hong_1.png',NULL,0,2,'2026-04-23 02:48:12'),(36,12,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-hong_2.png',NULL,0,3,'2026-04-23 02:48:12'),(37,13,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-xanh-luc-bao.png',NULL,1,1,'2026-04-23 02:48:12'),(38,13,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-xanh-luc-bao_1.png',NULL,0,2,'2026-04-23 02:48:12'),(39,13,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-xanh-luc-bao_2.png',NULL,0,3,'2026-04-23 02:48:12'),(40,14,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-den.png',NULL,1,1,'2026-04-23 02:48:12'),(41,14,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-den_1.png',NULL,0,2,'2026-04-23 02:48:12'),(42,14,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-den_2.png',NULL,0,3,'2026-04-23 02:48:12'),(43,15,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-trang.png',NULL,1,1,'2026-04-23 02:48:12'),(44,15,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-trang_1.png',NULL,0,2,'2026-04-23 02:48:12'),(45,15,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-plus-trang_2.png',NULL,0,3,'2026-04-23 02:48:12'),(46,16,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-xanh-luu-ly.png',NULL,1,1,'2026-04-23 02:48:12'),(47,16,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-xanh-luu-ly_1.png',NULL,0,2,'2026-04-23 02:48:12'),(48,16,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-xanh-luu-ly_2.png',NULL,0,3,'2026-04-23 02:48:12'),(49,17,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-hong.png',NULL,1,1,'2026-04-23 02:48:12'),(50,17,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-hong_1.png',NULL,0,2,'2026-04-23 02:48:12'),(51,17,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-hong_2.png',NULL,0,3,'2026-04-23 02:48:12'),(52,18,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-den.png',NULL,1,1,'2026-04-23 02:48:12'),(53,18,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-den_1.png',NULL,0,2,'2026-04-23 02:48:12'),(54,18,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-den_2.png',NULL,0,3,'2026-04-23 02:48:12'),(55,19,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-trang.png',NULL,1,1,'2026-04-23 02:48:12'),(56,19,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-trang_1.png',NULL,0,2,'2026-04-23 02:48:12'),(57,19,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-trang_2.png',NULL,0,3,'2026-04-23 02:48:12'),(58,20,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-xanh-luc-bao.png',NULL,1,1,'2026-04-23 02:48:12'),(59,20,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-xanh-luc-bao_1.png',NULL,0,2,'2026-04-23 02:48:12'),(60,20,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-xanh-luc-bao_2.png',NULL,0,3,'2026-04-23 02:48:12'),(61,21,'https://cdn.tgdd.vn/Products/Images/42/305660/iphone-15-pro-max-white-thumbnew-600x600.jpg',NULL,1,1,'2026-04-23 02:48:12'),(62,21,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-tu-nhien_1.png',NULL,0,2,'2026-04-23 02:48:12'),(63,21,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-tu-nhien_2.png',NULL,0,3,'2026-04-23 02:48:12'),(64,22,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-xanh.png',NULL,1,1,'2026-04-23 02:48:12'),(65,22,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-xanh_1.png',NULL,0,2,'2026-04-23 02:48:12'),(66,22,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-xanh_2.png',NULL,0,3,'2026-04-23 02:48:12'),(67,23,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-den.png',NULL,1,1,'2026-04-23 02:48:12'),(68,23,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-den_1.png',NULL,0,2,'2026-04-23 02:48:12'),(69,23,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-den_2.png',NULL,0,3,'2026-04-23 02:48:12'),(70,24,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-trang.png',NULL,1,1,'2026-04-23 02:48:12'),(71,24,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-trang_1.png',NULL,0,2,'2026-04-23 02:48:12'),(72,24,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-trang_2.png',NULL,0,3,'2026-04-23 02:48:12'),(73,25,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-tu-nhien.png',NULL,1,1,'2026-04-23 02:48:12'),(74,25,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-tu-nhien_1.png',NULL,0,2,'2026-04-23 02:48:12'),(75,25,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-tu-nhien_2.png',NULL,0,3,'2026-04-23 02:48:12'),(76,26,'https://cdn.tgdd.vn/Products/Images/42/303833/iphone-15-pro-blue-thumbnew-600x600.jpg',NULL,1,1,'2026-04-23 02:48:12'),(77,26,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-tu-nhien_1.png',NULL,0,2,'2026-04-23 02:48:12'),(78,26,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-tu-nhien_2.png',NULL,0,3,'2026-04-23 02:48:12'),(79,27,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-xanh.png',NULL,1,1,'2026-04-23 02:48:12'),(80,27,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-xanh_1.png',NULL,0,2,'2026-04-23 02:48:12'),(81,27,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-xanh_2.png',NULL,0,3,'2026-04-23 02:48:12'),(82,28,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-den.png',NULL,1,1,'2026-04-23 02:48:12'),(83,28,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-den_1.png',NULL,0,2,'2026-04-23 02:48:12'),(84,28,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-den_2.png',NULL,0,3,'2026-04-23 02:48:12'),(85,29,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-trang.png',NULL,1,1,'2026-04-23 02:48:12'),(86,29,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-trang_1.png',NULL,0,2,'2026-04-23 02:48:12'),(87,29,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-trang_2.png',NULL,0,3,'2026-04-23 02:48:12'),(88,30,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-tu-nhien.png',NULL,1,1,'2026-04-23 02:48:12'),(89,30,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-tu-nhien_1.png',NULL,0,2,'2026-04-23 02:48:12'),(90,30,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-tu-nhien_2.png',NULL,0,3,'2026-04-23 02:48:12'),(91,31,'https://cdn.tgdd.vn/Products/Images/42/303823/iphone-15-plus-hong-256gb-thumb-600x600.jpg',NULL,1,1,'2026-04-23 02:48:12'),(92,31,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-hong_1.png',NULL,0,2,'2026-04-23 02:48:12'),(93,31,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-hong_2.png',NULL,0,3,'2026-04-23 02:48:12'),(94,32,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-xanh.png',NULL,1,1,'2026-04-23 02:48:12'),(95,32,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-xanh_1.png',NULL,0,2,'2026-04-23 02:48:12'),(96,32,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-xanh_2.png',NULL,0,3,'2026-04-23 02:48:12'),(97,33,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-den.png',NULL,1,1,'2026-04-23 02:48:12'),(98,33,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-den_1.png',NULL,0,2,'2026-04-23 02:48:12'),(99,33,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-den_2.png',NULL,0,3,'2026-04-23 02:48:12'),(100,34,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-vang.png',NULL,1,1,'2026-04-23 02:48:12'),(101,34,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-vang_1.png',NULL,0,2,'2026-04-23 02:48:12'),(102,34,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-vang_2.png',NULL,0,3,'2026-04-23 02:48:12'),(103,35,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-xanh-duong.png',NULL,1,1,'2026-04-23 02:48:12'),(104,35,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-xanh-duong_1.png',NULL,0,2,'2026-04-23 02:48:12'),(105,35,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus-xanh-duong_2.png',NULL,0,3,'2026-04-23 02:48:12'),(106,36,'https://cdn.tgdd.vn/Products/Images/42/303812/iphone-15-hong-thumb-600x600.jpg',NULL,1,1,'2026-04-23 02:48:12'),(107,36,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-hong_1.png',NULL,0,2,'2026-04-23 02:48:12'),(108,36,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-hong_2.png',NULL,0,3,'2026-04-23 02:48:12'),(109,37,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-vang.png',NULL,1,1,'2026-04-23 02:48:12'),(110,37,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-vang_1.png',NULL,0,2,'2026-04-23 02:48:12'),(111,37,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-vang_2.png',NULL,0,3,'2026-04-23 02:48:12'),(112,38,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-xanh.png',NULL,1,1,'2026-04-23 02:48:12'),(113,38,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-xanh_1.png',NULL,0,2,'2026-04-23 02:48:12'),(114,38,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-xanh_2.png',NULL,0,3,'2026-04-23 02:48:12'),(115,39,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-den.png',NULL,1,1,'2026-04-23 02:48:12'),(116,39,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-den_1.png',NULL,0,2,'2026-04-23 02:48:12'),(117,39,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-den_2.png',NULL,0,3,'2026-04-23 02:48:12'),(118,40,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-xanh-duong.png',NULL,1,1,'2026-04-23 02:48:12'),(119,40,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-xanh-duong_1.png',NULL,0,2,'2026-04-23 02:48:12'),(120,40,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-xanh-duong_2.png',NULL,0,3,'2026-04-23 02:48:12'),(121,41,'https://cdn.tgdd.vn/Products/Images/42/251192/iphone-14-pro-max-tim-thumb-600x600.jpg',NULL,1,1,'2026-04-23 02:48:12'),(122,41,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-max-tim_1.png',NULL,0,2,'2026-04-23 02:48:12'),(123,41,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-max-tim_2.png',NULL,0,3,'2026-04-23 02:48:12'),(124,42,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-max-vang.png',NULL,1,1,'2026-04-23 02:48:12'),(125,42,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-max-vang_1.png',NULL,0,2,'2026-04-23 02:48:12'),(126,42,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-max-vang_2.png',NULL,0,3,'2026-04-23 02:48:12'),(127,43,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-max-bac.png',NULL,1,1,'2026-04-23 02:48:12'),(128,43,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-max-bac_1.png',NULL,0,2,'2026-04-23 02:48:12'),(129,43,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-max-bac_2.png',NULL,0,3,'2026-04-23 02:48:12'),(130,44,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-max-den.png',NULL,1,1,'2026-04-23 02:48:12'),(131,44,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-max-den_1.png',NULL,0,2,'2026-04-23 02:48:12'),(132,44,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-max-den_2.png',NULL,0,3,'2026-04-23 02:48:12'),(133,45,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-max-tim.png',NULL,1,1,'2026-04-23 02:48:12'),(134,45,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-max-tim_1.png',NULL,0,2,'2026-04-23 02:48:12'),(135,45,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-max-tim_2.png',NULL,0,3,'2026-04-23 02:48:12'),(136,46,'https://cdn.tgdd.vn/Products/Images/42/247508/iphone-14-pro-vang-thumb-600x600.jpg',NULL,1,1,'2026-04-23 02:48:12'),(137,46,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-tim_1.png',NULL,0,2,'2026-04-23 02:48:12'),(138,46,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-tim_2.png',NULL,0,3,'2026-04-23 02:48:12'),(139,47,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-vang.png',NULL,1,1,'2026-04-23 02:48:12'),(140,47,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-vang_1.png',NULL,0,2,'2026-04-23 02:48:12'),(141,47,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-vang_2.png',NULL,0,3,'2026-04-23 02:48:12'),(142,48,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-bac.png',NULL,1,1,'2026-04-23 02:48:12'),(143,48,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-bac_1.png',NULL,0,2,'2026-04-23 02:48:12'),(144,48,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-bac_2.png',NULL,0,3,'2026-04-23 02:48:12'),(145,49,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-den.png',NULL,1,1,'2026-04-23 02:48:12'),(146,49,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-den_1.png',NULL,0,2,'2026-04-23 02:48:12'),(147,49,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-den_2.png',NULL,0,3,'2026-04-23 02:48:12'),(148,50,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-tim.png',NULL,1,1,'2026-04-23 02:48:12'),(149,50,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-tim_1.png',NULL,0,2,'2026-04-23 02:48:12'),(150,50,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-pro-tim_2.png',NULL,0,3,'2026-04-23 02:48:12'),(151,51,'https://cdn.tgdd.vn/Products/Images/42/245545/iPhone-14-plus-thumb-xanh-1-600x600.jpg',NULL,1,1,'2026-04-23 02:48:12'),(152,51,'https://cdn.tgdd.vn/Products/Images/42/245545/iPhone-14-plus-thumb-xanh-1-600x600.jpg',NULL,0,2,'2026-04-23 02:48:12'),(153,51,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus-xanh_2.png',NULL,0,3,'2026-04-23 02:48:12'),(154,52,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus-tim.png',NULL,1,1,'2026-04-23 02:48:12'),(155,52,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus-tim_1.png',NULL,0,2,'2026-04-23 02:48:12'),(156,52,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus-tim_2.png',NULL,0,3,'2026-04-23 02:48:12'),(157,53,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus-vang.png',NULL,1,1,'2026-04-23 02:48:12'),(158,53,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus-vang_1.png',NULL,0,2,'2026-04-23 02:48:12'),(159,53,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus-vang_2.png',NULL,0,3,'2026-04-23 02:48:12'),(160,54,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus-den.png',NULL,1,1,'2026-04-23 02:48:12'),(161,54,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus-den_1.png',NULL,0,2,'2026-04-23 02:48:12'),(162,54,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus-den_2.png',NULL,0,3,'2026-04-23 02:48:12'),(163,55,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus-do.png',NULL,1,1,'2026-04-23 02:48:12'),(164,55,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus-do_1.png',NULL,0,2,'2026-04-23 02:48:12'),(165,55,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus-do_2.png',NULL,0,3,'2026-04-23 02:48:12'),(166,56,'https://cdn.tgdd.vn/Products/Images/42/240259/iPhone-14-plus-thumb-xanh-600x600.jpg',NULL,1,1,'2026-04-23 02:48:12'),(167,56,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-trang_1.png',NULL,0,2,'2026-04-23 02:48:12'),(168,56,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-trang_2.png',NULL,0,3,'2026-04-23 02:48:12'),(169,57,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-den.png',NULL,1,1,'2026-04-23 02:48:12'),(170,57,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-den_1.png',NULL,0,2,'2026-04-23 02:48:12'),(171,57,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-den_2.png',NULL,0,3,'2026-04-23 02:48:12'),(172,58,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-do.png',NULL,1,1,'2026-04-23 02:48:12'),(173,58,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-do_1.png',NULL,0,2,'2026-04-23 02:48:12'),(174,58,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-do_2.png',NULL,0,3,'2026-04-23 02:48:12'),(175,59,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-tim.png',NULL,1,1,'2026-04-23 02:48:12'),(176,59,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-tim_1.png',NULL,0,2,'2026-04-23 02:48:12'),(177,59,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-tim_2.png',NULL,0,3,'2026-04-23 02:48:12'),(178,60,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-xanh.png',NULL,1,1,'2026-04-23 02:48:12'),(179,60,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-xanh_1.png',NULL,0,2,'2026-04-23 02:48:12'),(180,60,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-xanh_2.png',NULL,0,3,'2026-04-23 02:48:12'),(181,61,'https://cdn.tgdd.vn/Products/Images/42/223602/iphone-13-midnight-2-600x600.jpg',NULL,1,1,'2026-04-23 02:48:12'),(182,61,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13-hong_1.png',NULL,0,2,'2026-04-23 02:48:12'),(183,61,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13-hong_2.png',NULL,0,3,'2026-04-23 02:48:12'),(184,62,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13-xanh-duong.png',NULL,1,1,'2026-04-23 02:48:12'),(185,62,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13-xanh-duong_1.png',NULL,0,2,'2026-04-23 02:48:12'),(186,62,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13-xanh-duong_2.png',NULL,0,3,'2026-04-23 02:48:12'),(187,63,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13-trang.png',NULL,1,1,'2026-04-23 02:48:12'),(188,63,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13-trang_1.png',NULL,0,2,'2026-04-23 02:48:12'),(189,63,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13-trang_2.png',NULL,0,3,'2026-04-23 02:48:12'),(190,64,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13-den.png',NULL,1,1,'2026-04-23 02:48:12'),(191,64,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13-den_1.png',NULL,0,2,'2026-04-23 02:48:12'),(192,64,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13-den_2.png',NULL,0,3,'2026-04-23 02:48:12'),(193,65,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13-do.png',NULL,1,1,'2026-04-23 02:48:12'),(194,65,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13-do_1.png',NULL,0,2,'2026-04-23 02:48:12'),(195,65,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-13-do_2.png',NULL,0,3,'2026-04-23 02:48:12'),(196,66,'https://cdn.tgdd.vn/Products/Images/42/213031/iphone-12-tim-1-600x600.jpg',NULL,1,1,'2026-04-23 02:48:12'),(197,66,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-trang_1.png',NULL,0,2,'2026-04-23 02:48:12'),(198,66,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-trang_2.png',NULL,0,3,'2026-04-23 02:48:12'),(199,67,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-den.png',NULL,1,1,'2026-04-23 02:48:12'),(200,67,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-den_1.png',NULL,0,2,'2026-04-23 02:48:12'),(201,67,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-den_2.png',NULL,0,3,'2026-04-23 02:48:12'),(202,68,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-xanh-duong.png',NULL,1,1,'2026-04-23 02:48:12'),(203,68,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-xanh-duong_1.png',NULL,0,2,'2026-04-23 02:48:12'),(204,68,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-xanh-duong_2.png',NULL,0,3,'2026-04-23 02:48:12'),(205,69,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-tim.png',NULL,1,1,'2026-04-23 02:48:12'),(206,69,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-tim_1.png',NULL,0,2,'2026-04-23 02:48:12'),(207,69,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-tim_2.png',NULL,0,3,'2026-04-23 02:48:12'),(208,70,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-xanh-la.png',NULL,1,1,'2026-04-23 02:48:12'),(209,70,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-xanh-la_1.png',NULL,0,2,'2026-04-23 02:48:12'),(210,70,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-12-xanh-la_2.png',NULL,0,3,'2026-04-23 02:48:12'),(211,71,'https://cdn.tgdd.vn/Products/Images/42/153856/iphone-11-trang-600x600.jpg',NULL,1,1,'2026-04-23 02:48:12'),(212,71,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-11-trang_1.png',NULL,0,2,'2026-04-23 02:48:12'),(213,71,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-11-trang_2.png',NULL,0,3,'2026-04-23 02:48:12'),(214,72,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-11-den.png',NULL,1,1,'2026-04-23 02:48:12'),(215,72,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-11-den_1.png',NULL,0,2,'2026-04-23 02:48:12'),(216,72,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-11-den_2.png',NULL,0,3,'2026-04-23 02:48:12'),(217,73,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-11-vang.png',NULL,1,1,'2026-04-23 02:48:12'),(218,73,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-11-vang_1.png',NULL,0,2,'2026-04-23 02:48:12'),(219,73,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-11-vang_2.png',NULL,0,3,'2026-04-23 02:48:12'),(220,74,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-11-do.png',NULL,1,1,'2026-04-23 02:48:12'),(221,74,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-11-do_1.png',NULL,0,2,'2026-04-23 02:48:12'),(222,74,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-11-do_2.png',NULL,0,3,'2026-04-23 02:48:12'),(223,75,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-11-xanh-la.png',NULL,1,1,'2026-04-23 02:48:12'),(224,75,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-11-xanh-la_1.png',NULL,0,2,'2026-04-23 02:48:12'),(225,75,'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-11-xanh-la_2.png',NULL,0,3,'2026-04-23 02:48:12');
/*!40000 ALTER TABLE `hinhanh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loaithongso`
--

DROP TABLE IF EXISTS `loaithongso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loaithongso` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TenLoai` varchar(255) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loaithongso`
--

LOCK TABLES `loaithongso` WRITE;
/*!40000 ALTER TABLE `loaithongso` DISABLE KEYS */;
INSERT INTO `loaithongso` VALUES (1,'Màn hình'),(2,'Camera sau'),(3,'Camera trước'),(4,'Hiệu năng'),(5,'Kết nối'),(6,'Lưu trữ'),(7,'Thiết kế'),(8,'Pin & Sạc'),(9,'Tính năng khác');
/*!40000 ALTER TABLE `loaithongso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phieugiamgia`
--

DROP TABLE IF EXISTS `phieugiamgia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phieugiamgia` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Ma` varchar(50) NOT NULL,
  `GiaTriGiam` decimal(18,2) NOT NULL,
  `LoaiGiam` varchar(50) NOT NULL,
  `DonHangToiThieu` decimal(18,2) DEFAULT NULL,
  `GiamToiDa` decimal(18,2) DEFAULT NULL,
  `SoLuong` int NOT NULL,
  `DaSuDung` int NOT NULL,
  `NgayBatDau` datetime NOT NULL,
  `NgayKetThuc` datetime NOT NULL,
  `TrangThai` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Ma` (`Ma`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phieugiamgia`
--

LOCK TABLES `phieugiamgia` WRITE;
/*!40000 ALTER TABLE `phieugiamgia` DISABLE KEYS */;
INSERT INTO `phieugiamgia` VALUES (1,'APPLE10',10.00,'PhanTram',500000.00,100000.00,100,11,'2026-04-01 00:00:00','2026-05-01 00:00:00',1),(2,'APPLE50K',50000.00,'Tien',300000.00,NULL,200,50,'2026-04-01 00:00:00','2026-06-01 00:00:00',1),(3,'APPLE20',20.00,'PhanTram',1000000.00,200000.00,50,6,'2026-04-10 00:00:00','2026-05-10 00:00:00',1),(4,'OLD10',10.00,'PhanTram',200000.00,50000.00,100,80,'2026-03-01 00:00:00','2026-03-30 00:00:00',0),(5,'VIP100K',100000.00,'Tien',2000000.00,NULL,20,2,'2026-04-01 00:00:00','2026-12-31 00:00:00',1);
/*!40000 ALTER TABLE `phieugiamgia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phieugiamgianguoidung`
--

DROP TABLE IF EXISTS `phieugiamgianguoidung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phieugiamgianguoidung` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `PhieuGiamGiaId` int NOT NULL,
  `UserId` int NOT NULL,
  `NgayNhan` datetime DEFAULT CURRENT_TIMESTAMP,
  `DaSuDung` tinyint(1) DEFAULT '0',
  `NgaySuDung` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_PhieuGiamGiaNguoiDung_PhieuGiamGia` (`PhieuGiamGiaId`),
  KEY `FK_PhieuGiamGiaNguoiDung_User` (`UserId`),
  CONSTRAINT `FK_PhieuGiamGiaNguoiDung_PhieuGiamGia` FOREIGN KEY (`PhieuGiamGiaId`) REFERENCES `phieugiamgia` (`Id`),
  CONSTRAINT `FK_PhieuGiamGiaNguoiDung_User` FOREIGN KEY (`UserId`) REFERENCES `user` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phieugiamgianguoidung`
--

LOCK TABLES `phieugiamgianguoidung` WRITE;
/*!40000 ALTER TABLE `phieugiamgianguoidung` DISABLE KEYS */;
/*!40000 ALTER TABLE `phieugiamgianguoidung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sanpham`
--

DROP TABLE IF EXISTS `sanpham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sanpham` (
  `SanPhamId` int NOT NULL AUTO_INCREMENT,
  `TenSanPham` varchar(255) NOT NULL,
  `ThuongHieu` varchar(255) NOT NULL,
  `MoTa` text,
  `TrangThai` tinyint(1) NOT NULL,
  `NgayTao` datetime NOT NULL,
  `MaDanhMuc` int NOT NULL,
  PRIMARY KEY (`SanPhamId`),
  KEY `FK_SanPham_DanhMuc` (`MaDanhMuc`),
  CONSTRAINT `FK_SanPham_DanhMuc` FOREIGN KEY (`MaDanhMuc`) REFERENCES `danhmuc` (`MaDanhMuc`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sanpham`
--

LOCK TABLES `sanpham` WRITE;
/*!40000 ALTER TABLE `sanpham` DISABLE KEYS */;
INSERT INTO `sanpham` VALUES (1,'iPhone 16 Pro Max','Apple','iPhone 16 Pro Max. Thiết kế Titan bền bỉ. Nút Camera Control. A18 Pro.',1,'2026-04-23 02:48:12',1),(2,'iPhone 16 Pro','Apple','Vẻ đẹp Titan. Chip A18 Pro mạnh mẽ. Điều khiển camera thông minh.',1,'2026-04-23 02:48:12',1),(3,'iPhone 16 Plus','Apple','Màn hình lớn. Pin cực lâu. Màu sắc rực rỡ. Chip A18 thông minh.',1,'2026-04-23 02:48:12',1),(4,'iPhone 16','Apple','Vừa vặn. Quyền năng. Camera Control mới. Chip A18 mạnh mẽ.',1,'2026-04-23 02:48:12',1),(5,'iPhone 15 Pro Max','Apple','Khung viền Titan. Chip A17 Pro. Camera Zoom 5x quang học.',1,'2026-04-23 02:48:12',1),(6,'iPhone 15 Pro','Apple','Vừa vặn. Sức mạnh Titan. Chip A17 Pro đỉnh cao.',1,'2026-04-23 02:48:12',1),(7,'iPhone 15 Plus','Apple','Màn hình lớn 6.7 inch. Pin dùng cả ngày. Cổng sạc USB-C hiện đại.',1,'2026-04-23 02:48:12',1),(8,'iPhone 15','Apple','Dynamic Island. Camera 48MP. Thiết kế mặt kính pha màu tuyệt đẹp.',1,'2026-04-23 02:48:12',1),(9,'iPhone 14 Pro Max','Apple','Màn hình Always-On. Dynamic Island. Camera 48MP siêu sắc nét.',1,'2026-04-23 02:48:12',1),(10,'iPhone 14 Pro','Apple','Gọn gàng. Siêu mạnh mẽ với Chip A16 Bionic và Dynamic Island.',1,'2026-04-23 02:48:12',1),(11,'iPhone 14 Plus','Apple','Màn hình lớn. Pin cực khủng. Thiết kế bền bỉ.',1,'2026-04-23 02:48:12',1),(12,'iPhone 14','Apple','Vẻ đẹp hiện đại. Camera chụp đêm xuất sắc. Pin dùng cả ngày.',1,'2026-04-23 02:48:12',1),(13,'iPhone 13','Apple','Biểu tượng vẻ đẹp. Camera chéo tinh tế. Pin bền bỉ.',1,'2026-04-23 02:48:12',1),(14,'iPhone 12','Apple','Thiết kế hoài cổ vuông vức. Màn hình OLED rực rỡ. Kết nối 5G.',1,'2026-04-23 02:48:12',1),(15,'iPhone 11','Apple','Camera kép góc rộng. Chế độ chụp đêm. Màu sắc cá tính.',1,'2026-04-23 02:48:12',1);
/*!40000 ALTER TABLE `sanpham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thanhtoan`
--

DROP TABLE IF EXISTS `thanhtoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thanhtoan` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `MaDonHang` varchar(255) NOT NULL,
  `NgayThanhToan` datetime DEFAULT CURRENT_TIMESTAMP,
  `TongTien` decimal(18,2) NOT NULL,
  `TrangThai` varchar(100) NOT NULL,
  `PhuongThucThanhToan` varchar(100) NOT NULL,
  `PhieuGiamGiaId` int DEFAULT NULL,
  `SoTienGiam` decimal(18,2) DEFAULT '0.00',
  `HoTen` varchar(255) NOT NULL,
  `SoDienThoai` varchar(20) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `TinhThanh` varchar(255) NOT NULL,
  `QuanHuyen` varchar(255) NOT NULL,
  `PhuongXa` varchar(255) NOT NULL,
  `DiaChiChiTiet` text NOT NULL,
  `GhiChu` text,
  `UserId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_ThanhToan_PhieuGiamGia` (`PhieuGiamGiaId`),
  KEY `FK_ThanhToan_User` (`UserId`),
  CONSTRAINT `FK_ThanhToan_PhieuGiamGia` FOREIGN KEY (`PhieuGiamGiaId`) REFERENCES `phieugiamgia` (`Id`),
  CONSTRAINT `FK_ThanhToan_User` FOREIGN KEY (`UserId`) REFERENCES `user` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thanhtoan`
--

LOCK TABLES `thanhtoan` WRITE;
/*!40000 ALTER TABLE `thanhtoan` DISABLE KEYS */;
/*!40000 ALTER TABLE `thanhtoan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thongsokythuat`
--

DROP TABLE IF EXISTS `thongsokythuat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thongsokythuat` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `SanPhamId` int NOT NULL,
  `LoaiThongSoId` int NOT NULL,
  `TenThongSo` varchar(255) NOT NULL,
  `GiaTri` text NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_ThongSoKyThuat_SanPham` (`SanPhamId`),
  KEY `FK_ThongSoKyThuat_LoaiThongSo` (`LoaiThongSoId`),
  CONSTRAINT `FK_ThongSoKyThuat_LoaiThongSo` FOREIGN KEY (`LoaiThongSoId`) REFERENCES `loaithongso` (`Id`),
  CONSTRAINT `FK_ThongSoKyThuat_SanPham` FOREIGN KEY (`SanPhamId`) REFERENCES `sanpham` (`SanPhamId`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thongsokythuat`
--

LOCK TABLES `thongsokythuat` WRITE;
/*!40000 ALTER TABLE `thongsokythuat` DISABLE KEYS */;
INSERT INTO `thongsokythuat` VALUES (1,1,1,'Công nghệ màn hình','LTPO Super Retina XDR OLED'),(2,1,1,'Kích thước màn hình','6.9 inch'),(3,1,1,'Độ phân giải','1320 x 2868 pixels'),(4,1,1,'Tần số quét','120Hz (ProMotion)'),(5,1,1,'Độ sáng tối đa','2000 nits (HBM)'),(6,1,2,'Camera chính','48 MP, f/1.8, 24mm (wide)'),(7,1,2,'Camera góc siêu rộng','48 MP, f/2.2, 13mm (ultrawide)'),(8,1,2,'Camera Tele','12 MP, f/2.8, 120mm (5x optical zoom)'),(9,1,2,'Quay phim','4K@120fps (Dolby Vision HDR)'),(10,1,3,'Độ phân giải','12 MP, f/1.9'),(11,1,3,'Tính năng','FaceID, HDR, Cinematic mode'),(12,1,4,'Chipset (CPU)','Apple A18 Pro (3 nm)'),(13,1,4,'Số nhân CPU','6-core'),(14,1,4,'Chip đồ họa (GPU)','Apple GPU (6-core graphics)'),(15,1,4,'RAM','8 GB'),(16,1,5,'Mạng di động','Hỗ trợ 5G'),(17,1,5,'SIM','1 Nano SIM & 1 eSIM'),(18,1,5,'Wifi','Wi-Fi 7 (802.11be)'),(19,1,5,'Bluetooth','v5.4'),(20,1,5,'Cổng kết nối','USB Type-C 3.0'),(21,1,6,'Bộ nhớ trong','256GB / 512GB / 1TB'),(22,1,6,'Thẻ nhớ ngoài','Không hỗ trợ'),(23,1,7,'Chất liệu khung','Titanium Grade 5'),(24,1,7,'Chất liệu mặt sau','Kính cường lực Ceramic Shield'),(25,1,7,'Trọng lượng','227 g'),(26,1,7,'Kháng nước, bụi','IP68 (sâu 6m trong 30p)'),(27,1,8,'Dung lượng pin','4676 mAh'),(28,1,8,'Công nghệ sạc','Sạc nhanh PD, MagSafe 25W'),(29,1,8,'Thời gian xem video','Lên đến 33 giờ'),(30,1,9,'Nút vật lý mới','Camera Control (Nút điều khiển camera)'),(31,1,9,'AI','Apple Intelligence'),(32,1,9,'Bảo mật','Face ID'),(33,2,1,'Công nghệ màn hình','LTPO Super Retina XDR OLED'),(34,2,1,'Kích thước màn hình','6.3 inch'),(35,2,1,'Độ phân giải','1206 x 2622 pixels'),(36,2,1,'Tần số quét','120Hz (ProMotion)'),(37,2,1,'Độ sáng tối đa','2000 nits (HBM)'),(38,2,2,'Camera chính','48 MP, f/1.8, 24mm (wide)'),(39,2,2,'Camera góc siêu rộng','48 MP, f/2.2, 13mm (ultrawide)'),(40,2,2,'Camera Tele','12 MP, f/2.8, 120mm (5x optical zoom)'),(41,2,2,'Quay phim','4K@120fps (Dolby Vision HDR)'),(42,2,3,'Độ phân giải','12 MP, f/1.9'),(43,2,3,'Tính năng','FaceID, HDR, Cinematic mode'),(44,2,4,'Chipset (CPU)','Apple A18 Pro (3 nm)'),(45,2,4,'Số nhân CPU','6-core'),(46,2,4,'Chip đồ họa (GPU)','Apple GPU (6-core graphics)'),(47,2,4,'RAM','8 GB'),(48,2,5,'Mạng di động','Hỗ trợ 5G'),(49,2,5,'SIM','1 Nano SIM & 1 eSIM'),(50,2,5,'Wifi','Wi-Fi 7 (802.11be)'),(51,2,5,'Bluetooth','v5.4'),(52,2,5,'Cổng kết nối','USB Type-C 3.0 (DisplayPort)'),(53,2,6,'Bộ nhớ trong','128GB / 256GB / 512GB / 1TB'),(54,2,6,'Thẻ nhớ ngoài','Không hỗ trợ'),(55,2,7,'Chất liệu khung','Titanium Grade 5'),(56,2,7,'Chất liệu mặt sau','Kính cường lực Ceramic Shield'),(57,2,7,'Trọng lượng','199 g'),(58,2,7,'Kháng nước, bụi','IP68'),(59,2,8,'Dung lượng pin','3582 mAh'),(60,2,8,'Công nghệ sạc','Sạc nhanh PD, MagSafe 25W'),(61,2,8,'Thời gian xem video','Lên đến 27 giờ'),(62,2,9,'Nút vật lý mới','Camera Control (Nút điều khiển camera)'),(63,2,9,'AI','Apple Intelligence'),(64,2,9,'Bảo mật','Face ID');
/*!40000 ALTER TABLE `thongsokythuat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `FullName` varchar(255) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Address` text,
  `Provider` varchar(100) DEFAULT NULL,
  `ProviderId` varchar(255) DEFAULT NULL,
  `IsProfileCompleted` tinyint(1) DEFAULT '0',
  `IsLocked` tinyint(1) DEFAULT '0',
  `NgaySinh` date DEFAULT NULL,
  `Sex` enum('Nam','Nu','Khac') DEFAULT NULL,
  `Hang` enum('Dong','Bac','Vang','KimCuong') DEFAULT 'Dong',
  `TongTienDaMua` decimal(18,2) DEFAULT '0.00',
  `PasswordLastUpdated` datetime DEFAULT NULL,
  `Role` varchar(50) DEFAULT 'Customer',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-21 16:50:07
