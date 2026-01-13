const { getPool, sql } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "QLKS_SECRET_KEY";

exports.login = async (req, res) => {
  const { tenDangNhap, matKhau } = req.body;

  if (!tenDangNhap || !matKhau) {
    return res.status(400).json({ message: "Thiếu thông tin đăng nhập" });
  }

  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("TenDangNhap", sql.NVarChar, tenDangNhap)
      .query(`
        SELECT 
          tk.MaTaiKhoan,
          tk.MatKhau,
          vt.TenVaiTro
        FROM TaiKhoan tk
        JOIN VaiTro vt ON tk.MaVaiTro = vt.MaVaiTro
        WHERE tk.TenDangNhap = @TenDangNhap
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Sai tên đăng nhập" });
    }

    const user = result.recordset[0];

    const isMatch = await bcrypt.compare(matKhau, user.MatKhau);
    if (!isMatch) {
      return res.status(401).json({ message: "Sai mật khẩu" });
    }

    // 🔐 Tạo token
    const token = jwt.sign(
      {
        maTaiKhoan: user.MaTaiKhoan,
        vaiTro: user.TenVaiTro
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        maTaiKhoan: user.MaTaiKhoan,
        vaiTro: user.TenVaiTro
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
