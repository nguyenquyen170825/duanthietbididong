package com.phonehub.api;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class CreateNotificationTable {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/duancuahangapple?useSSL=false&allowPublicKeyRetrieval=true";
        String user = "root";
        String pass = "1111";

        String sql = "CREATE TABLE IF NOT EXISTS `thongbao` (" +
            "`Id` int NOT NULL AUTO_INCREMENT, " +
            "`UserId` int DEFAULT NULL, " +
            "`OrderId` int DEFAULT NULL, " +
            "`Loai` varchar(50) NOT NULL, " +
            "`TieuDe` varchar(255) NOT NULL, " +
            "`NoiDung` text, " +
            "`DaDoc` bit(1) NOT NULL, " +
            "`NgayTao` datetime NOT NULL, " +
            "PRIMARY KEY (`Id`), " +
            "KEY `FK_ThongBao_User` (`UserId`), " +
            "KEY `FK_ThongBao_Order` (`OrderId`), " +
            "CONSTRAINT `FK_ThongBao_User` FOREIGN KEY (`UserId`) REFERENCES `user` (`Id`), " +
            "CONSTRAINT `FK_ThongBao_Order` FOREIGN KEY (`OrderId`) REFERENCES `thanhtoan` (`Id`)" +
            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {
            
            stmt.executeUpdate(sql);
            System.out.println("Table thongbao created successfully!");
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
