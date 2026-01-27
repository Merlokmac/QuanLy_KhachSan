const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

// ================= XÁC THỰC TOKEN =================
// Kiểm tra xem user đã đăng nhập chưa
const authenticateToken = (req, res, next) => {
  // Lấy token từ header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Không có token xác thực" });
  }

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // Lưu thông tin user vào request để dùng ở controller
    req.user = user;
    next();
  });
};

// ================= PHÂN QUYỀN =================

// Chỉ Admin (MaVaiTro = 1)
const isAdmin = (req, res, next) => {
  if (req.user.MaVaiTro !== 1) {
    return res.status(403).json({ message: "Chỉ Quản lý mới có quyền truy cập" });
  }
  next();
};

// Admin hoặc Lễ tân (MaVaiTro = 1 hoặc 2)
const isStaff = (req, res, next) => {
  if (![1, 2].includes(req.user.MaVaiTro)) {
    return res.status(403).json({ message: "Chỉ nhân viên mới có quyền truy cập" });
  }
  next();
};

// Chỉ Khách hàng (MaVaiTro = 3)
const isCustomer = (req, res, next) => {
  if (req.user.MaVaiTro !== 3) {
    return res.status(403).json({ message: "Chỉ khách hàng mới có quyền truy cập" });
  }
  next();
};

// Admin hoặc chính user đó
const isAdminOrSelf = (req, res, next) => {
  const requestedUserId = parseInt(req.params.id);
  
  if (req.user.MaVaiTro === 1 || req.user.MaTaiKhoan === requestedUserId) {
    return next();
  }
  
  return res.status(403).json({ message: "Bạn không có quyền truy cập" });
};

module.exports = {
  authenticateToken,
  isAdmin,
  isStaff,
  isCustomer,
  isAdminOrSelf
};