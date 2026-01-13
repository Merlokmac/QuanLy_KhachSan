const { getPool, sql } = require("../config/db");

// ================= GET ALL =================
exports.getAll = async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(
      "SELECT * FROM KhachHang ORDER BY MaKhachHang DESC"
    );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= CREATE =================
exports.themKH = async (req, res) => {
  const { HoTen, CCCD, SoDienThoai } = req.body;

  if (!HoTen || !CCCD) {
    return res.status(400).json({ message: "Thiếu thông tin khách hàng" });
  }

  try {
    const pool = await getPool();

    const idResult = await pool.request().query(`
      SELECT ISNULL(MAX(MaKhachHang),0)+1 AS NewId FROM KhachHang
    `);

    const MaKhachHang = idResult.recordset[0].NewId;

    await pool
      .request()
      .input("MaKhachHang", sql.Int, MaKhachHang)
      .input("HoTen", sql.NVarChar, HoTen)
      .input("CCCD", sql.NVarChar, CCCD)
      .input("SoDienThoai", sql.NVarChar, SoDienThoai)
      .query(`
        INSERT INTO KhachHang (MaKhachHang, HoTen, CCCD, SoDienThoai)
        VALUES (@MaKhachHang, @HoTen, @CCCD, @SoDienThoai)
      `);

    res.json({ message: "Thêm khách hàng thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE =================
exports.xoaKH = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getPool();

    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM KhachHang WHERE MaKhachHang = @id");

    res.json({ message: "Xoá khách hàng thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
