const express = require('express');
const router = express.Router();
const dichVuController = require('../controllers/dichvu.controller');
const { verifyLogin, adminOrLeTan, onlyAdmin } = require('../middleware/auth.middleware');

// Danh sách dịch vụ (Quản lý + Lễ tân)
router.get('/', verifyLogin, adminOrLeTan, dichVuController.getAllDichVu);

// Thêm dịch vụ (Chỉ quản lý)
router.post('/', verifyLogin, onlyAdmin, dichVuController.createDichVu);

module.exports = router;
