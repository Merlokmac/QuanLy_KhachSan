-- USE master;
-- GO

-- IF EXISTS (SELECT name FROM sys.databases WHERE name = N'QuanLyKhachSan')
-- BEGIN
--     ALTER DATABASE QuanLyKhachSan SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
--     DROP DATABASE QuanLyKhachSan;
-- END
-- GO

-- CREATE DATABASE QuanLyKhachSan;
-- GO

USE QuanLyKhachSan;
GO

-- CREATE TABLE VaiTro (
--     MaVaiTro INT PRIMARY KEY,
--     TenVaiTro NVARCHAR(50) NOT NULL
-- );

-- CREATE TABLE TaiKhoan (
--     MaTaiKhoan INT PRIMARY KEY,
--     TenDangNhap NVARCHAR(50) UNIQUE NOT NULL,
--     MatKhau NVARCHAR(255) NOT NULL,
--     MaVaiTro INT,
--     FOREIGN KEY (MaVaiTro) REFERENCES VaiTro(MaVaiTro)
-- );

-- CREATE TABLE NhanVien (
--     MaNhanVien INT PRIMARY KEY,
--     HoTen NVARCHAR(100),
--     SoDienThoai NVARCHAR(20),
--     MaTaiKhoan INT,
--     FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
-- );

-- CREATE TABLE KhachHang (
--     MaKhachHang INT PRIMARY KEY,
--     HoTen NVARCHAR(100),
--     CCCD NVARCHAR(20) UNIQUE,
--     SoDienThoai NVARCHAR(20)
-- );

-- CREATE TABLE LoaiPhong (
--     MaLoaiPhong INT PRIMARY KEY,
--     TenLoaiPhong NVARCHAR(50),
--     GiaPhong FLOAT
-- );

-- CREATE TABLE Phong (
--     MaPhong INT PRIMARY KEY,
--     SoPhong NVARCHAR(10),
--     TrangThai NVARCHAR(30),
--     MaLoaiPhong INT,
--     FOREIGN KEY (MaLoaiPhong) REFERENCES LoaiPhong(MaLoaiPhong)
-- );

-- CREATE TABLE DatPhong (
--     MaDatPhong INT PRIMARY KEY,
--     MaPhong INT,
--     MaKhachHang INT,
--     NgayNhan DATE,
--     NgayTra DATE,
--     FOREIGN KEY (MaPhong) REFERENCES Phong(MaPhong),
--     FOREIGN KEY (MaKhachHang) REFERENCES KhachHang(MaKhachHang)
-- );

-- CREATE TABLE DichVu (
--     MaDichVu INT PRIMARY KEY,
--     TenDichVu NVARCHAR(100),
--     Gia FLOAT
-- );

-- CREATE TABLE SuDungDichVu (
--     MaSDDV INT PRIMARY KEY,
--     MaDatPhong INT,
--     MaDichVu INT,
--     SoLuong INT,
--     FOREIGN KEY (MaDatPhong) REFERENCES DatPhong(MaDatPhong),
--     FOREIGN KEY (MaDichVu) REFERENCES DichVu(MaDichVu)
-- );

-- CREATE TABLE HoaDon (
--     MaHoaDon INT PRIMARY KEY,
--     MaDatPhong INT,
--     TongTien FLOAT,
--     NgayLap DATE,
--     FOREIGN KEY (MaDatPhong) REFERENCES DatPhong(MaDatPhong)
-- );


-- INSERT INTO VaiTro (MaVaiTro, TenVaiTro) VALUES
-- (1, N'Quản lý'),
-- (2, N'Lễ tân');

-- INSERT INTO TaiKhoan (MaTaiKhoan, TenDangNhap, MatKhau, MaVaiTro) VALUES
-- (1, 'admin', '123456', 1),   -- Quản lý
-- (2, 'letan1', '123456', 2),
-- (3, 'letan2', '123456', 2);

-- INSERT INTO NhanVien (MaNhanVien, HoTen, SoDienThoai, MaTaiKhoan) VALUES
-- (1, N'Nguyễn Văn Quản Lý', '0909000001', 1),
-- (2, N'Trần Thị Lễ Tân', '0909000002', 2),
-- (3, N'Lê Văn Lễ Tân', '0909000003', 3);

-- INSERT INTO KhachHang (MaKhachHang, HoTen, CCCD, SoDienThoai) VALUES
-- (1, N'Phạm Minh Tuấn', '079201001234', '0912345678'),
-- (2, N'Nguyễn Thị Hồng', '079201004321', '0987654321'),
-- (3, N'Lê Quốc Bảo', '079201009876', '0901122334'),
-- (4, N'Lê Hoàng Nam', '079201007654', '0933445566'),
-- (5, N'Đặng Thu Trang', '079201003333', '0977665544');

-- INSERT INTO LoaiPhong (MaLoaiPhong, TenLoaiPhong, GiaPhong) VALUES
-- (1, N'Phòng đơn', 500000),
-- (2, N'Phòng đôi', 800000),
-- (3, N'Phòng VIP', 1500000);

-- INSERT INTO Phong (MaPhong, SoPhong, TrangThai, MaLoaiPhong) VALUES
-- (1, '101', N'Trống', 1),
-- (2, '102', N'Đang ở', 1),
-- (3, '201', N'Trống', 2),
-- (4, '202', N'Đang ở', 2),
-- (5, '301', N'Bảo trì', 3),
-- (6, '302', N'Trống', 3);

-- INSERT INTO DatPhong (MaDatPhong, MaPhong, MaKhachHang, NgayNhan, NgayTra) VALUES
-- (1, 2, 1, '2025-01-05', '2025-01-07'),
-- (2, 4, 2, '2025-01-10', '2025-01-12'),
-- (3, 2, 3, '2025-02-01', '2025-02-03'),
-- (4, 6, 4, '2025-02-15', '2025-02-18'),
-- (5, 3, 5, '2025-03-01', '2025-03-05');

-- INSERT INTO DichVu (MaDichVu, TenDichVu, Gia) VALUES
-- (1, N'Ăn sáng', 50000),
-- (2, N'Giặt ủi', 30000),
-- (3, N'Thuê xe máy', 150000),
-- (4, N'Dọn phòng', 70000);

-- INSERT INTO SuDungDichVu (MaSDDV, MaDatPhong, MaDichVu, SoLuong) VALUES
-- (1, 1, 1, 2),
-- (2, 1, 2, 1),
-- (3, 2, 1, 2),
-- (4, 3, 3, 1),
-- (5, 4, 4, 2),
-- (6, 5, 1, 4);

-- INSERT INTO HoaDon (MaHoaDon, MaDatPhong, TongTien, NgayLap) VALUES
-- (1, 1, 1100000, '2025-01-07'),
-- (2, 2, 1700000, '2025-01-12'),
-- (3, 3, 900000, '2025-02-03'),
-- (4, 4, 3200000, '2025-02-18'),
-- (5, 5, 2200000, '2025-03-05');



-- ===============================================
-- CẬP NHẬT DATABASE CHO HỆ THỐNG QUẢN LÝ KHÁCH SẠN
-- ===============================================

-- -- 1. Thêm vai trò Khách hàng
-- INSERT INTO VaiTro (MaVaiTro, TenVaiTro) 
-- VALUES (3, N'Khách hàng');
-- GO

-- -- 2. Cập nhật bảng KhachHang - thêm liên kết tài khoản
-- ALTER TABLE KhachHang 
-- ADD MaTaiKhoan INT NULL,
--     Email NVARCHAR(100) NULL,
--     DiaChi NVARCHAR(255) NULL;
-- GO

-- ALTER TABLE KhachHang 
-- ADD CONSTRAINT FK_KhachHang_TaiKhoan 
-- FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan);
-- GO

-- -- 3. Cập nhật bảng DatPhong - thêm trạng thái
-- ALTER TABLE DatPhong 
-- ADD TrangThai NVARCHAR(30) DEFAULT N'Chờ xác nhận',
--     GhiChu NVARCHAR(500) NULL,
--     NgayDat DATETIME DEFAULT GETDATE();
-- GO

-- -- 4. Cập nhật bảng HoaDon - thêm thông tin thanh toán
-- ALTER TABLE HoaDon 
-- ADD TrangThaiThanhToan NVARCHAR(30) DEFAULT N'Chưa thanh toán',
--     PhuongThucThanhToan NVARCHAR(50) NULL,
--     NgayThanhToan DATETIME NULL,
--     GhiChu NVARCHAR(500) NULL;
-- GO

-- -- 5. Thêm ràng buộc CHECK cho trạng thái
-- ALTER TABLE DatPhong 
-- ADD CONSTRAINT CK_DatPhong_TrangThai 
-- CHECK (TrangThai IN (N'Chờ xác nhận', N'Đã xác nhận', N'Đang ở', N'Hoàn thành', N'Đã hủy'));
-- GO

-- ALTER TABLE HoaDon 
-- ADD CONSTRAINT CK_HoaDon_TrangThaiThanhToan 
-- CHECK (TrangThaiThanhToan IN (N'Chưa thanh toán', N'Đã thanh toán', N'Đã hủy'));
-- GO

-- ALTER TABLE HoaDon 
-- ADD CONSTRAINT CK_HoaDon_PhuongThucThanhToan 
-- CHECK (PhuongThucThanhToan IN (N'Tiền mặt', N'Chuyển khoản', N'Thẻ', NULL));
-- GO

-- -- 6. Tạo index để tăng hiệu suất truy vấn
-- CREATE INDEX IX_DatPhong_TrangThai ON DatPhong(TrangThai);
-- CREATE INDEX IX_DatPhong_NgayNhan ON DatPhong(NgayNhan);
-- CREATE INDEX IX_HoaDon_TrangThaiThanhToan ON HoaDon(TrangThaiThanhToan);
-- CREATE INDEX IX_KhachHang_MaTaiKhoan ON KhachHang(MaTaiKhoan);
-- GO

-- -- 7. Cập nhật dữ liệu mẫu cho các bản ghi hiện có
-- UPDATE DatPhong 
-- SET TrangThai = N'Đang ở' 
-- WHERE NgayNhan <= GETDATE() AND NgayTra >= GETDATE();

-- UPDATE DatPhong 
-- SET TrangThai = N'Hoàn thành' 
-- WHERE NgayTra < GETDATE();

-- UPDATE DatPhong 
-- SET TrangThai = N'Đã xác nhận' 
-- WHERE NgayNhan > GETDATE() AND TrangThai IS NULL;
-- GO

-- -- 8. Thêm dữ liệu mẫu tài khoản khách hàng (cho testing)
-- INSERT INTO TaiKhoan (MaTaiKhoan, TenDangNhap, MatKhau, MaVaiTro) 
-- VALUES 
-- (4, 'khach1', '123456', 3),
-- (5, 'khach2', '123456', 3);
-- GO

-- -- Liên kết với khách hàng hiện có
-- UPDATE KhachHang SET MaTaiKhoan = 4 WHERE MaKhachHang = 1;
-- UPDATE KhachHang SET MaTaiKhoan = 5 WHERE MaKhachHang = 2;
-- GO

-- -- Hash password '123456' = $2b$10$XYi1FzSB88lH.1ss7Vy5iu8sezLZL8a65fGgf6kD8rcL0pyWi7/TC

UPDATE TaiKhoan
SET MatKhau = '123456'
WHERE TenDangNhap = 'admin';