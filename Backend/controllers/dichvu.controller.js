const { getPool, sql } = require('../config/db');

// ================= DANH SÁCH DỊCH VỤ =================
exports.getAllDichVu = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT MaDichVu, TenDichVu, Gia
      FROM DichVu
      ORDER BY MaDichVu DESC
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= THÊM DỊCH VỤ =================
exports.createDichVu = async (req, res) => {
  const { TenDichVu, Gia } = req.body;

  if (!TenDichVu || !Gia) {
    return res.status(400).json({ message: "Thiếu thông tin dịch vụ" });
  }

  try {
    const pool = getPool();

    const idResult = await pool.request()
      .query(`SELECT ISNULL(MAX(MaDichVu), 0) + 1 AS NewId FROM DichVu`);

    const MaDichVu = idResult.recordset[0].NewId;

    await pool.request()
      .input('MaDichVu', sql.Int, MaDichVu)
      .input('TenDichVu', sql.NVarChar, TenDichVu)
      .input('Gia', sql.Float, Gia)
      .query(`
        INSERT INTO DichVu (MaDichVu, TenDichVu, Gia)
        VALUES (@MaDichVu, @TenDichVu, @Gia)
      `);

    res.json({ message: "Thêm dịch vụ thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
