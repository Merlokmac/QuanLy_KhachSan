const { getPool, sql } = require("../config/db");

// ================= KHÁCH / LỄ TÂN / ADMIN ĐẶT PHÒNG =================
const createDatPhong = async (req, res) => {
  const { MaPhong, MaKH, NgayNhan, NgayTra } = req.body;

  try {
    const pool = getPool();

    // 1. Kiểm tra trùng lịch
    const check = await pool
      .request()
      .input("MaPhong", sql.Int, MaPhong)
      .input("NgayNhan", sql.Date, NgayNhan)
      .input("NgayTra", sql.Date, NgayTra)
      .query(`
        SELECT 1 FROM DatPhong
        WHERE MaPhong = @MaPhong
        AND TrangThai <> N'Đã huỷ'
        AND NOT (
          NgayTra < @NgayNhan
          OR NgayNhan > @NgayTra
        )
      `);

    if (check.recordset.length > 0) {
      return res.status(400).json({
        message: "Phòng đã được đặt trong khoảng thời gian này",
      });
    }

    // 2. Thêm đặt phòng
    await pool
      .request()
      .input("MaPhong", sql.Int, MaPhong)
      .input("MaKH", sql.Int, MaKH)
      .input("NgayNhan", sql.Date, NgayNhan)
      .input("NgayTra", sql.Date, NgayTra)
      .query(`
        INSERT INTO DatPhong (MaPhong, MaKH, NgayNhan, NgayTra, TrangThai)
        VALUES (@MaPhong, @MaKH, @NgayNhan, @NgayTra, N'Đã đặt')
      `);

    res.json({ message: "Đặt phòng thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= ADMIN / LỄ TÂN =================
const getAll = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT 
        dp.MaDatPhong,
        dp.NgayNhan,
        dp.NgayTra,
        dp.TrangThai,
        kh.HoTen AS TenKhachHang,
        p.SoPhong
      FROM DatPhong dp
      JOIN KhachHang kh ON dp.MaKH = kh.MaKH
      JOIN Phong p ON dp.MaPhong = p.MaPhong
      ORDER BY dp.MaDatPhong DESC
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= HUỶ ĐẶT PHÒNG =================
const huyDatPhong = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = getPool();
    await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE DatPhong
        SET TrangThai = N'Đã huỷ'
        WHERE MaDatPhong = @id
      `);

    res.json({ message: "Huỷ đặt phòng thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= CHECK-IN =================
const checkIn = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = getPool();

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`SELECT MaPhong FROM DatPhong WHERE MaDatPhong = @id`);

    const maPhong = result.recordset[0].MaPhong;

    await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE DatPhong
        SET TrangThai = N'Đang ở'
        WHERE MaDatPhong = @id
      `);

    await pool
      .request()
      .input("MaPhong", sql.Int, maPhong)
      .query(`
        UPDATE Phong
        SET TrangThai = N'Đang ở'
        WHERE MaPhong = @MaPhong
      `);

    res.json({ message: "Check-in thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= CHECK-OUT =================
const checkOut = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = getPool();

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`SELECT MaPhong FROM DatPhong WHERE MaDatPhong = @id`);

    const maPhong = result.recordset[0].MaPhong;

    await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE DatPhong
        SET TrangThai = N'Hoàn thành'
        WHERE MaDatPhong = @id
      `);

    await pool
      .request()
      .input("MaPhong", sql.Int, maPhong)
      .query(`
        UPDATE Phong
        SET TrangThai = N'Trống'
        WHERE MaPhong = @MaPhong
      `);

    res.json({ message: "Check-out thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createDatPhong,
  getAll,
  huyDatPhong,
  checkIn,
  checkOut,
};
