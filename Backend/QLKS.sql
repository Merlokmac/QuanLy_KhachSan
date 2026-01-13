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




