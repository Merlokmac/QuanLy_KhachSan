const express = require("express");
const router = express.Router();
const hoaDonController = require("../controllers/hoadon.controller");
const { verifyLogin, adminOrLeTan } = require("../middleware/auth.middleware");

router.post("/", verifyLogin, adminOrLeTan, hoaDonController.taoHoaDon);

module.exports = router;
