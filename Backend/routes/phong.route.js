const express = require('express');
const router = express.Router();
const phongController = require('../controllers/phong.controller');
const { verifyLogin, adminOrLeTan, onlyAdmin } = require('../middleware/auth.middleware');

// Danh sách phòng
router.get('/', verifyLogin, adminOrLeTan, phongController.getAllPhong);

// Thêm phòng (admin)
router.post('/', verifyLogin, onlyAdmin, phongController.createPhong);

// Cập nhật trạng thái phòng (admin)
router.put('/:MaPhong', verifyLogin, onlyAdmin, phongController.updatePhong);

// Xóa phòng (admin)
router.delete('/:MaPhong', verifyLogin, onlyAdmin, phongController.deletePhong);

module.exports = router;
