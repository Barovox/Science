-- ============================================================
-- Script khởi tạo database QLKHCN
-- Chạy tự động khi SQL Server container khởi động lần đầu
-- ============================================================

-- Tạo database nếu chưa tồn tại
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'QLKHCN_Data_Api_9_UEF')
BEGIN
    CREATE DATABASE [QLKHCN_Data_Api_9_UEF];
    PRINT 'Database QLKHCN_Data_Api_9_UEF created successfully.';
END
ELSE
BEGIN
    PRINT 'Database QLKHCN_Data_Api_9_UEF already exists.';
END
GO

-- (Tuỳ chọn) Import dữ liệu từ file SQL nếu cần
-- Đặt file .sql vào thư mục docker/sqlserver/init/
-- và uncomment dòng dưới đây:
-- :r /docker-entrypoint-initdb.d/KHCN_20260722.sql
