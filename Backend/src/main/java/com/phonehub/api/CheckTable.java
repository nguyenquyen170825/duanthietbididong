package com.phonehub.api;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class CheckTable {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/duancuahangapple?useSSL=false&allowPublicKeyRetrieval=true";
        String user = "root";
        String pass = "1111";

        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {
            
            ResultSet rs = stmt.executeQuery("SHOW TABLES LIKE 'thongbao'");
            if (rs.next()) {
                System.out.println("TABLE_EXISTS");
            } else {
                System.out.println("TABLE_MISSING");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
