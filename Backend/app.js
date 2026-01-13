require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// ================= Middleware chung =================
app.use(cors());
app.use(express.json());

// ================= Routes =================
app.use("/api/auth", require("./routes/auth.route"));

// Phòng
app.use(
  "/api/phong",
  require("./middleware/auth.middleware").verifyLogin,
  require("./middleware/auth.middleware").adminOrLeTan,
  require("./routes/phong.route")
);

// Khách hàng
app.use(
  "/api/khachhang",
  require("./middleware/auth.middleware").verifyLogin,
  require("./middleware/auth.middleware").adminOrLeTan,
  require("./routes/khachhang.route")
);

// Đặt phòng
app.use(
  "/api/datphong",
  require("./middleware/auth.middleware").verifyLogin,
  require("./middleware/auth.middleware").adminOrLeTan,
  require("./routes/datphong.route")
);

// Dịch vụ
app.use(
  "/api/dichvu",
  require("./middleware/auth.middleware").verifyLogin,
  require("./middleware/auth.middleware").onlyAdmin,
  require("./routes/dichvu.route")
);

// Thống kê
app.use(
  "/api/thongke",
  require("./middleware/auth.middleware").verifyLogin,
  require("./middleware/auth.middleware").onlyAdmin,
  require("./routes/thongke.route")
);

// Khách online (không login)
app.post(
  "/api/khach-online/datphong",
  require("./controllers/datphong.controller").createDatPhong
);

// Health check
app.get("/", (req, res) => {
  res.send("QLKS Backend is running 🚀");
});

module.exports = app;
