const { getPool, sql } = require("../config/db");

exports.taoHoaDon = async (req, res) => {
  const { MaDatPhong } = req.body;

  try {
    const pool = getPool();

    // 1. Lấy thông tin đặt phòng + loại phòng
    const info = await pool.request()
      .input("MaDatPhong", sql.Int, MaDatPhong)
      .query(`
        SELECT 
          dp.NgayNhan, dp.NgayTra,
          lp.GiaPhong
        FROM DatPhong dp
        JOIN Phong p ON dp.MaPhong = p.MaPhong
        JOIN LoaiPhong lp ON p.MaLoaiPhong = lp.MaLoaiPhong
        WHERE dp.MaDatPhong = @MaDatPhong
      `);

    if (info.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đặt phòng" });
    }

    const { NgayNhan, NgayTra, GiaPhong } = info.recordset[0];

    const soNgay =
      Math.ceil((new Date(NgayTra) - new Date(NgayNhan)) / (1000 * 60 * 60 * 24));

    const tienPhong = soNgay * GiaPhong;

    // 2. Tính tiền dịch vụ
    const dv = await pool.request()
      .input("MaDatPhong", sql.Int, MaDatPhong)
      .query(`
        SELECT SUM(dv.Gia * sd.SoLuong) AS TienDichVu
        FROM SuDungDichVu sd
        JOIN DichVu dv ON sd.MaDichVu = dv.MaDichVu
        WHERE sd.MaDatPhong = @MaDatPhong
      `);

    const tienDichVu = dv.recordset[0].TienDichVu || 0;
    const tongTien = tienPhong + tienDichVu;

    // 3. Tạo mã hóa đơn
    const idResult = await pool.request()
      .query(`SELECT ISNULL(MAX(MaHoaDon),0)+1 AS NewId FROM HoaDon`);

    const MaHoaDon = idResult.recordset[0].NewId;

    // 4. Insert hóa đơn
    await pool.request()
      .input("MaHoaDon", sql.Int, MaHoaDon)
      .input("MaDatPhong", sql.Int, MaDatPhong)
      .input("TongTien", sql.Float, tongTien)
      .input("NgayLap", sql.Date, new Date())
      .query(`
        INSERT INTO HoaDon (MaHoaDon, MaDatPhong, TongTien, NgayLap)
        VALUES (@MaHoaDon, @MaDatPhong, @TongTien, @NgayLap)
      `);

    res.json({
      message: "Tạo hóa đơn thành công",
      tongTien,
      tienPhong,
      tienDichVu
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
