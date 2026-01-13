const express = require("express");
const router = express.Router();
const khachHangController = require("../controllers/khachhang.controller");
const { verifyLogin, adminOrLeTan, onlyAdmin } = require("../middleware/auth.middleware");

// Danh sách khách hàng
router.get("/", verifyLogin, adminOrLeTan, khachHangController.getAll);

// Thêm khách hàng
router.post("/", verifyLogin, adminOrLeTan, khachHangController.themKH);

// Xoá khách hàng (chỉ quản lý)
router.delete("/:id", verifyLogin, onlyAdmin, khachHangController.xoaKH);

module.exports = router;
