const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');
const { authenticateToken, isAdmin, isAdminOrSelf } = require('../middleware/auth.middleware');

// ================= ACCOUNT MANAGEMENT (CHỈ ADMIN) =================

// Lấy tất cả tài khoản
router.get('/', authenticateToken, isAdmin, accountController.getAll);

// Lấy chi tiết tài khoản (Admin hoặc chính user đó)
router.get('/:id', authenticateToken, isAdminOrSelf, accountController.getById);

// Tạo tài khoản mới - chỉ cho nhân viên (Manager/Receptionist)
router.post('/', authenticateToken, isAdmin, accountController.create);

// Cập nhật thông tin tài khoản (Admin hoặc chính user đó)
router.put('/:id', authenticateToken, isAdminOrSelf, accountController.update);

// Xóa tài khoản
router.delete('/:id', authenticateToken, isAdmin, accountController.delete);

// Reset mật khẩu (Admin)
router.put('/:id/reset-password', authenticateToken, isAdmin, accountController.resetPassword);

// Kích hoạt/Vô hiệu hóa tài khoản
router.put('/:id/toggle-active', authenticateToken, isAdmin, accountController.toggleActive);

module.exports = router;