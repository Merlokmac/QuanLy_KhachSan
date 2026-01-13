const express = require("express");
const router = express.Router();

const datPhongController = require("../controllers/datphong.controller");
const { verifyLogin, adminOrLeTan } = require("../middleware/auth.middleware");

// Đặt phòng
router.post("/", verifyLogin, adminOrLeTan, datPhongController.createDatPhong);

// Danh sách đặt phòng
router.get("/", verifyLogin, adminOrLeTan, datPhongController.getAll);

// Huỷ đặt phòng
router.put("/:id/huy", verifyLogin, adminOrLeTan, datPhongController.huyDatPhong);

// Check-in
router.put("/:id/checkin", verifyLogin, adminOrLeTan, datPhongController.checkIn);

// Check-out
router.put("/:id/checkout", verifyLogin, adminOrLeTan, datPhongController.checkOut);

module.exports = router;
