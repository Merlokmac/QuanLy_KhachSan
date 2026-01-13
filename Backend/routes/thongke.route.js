const express = require('express');
const router = express.Router();
const thongKeController = require('../controllers/thongke.controller');
const { verifyLogin, onlyAdmin } = require('../middleware/auth.middleware');

// Doanh thu theo tháng (chỉ quản lý)
router.get(
  '/doanh-thu-thang',
  verifyLogin,
  onlyAdmin,
  thongKeController.getDoanhThuTheoThang
);

module.exports = router;
