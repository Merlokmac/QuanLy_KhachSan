-- USE master;
-- GO

-- IF EXISTS (SELECT name FROM sys.databases WHERE name = N'hotel_mng_db')
-- BEGIN
--     ALTER DATABASE hotel_mng_db SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
--     DROP DATABASE hotel_mng_db;
-- END
-- GO

-- create database hotel_mng_db

use hotel_mng_db

-- ==========================================
-- ROLES & AUTHENTICATION
-- ==========================================
-- CREATE TABLE Role (
--     RoleID INT IDENTITY(1,1) PRIMARY KEY,
--     RoleName NVARCHAR(50) NOT NULL UNIQUE,
--     Description NVARCHAR(255)
-- );

-- CREATE TABLE Account (
--     AccountID INT IDENTITY(1,1) PRIMARY KEY,
--     Username NVARCHAR(50) UNIQUE NOT NULL,
--     Password NVARCHAR(255) NOT NULL,
--     RoleID INT NOT NULL,
--     IsActive BIT DEFAULT 1,
--     CreatedDate DATETIME DEFAULT GETDATE(),
--     FOREIGN KEY (RoleID) REFERENCES Role(RoleID)
-- );

-- -- ==========================================
-- -- EMPLOYEE MANAGEMENT
-- -- ==========================================
-- CREATE TABLE Employee (
--     EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
--     FullName NVARCHAR(100) NOT NULL,
--     PhoneNumber NVARCHAR(20),
--     Email NVARCHAR(100),
--     AccountID INT UNIQUE,
--     HireDate DATE,
--     IsActive BIT DEFAULT 1,
--     FOREIGN KEY (AccountID) REFERENCES Account(AccountID)
-- );

-- -- ==========================================
-- -- CUSTOMER MANAGEMENT (UC006-UC009)
-- -- ==========================================
-- CREATE TABLE Customer (
--     CustomerID INT IDENTITY(1,1) PRIMARY KEY,
--     FullName NVARCHAR(100) NOT NULL,
--     IDCardNumber NVARCHAR(20) UNIQUE, -- CCCD/CMND
--     PhoneNumber NVARCHAR(20) NOT NULL,
--     Email NVARCHAR(100),
--     DateOfBirth DATE,
--     Address NVARCHAR(255),
--     AccountID INT NULL, -- NULL nếu khách không đăng ký tài khoản
--     CreatedDate DATETIME DEFAULT GETDATE(),
--     CreatedByEmployeeID INT, -- Lễ tân tạo (UC005, UC006)
--     FOREIGN KEY (AccountID) REFERENCES Account(AccountID),
--     FOREIGN KEY (CreatedByEmployeeID) REFERENCES Employee(EmployeeID)
-- );

-- -- ==========================================
-- -- ROOM MANAGEMENT (UC010-UC013)
-- -- ==========================================
-- CREATE TABLE RoomType (
--     RoomTypeID INT IDENTITY(1,1) PRIMARY KEY,
--     TypeName NVARCHAR(50) NOT NULL,
--     BasePrice DECIMAL(18,2) NOT NULL,
--     Capacity INT NOT NULL, -- Sức chứa (UC013)
--     Description NVARCHAR(500),
--     ImageURL NVARCHAR(255)
-- );

-- CREATE TABLE Room (
--     RoomID INT IDENTITY(1,1) PRIMARY KEY,
--     RoomNumber NVARCHAR(10) UNIQUE NOT NULL,
--     RoomTypeID INT NOT NULL,
--     FloorNumber INT,
--     Status NVARCHAR(30) NOT NULL DEFAULT 'Available', 
--     -- Available, Occupied, Reserved, Maintenance, Cleaning
--     Description NVARCHAR(500), -- Mô tả chi tiết (UC011)
--     LastUpdated DATETIME DEFAULT GETDATE(),
--     FOREIGN KEY (RoomTypeID) REFERENCES RoomType(RoomTypeID)
-- );

-- -- ==========================================
-- -- BOOKING MANAGEMENT (UC018, UC019)
-- -- ==========================================
-- CREATE TABLE Booking (
--     BookingID INT IDENTITY(1,1) PRIMARY KEY,
--     RoomID INT NOT NULL,
--     CustomerID INT NOT NULL,
--     CheckInDate DATE NOT NULL,
--     CheckOutDate DATE NOT NULL,
--     BookingDate DATETIME DEFAULT GETDATE(),
--     Status NVARCHAR(30) NOT NULL DEFAULT 'Pending',
--     -- Pending, Confirmed, CheckedIn, CheckedOut, Cancelled, Completed
--     NumberOfGuests INT,
--     SpecialRequests NVARCHAR(500),
--     TotalRoomCharge DECIMAL(18,2), -- Tổng tiền phòng
--     CreatedByEmployeeID INT, -- Nhân viên tạo booking (UC001)
--     CancelledDate DATETIME NULL, -- Ngày hủy (UC018)
--     CancelReason NVARCHAR(500) NULL,
--     FOREIGN KEY (RoomID) REFERENCES Room(RoomID),
--     FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
--     FOREIGN KEY (CreatedByEmployeeID) REFERENCES Employee(EmployeeID)
-- );

-- -- ==========================================
-- -- SERVICE MANAGEMENT (UC014-UC017)
-- -- ==========================================
-- CREATE TABLE Service (
--     ServiceID INT IDENTITY(1,1) PRIMARY KEY,
--     ServiceName NVARCHAR(100) NOT NULL,
--     Price DECIMAL(18,2) NOT NULL,
--     Unit NVARCHAR(20), -- Đơn vị tính (phần, giờ, lần...)
--     Description NVARCHAR(500),
--     IsActive BIT DEFAULT 1
-- );

-- CREATE TABLE BookingService (
--     BookingServiceID INT IDENTITY(1,1) PRIMARY KEY,
--     BookingID INT NOT NULL,
--     ServiceID INT NOT NULL,
--     Quantity INT NOT NULL DEFAULT 1,
--     UnitPrice DECIMAL(18,2) NOT NULL, -- Giá tại thời điểm sử dụng
--     TotalPrice DECIMAL(18,2) NOT NULL,
--     UsageDate DATETIME DEFAULT GETDATE(),
--     AddedByEmployeeID INT, -- Nhân viên thêm dịch vụ
--     FOREIGN KEY (BookingID) REFERENCES Booking(BookingID),
--     FOREIGN KEY (ServiceID) REFERENCES Service(ServiceID),
--     FOREIGN KEY (AddedByEmployeeID) REFERENCES Employee(EmployeeID)
-- );

-- -- ==========================================
-- -- INVOICE MANAGEMENT (UC019, UC020, UC021)
-- -- ==========================================
-- CREATE TABLE Invoice (
--     InvoiceID INT IDENTITY(1,1) PRIMARY KEY,
--     BookingID INT NOT NULL UNIQUE,
--     InvoiceNumber NVARCHAR(20) UNIQUE NOT NULL, -- Mã hóa đơn (VD: HD001)
--     IssueDate DATETIME DEFAULT GETDATE(),
    
--     -- Chi tiết tính toán
--     RoomCharge DECIMAL(18,2) NOT NULL,
--     ServiceCharge DECIMAL(18,2) DEFAULT 0,
--     TotalAmount DECIMAL(18,2) NOT NULL,
--     TaxAmount DECIMAL(18,2) DEFAULT 0,
--     Discount DECIMAL(18,2) DEFAULT 0,
--     FinalAmount DECIMAL(18,2) NOT NULL,
    
--     -- Thanh toán
--     PaymentMethod NVARCHAR(50), -- Cash, Card, Transfer, E-Wallet
--     PaymentStatus NVARCHAR(30) DEFAULT 'Unpaid', -- Unpaid, Paid, Partial
--     PaidAmount DECIMAL(18,2) DEFAULT 0,
--     PaymentDate DATETIME NULL,
    
--     -- Người xử lý
--     CreatedByEmployeeID INT NOT NULL, -- Nhân viên lập hóa đơn (UC019)
    
--     Notes NVARCHAR(500),
    
--     FOREIGN KEY (BookingID) REFERENCES Booking(BookingID),
--     FOREIGN KEY (CreatedByEmployeeID) REFERENCES Employee(EmployeeID)
-- );

-- -- ==========================================
-- -- REVENUE REPORTING (UC021)
-- -- ==========================================
-- CREATE TABLE RevenueReport (
--     ReportID INT IDENTITY(1,1) PRIMARY KEY,
--     ReportDate DATE NOT NULL,
--     ReportType NVARCHAR(50), -- Daily, Monthly, Yearly
--     TotalRevenue DECIMAL(18,2),
--     RoomRevenue DECIMAL(18,2),
--     ServiceRevenue DECIMAL(18,2),
--     TotalBookings INT,
--     GeneratedByEmployeeID INT,
--     GeneratedDate DATETIME DEFAULT GETDATE(),
--     FOREIGN KEY (GeneratedByEmployeeID) REFERENCES Employee(EmployeeID)
-- );

-- -- ==========================================
-- -- INSERT SAMPLE DATA
-- -- ==========================================

-- -- 1. ROLES (Quản lý, Lễ tân, Nhân viên)
-- INSERT INTO Role (RoleName, Description) VALUES
-- (N'Manager', N'Quản lý khách sạn - toàn quyền'),
-- (N'Receptionist', N'Lễ tân - quản lý đặt phòng và khách hàng'),
-- (N'Staff', N'Nhân viên - xử lý dịch vụ');
update Role
set Description = N'Khách hàng đặt online'
where RoleName = N'Customer'
select * from Role

-- -- 2. ACCOUNTS
-- INSERT INTO Account (Username, Password, RoleID, IsActive, CreatedDate) VALUES
-- ('admin', '123456', 1, 1, '2024-01-01'),
-- ('letanA', '123456', 2, 1, '2024-01-05'),
-- ('letanB', '123456', 2, 1, '2024-01-10'),
-- ('nhanvien1', '111111', 3, 1, '2024-01-15'),
-- ('nhanvien2', '111111', 3, 1, '2024-01-20'),
-- -- Tài khoản cho khách hàng online
-- ('customer_online1', 'hashed_password_cus1', 2, 1, '2024-11-01'),
-- ('customer_online2', 'hashed_password_cus2', 2, 1, '2024-11-15'),
-- ('customer_online3', 'hashed_password_cus3', 2, 1, '2024-12-01');

-- -- 3. EMPLOYEES
-- INSERT INTO Employee (FullName, PhoneNumber, Email, AccountID, HireDate, IsActive) VALUES
-- (N'Nguyễn Văn Quản', '0901234567', 'quan.manager@hotel.com', 1, '2024-01-01', 1),
-- (N'Trần Thị Lan', '0902345678', 'lan.receptionist@hotel.com', 2, '2024-01-05', 1),
-- (N'Lê Văn Bình', '0903456789', 'binh.receptionist@hotel.com', 3, '2024-01-10', 1),
-- (N'Phạm Thị Hoa', '0904567890', 'hoa.staff@hotel.com', 4, '2024-01-15', 1),
-- (N'Hoàng Văn Nam', '0905678901', 'nam.staff@hotel.com', 5, '2024-01-20', 1);

-- -- 4. CUSTOMERS
-- -- Khách hàng đặt trực tiếp tại quầy (có CreatedByEmployeeID)
-- INSERT INTO Customer (FullName, IDCardNumber, PhoneNumber, Email, DateOfBirth, Address, AccountID, CreatedDate, CreatedByEmployeeID) VALUES
-- (N'Đỗ Minh Tuấn', '001234567890', '0911111111', 'tuan.do@gmail.com', '1990-05-15', N'Hà Nội', NULL, '2025-01-10', 2),
-- (N'Vũ Thị Mai', '001234567891', '0912222222', 'mai.vu@gmail.com', '1992-08-20', N'Hồ Chí Minh', NULL, '2025-01-12', 2),
-- (N'Bùi Văn Hùng', '001234567892', '0913333333', 'hung.bui@gmail.com', '1988-03-10', N'Đà Nẵng', NULL, '2025-01-15', 3),
-- (N'Đinh Thị Lan', '001234567893', '0914444444', 'lan.dinh@gmail.com', '1995-11-25', N'Hải Phòng', NULL, '2025-01-18', 3),
-- (N'Trương Văn Đức', '001234567894', '0915555555', 'duc.truong@gmail.com', '1987-07-30', N'Cần Thơ', NULL, '2025-01-20', 2),

-- -- Khách hàng đặt online (CreatedByEmployeeID = NULL, có AccountID)
-- (N'Ngô Thị Hương', '001234567895', '0916666666', 'huong.ngo@gmail.com', '1993-09-12', N'Hà Nội', 6, '2024-11-01', NULL),
-- (N'Phan Văn Kiên', '001234567896', '0917777777', 'kien.phan@gmail.com', '1991-04-18', N'Hồ Chí Minh', 7, '2024-11-15', NULL),
-- (N'Lý Thị Nga', '001234567897', '0918888888', 'nga.ly@gmail.com', '1994-12-05', N'Nha Trang', 8, '2024-12-01', NULL),

-- -- Khách hàng đặt online nhưng chưa có booking
-- (N'Cao Văn Long', '001234567898', '0919999999', 'long.cao@gmail.com', '1989-06-22', N'Huế', NULL, '2025-01-22', NULL),
-- (N'Đặng Thị Tâm', '001234567899', '0910000000', 'tam.dang@gmail.com', '1996-02-14', N'Vinh', NULL, '2025-01-23', NULL);

-- -- 5. ROOM TYPES
-- INSERT INTO RoomType (TypeName, BasePrice, Capacity, Description, ImageURL) VALUES
-- (N'Standard Single', 500000, 1, N'Phòng đơn tiêu chuẩn, 1 giường đơn, 20m²', 'images/standard-single.jpg'),
-- (N'Standard Double', 700000, 2, N'Phòng đôi tiêu chuẩn, 1 giường đôi, 25m²', 'images/standard-double.jpg'),
-- (N'Deluxe Double', 1000000, 2, N'Phòng đôi cao cấp, view đẹp, 30m²', 'images/deluxe-double.jpg'),
-- (N'Family Suite', 1500000, 4, N'Phòng gia đình, 2 giường đôi, 45m²', 'images/family-suite.jpg'),
-- (N'VIP Suite', 2500000, 2, N'Phòng VIP, jacuzzi, ban công, 60m²', 'images/vip-suite.jpg');

-- -- 6. ROOMS
-- INSERT INTO Room (RoomNumber, RoomTypeID, FloorNumber, Status, Description) VALUES
-- -- Tầng 1
-- ('101', 1, 1, 'Available', N'Phòng đơn tầng 1, gần sảnh'),
-- ('102', 1, 1, 'Available', N'Phòng đơn tầng 1, view vườn'),
-- ('103', 2, 1, 'Occupied', N'Phòng đôi tầng 1, view hồ bơi'),
-- ('104', 2, 1, 'Available', N'Phòng đôi tầng 1'),

-- -- Tầng 2
-- ('201', 2, 2, 'Reserved', N'Phòng đôi tầng 2, view phố'),
-- ('202', 3, 2, 'Available', N'Phòng deluxe tầng 2, view đẹp'),
-- ('203', 3, 2, 'Occupied', N'Phòng deluxe tầng 2, có ban công'),
-- ('204', 4, 2, 'Available', N'Phòng gia đình tầng 2'),

-- -- Tầng 3
-- ('301', 3, 3, 'Cleaning', N'Phòng deluxe tầng 3, đang dọn dẹp'),
-- ('302', 4, 3, 'Available', N'Phòng gia đình tầng 3, rộng rãi'),
-- ('303', 5, 3, 'Reserved', N'Phòng VIP tầng 3, view toàn cảnh'),
-- ('304', 5, 3, 'Available', N'Phòng VIP tầng 3, có jacuzzi'),

-- -- Tầng 4
-- ('401', 2, 4, 'Maintenance', N'Phòng đôi tầng 4, đang bảo trì'),
-- ('402', 3, 4, 'Available', N'Phòng deluxe tầng 4'),
-- ('403', 4, 4, 'Available', N'Phòng gia đình tầng 4');

-- -- 7. BOOKINGS
-- INSERT INTO Booking (RoomID, CustomerID, CheckInDate, CheckOutDate, BookingDate, Status, NumberOfGuests, SpecialRequests, TotalRoomCharge, CreatedByEmployeeID, CancelledDate, CancelReason) VALUES
-- -- Booking đã hoàn thành
-- (1, 1, '2025-01-10', '2025-01-12', '2025-01-09 14:30:00', 'Completed', 1, N'Phòng không hút thuốc', 1000000, 2, NULL, NULL),
-- (2, 2, '2025-01-12', '2025-01-15', '2025-01-11 10:20:00', 'Completed', 1, NULL, 1500000, 2, NULL, NULL),

-- -- Booking đang ở (CheckedIn)
-- (3, 3, '2025-01-20', '2025-01-25', '2025-01-18 16:45:00', 'CheckedIn', 2, N'Cần thêm gối', 3500000, 3, NULL, NULL),
-- (7, 4, '2025-01-22', '2025-01-28', '2025-01-20 09:15:00', 'CheckedIn', 2, N'Tầng cao', 6000000, 3, NULL, NULL),

-- -- Booking đã đặt chờ nhận phòng (Confirmed/Reserved)
-- (5, 5, '2025-01-27', '2025-01-30', '2025-01-25 11:30:00', 'Confirmed', 2, NULL, 2100000, 2, NULL, NULL),
-- (11, 6, '2025-01-28', '2025-02-01', '2024-11-01 20:00:00', 'Confirmed', 2, N'Yêu cầu view đẹp', 10000000, NULL, NULL, NULL),

-- -- Booking online (không có CreatedByEmployeeID)
-- (4, 7, '2025-02-01', '2025-02-05', '2024-11-15 22:30:00', 'Confirmed', 2, N'Honeymoon package', 2800000, NULL, NULL, NULL),
-- (10, 8, '2025-02-05', '2025-02-08', '2024-12-01 19:45:00', 'Confirmed', 4, N'Có trẻ em', 4500000, NULL, NULL, NULL),

-- -- Booking đã hủy
-- (8, 5, '2025-01-15', '2025-01-17', '2025-01-10 08:00:00', 'Cancelled', 4, NULL, 3000000, 2, '2025-01-14 10:00:00', N'Khách thay đổi kế hoạch'),
-- (12, 6, '2025-01-18', '2025-01-20', '2024-11-01 15:00:00', 'Cancelled', 2, NULL, 5000000, NULL, '2025-01-17 14:30:00', N'Công tác bị hủy');

-- -- 8. SERVICES
-- INSERT INTO Service (ServiceName, Price, Unit, Description, IsActive) VALUES
-- (N'Ăn sáng buffet', 150000, N'phần', N'Buffet sáng từ 6h-10h', 1),
-- (N'Giặt ủi', 50000, N'kg', N'Giặt ủi quần áo, giao trong 24h', 1),
-- (N'Massage', 300000, N'giờ', N'Dịch vụ massage thư giãn', 1),
-- (N'Đưa đón sân bay', 500000, N'lượt', N'Xe 7 chỗ đưa đón sân bay', 1),
-- (N'Thuê xe máy', 150000, N'ngày', N'Thuê xe máy tự lái', 1),
-- (N'Minibar', 100000, N'phần', N'Nước uống và snack trong phòng', 1),
-- (N'Spa trọn gói', 800000, N'gói', N'Gói spa 3 giờ cao cấp', 1),
-- (N'Ăn tối set menu', 250000, N'set', N'Set menu ăn tối 3 món', 1);

-- -- 9. BOOKING SERVICES
-- INSERT INTO BookingService (BookingID, ServiceID, Quantity, UnitPrice, TotalPrice, UsageDate, AddedByEmployeeID) VALUES
-- -- Services cho booking đã hoàn thành (BookingID 1, 2)
-- (1, 1, 2, 150000, 300000, '2025-01-11 07:00:00', 4),
-- (1, 6, 1, 100000, 100000, '2025-01-11 20:00:00', 4),

-- (2, 1, 3, 150000, 450000, '2025-01-13 07:30:00', 4),
-- (2, 2, 2, 50000, 100000, '2025-01-13 10:00:00', 4),
-- (2, 5, 1, 150000, 150000, '2025-01-13 09:00:00', 4),

-- -- Services cho booking đang ở (BookingID 3, 4)
-- (3, 1, 4, 150000, 600000, '2025-01-21 07:00:00', 4),
-- (3, 1, 4, 150000, 600000, '2025-01-22 07:00:00', 5),
-- (3, 3, 2, 300000, 600000, '2025-01-22 15:00:00', 5),
-- (3, 6, 2, 100000, 200000, '2025-01-22 19:00:00', 4),

-- (4, 1, 4, 150000, 600000, '2025-01-23 07:00:00', 4),
-- (4, 1, 4, 150000, 600000, '2025-01-24 07:00:00', 4),
-- (4, 8, 2, 250000, 500000, '2025-01-23 19:00:00', 5),
-- (4, 4, 1, 500000, 500000, '2025-01-22 08:00:00', 4),
-- (4, 7, 1, 800000, 800000, '2025-01-23 14:00:00', 5);

-- -- 10. INVOICES
-- INSERT INTO Invoice (BookingID, InvoiceNumber, IssueDate, RoomCharge, ServiceCharge, TotalAmount, TaxAmount, Discount, FinalAmount, PaymentMethod, PaymentStatus, PaidAmount, PaymentDate, CreatedByEmployeeID, Notes) VALUES
-- -- Hóa đơn đã thanh toán (Completed bookings)
-- (1, 'INV-2025-001', '2025-01-12 11:00:00', 1000000, 400000, 1400000, 140000, 0, 1540000, 'Cash', 'Paid', 1540000, '2025-01-12 11:00:00', 2, N'Thanh toán tiền mặt khi check-out'),

-- (2, 'INV-2025-002', '2025-01-15 10:30:00', 1500000, 700000, 2200000, 220000, 100000, 2320000, 'Card', 'Paid', 2320000, '2025-01-15 10:30:00', 2, N'Thanh toán thẻ Visa, khách hàng thân thiết giảm 100k'),

-- -- Hóa đơn chưa thanh toán (Current bookings)
-- (3, 'INV-2025-003', '2025-01-25 12:00:00', 3500000, 2000000, 5500000, 550000, 0, 6050000, NULL, 'Unpaid', 0, NULL, 2, N'Chờ khách check-out để thanh toán'),

-- (4, 'INV-2025-004', '2025-01-28 12:00:00', 6000000, 3000000, 9000000, 900000, 200000, 9700000, NULL, 'Unpaid', 0, NULL, 3, N'VIP khách hàng, giảm 200k'),

-- -- Hóa đơn đã hủy (Cancelled bookings) - có thể có phí hủy
-- (9, 'INV-2025-005', '2025-01-14 10:30:00', 3000000, 0, 300000, 0, 0, 300000, 'Transfer', 'Paid', 300000, '2025-01-14 10:30:00', 2, N'Phí hủy phòng 10%, đã hoàn lại 90%');

-- -- 11. REVENUE REPORTS
-- INSERT INTO RevenueReport (ReportDate, ReportType, TotalRevenue, RoomRevenue, ServiceRevenue, TotalBookings, GeneratedByEmployeeID, GeneratedDate) VALUES
-- -- Báo cáo ngày
-- ('2025-01-12', 'Daily', 1540000, 1000000, 400000, 1, 1, '2025-01-12 23:00:00'),
-- ('2025-01-15', 'Daily', 2320000, 1500000, 700000, 1, 1, '2025-01-15 23:00:00'),

-- -- Báo cáo tuần
-- ('2025-01-19', 'Weekly', 3860000, 2500000, 1100000, 2, 1, '2025-01-19 23:00:00'),

-- -- Báo cáo tháng 1
-- ('2025-01-31', 'Monthly', 15000000, 10000000, 4000000, 8, 1, '2025-01-26 10:00:00');

select * from Account