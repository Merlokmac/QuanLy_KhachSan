// Kiểm tra đã đăng nhập hay chưa
exports.verifyLogin = (req, res, next) => {
  const vaiTro = req.headers["x-role"];

  if (!vaiTro) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  req.vaiTro = vaiTro;
  next();
};

// Chỉ cho QUẢN LÝ
exports.onlyAdmin = (req, res, next) => {
  if (req.vaiTro !== "Quản lý") {
    return res.status(403).json({ message: "Chỉ quản lý mới được truy cập" });
  }
  next();
};

// Cho QUẢN LÝ + LỄ TÂN
exports.adminOrLeTan = (req, res, next) => {
  if (req.vaiTro !== "Quản lý" && req.vaiTro !== "Lễ tân") {
    return res.status(403).json({ message: "Không đủ quyền truy cập" });
  }
  next();
};
