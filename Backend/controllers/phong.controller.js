const { getPool, sql } = require('../config/db');

// ================= DANH SÁCH PHÒNG =================
exports.getAllPhong = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT 
        p.MaPhong,
        p.SoPhong,
        p.TrangThai,
        p.MaLoaiPhong,
        lp.TenLoaiPhong,
        lp.GiaPhong
      FROM Phong p
      JOIN LoaiPhong lp ON p.MaLoaiPhong = lp.MaLoaiPhong
      ORDER BY p.SoPhong
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= THÊM PHÒNG (ADMIN) =================
exports.createPhong = async (req, res) => {
  const { SoPhong, MaLoaiPhong } = req.body;

  if (!SoPhong || !MaLoaiPhong) {
    return res.status(400).json({ message: "Thiếu thông tin phòng" });
  }

  try {
    const pool = getPool();

    // Check trùng số phòng
    const check = await pool.request()
      .input('SoPhong', sql.NVarChar, SoPhong)
      .query(`SELECT 1 FROM Phong WHERE SoPhong = @SoPhong`);

    if (check.recordset.length > 0) {
      return res.status(400).json({ message: "Số phòng đã tồn tại" });
    }

    const idResult = await pool.request()
      .query(`SELECT ISNULL(MAX(MaPhong),0)+1 AS NewId FROM Phong`);

    const MaPhong = idResult.recordset[0].NewId;

    await pool.request()
      .input('MaPhong', sql.Int, MaPhong)
      .input('SoPhong', sql.NVarChar, SoPhong)
      .input('MaLoaiPhong', sql.Int, MaLoaiPhong)
      .query(`
        INSERT INTO Phong (MaPhong, SoPhong, TrangThai, MaLoaiPhong)
        VALUES (@MaPhong, @SoPhong, N'Trống', @MaLoaiPhong)
      `);

    res.json({ message: "Thêm phòng thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= CẬP NHẬT TRẠNG THÁI (ADMIN) =================
exports.updatePhong = async (req, res) => {
  const { MaPhong } = req.params;
  const { TrangThai } = req.body;

  if (!['Trống', 'Bảo trì'].includes(TrangThai)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
  }

  try {
    const pool = getPool();
    await pool.request()
      .input('MaPhong', sql.Int, MaPhong)
      .input('TrangThai', sql.NVarChar, TrangThai)
      .query(`
        UPDATE Phong
        SET TrangThai = @TrangThai
        WHERE MaPhong = @MaPhong
      `);

    res.json({ message: "Cập nhật phòng thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= XOÁ PHÒNG (ADMIN) =================
exports.deletePhong = async (req, res) => {
  const { MaPhong } = req.params;

  try {
    const pool = getPool();

    // Check ràng buộc
    const check = await pool.request()
      .input('MaPhong', sql.Int, MaPhong)
      .query(`
        SELECT 1 FROM DatPhong WHERE MaPhong = @MaPhong
      `);

    if (check.recordset.length > 0) {
      return res.status(400).json({
        message: "Không thể xoá phòng đã phát sinh đặt phòng"
      });
    }

    await pool.request()
      .input('MaPhong', sql.Int, MaPhong)
      .query(`DELETE FROM Phong WHERE MaPhong = @MaPhong`);

    res.json({ message: "Xóa phòng thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
