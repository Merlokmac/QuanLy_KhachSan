const { getPool, sql } = require('../config/db');

// ================= DOANH THU THEO THÁNG =================
exports.getDoanhThuTheoThang = async (req, res) => {
  const { year } = req.query;

  if (!year) {
    return res.status(400).json({ message: "Thiếu tham số năm" });
  }

  try {
    const pool = getPool();
    const result = await pool.request()
      .input('Year', sql.Int, year)
      .query(`
        SELECT 
          MONTH(NgayLap) AS Thang,
          SUM(TongTien) AS DoanhThu
        FROM HoaDon
        WHERE YEAR(NgayLap) = @Year
        GROUP BY MONTH(NgayLap)
        ORDER BY Thang
      `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
