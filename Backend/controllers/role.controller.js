const { getPool, sql } = require("../config/db");

exports.getAll = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT RoleID, RoleName, Description
      FROM Role
      ORDER BY RoleID
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT RoleID, RoleName, Description
        FROM Role
        WHERE RoleID = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy vai trò" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const { RoleName, Description } = req.body;

  if (!RoleName) {
    return res.status(400).json({ message: "Thiếu tên vai trò" });
  }

  try {
    const pool = getPool();

    const checkResult = await pool.request()
      .input('RoleName', sql.NVarChar, RoleName)
      .query(`SELECT 1 FROM Role WHERE RoleName = @RoleName`);

    if (checkResult.recordset.length > 0) {
      return res.status(400).json({ message: "Tên vai trò đã tồn tại" });
    }

    const result = await pool.request()
      .input('RoleName', sql.NVarChar, RoleName)
      .input('Description', sql.NVarChar, Description || null)
      .query(`
        INSERT INTO Role (RoleName, Description)
        OUTPUT INSERTED.RoleID
        VALUES (@RoleName, @Description)
      `);

    const RoleID = result.recordset[0].RoleID;

    res.json({ 
      message: "Tạo vai trò thành công", 
      RoleID 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { RoleName, Description } = req.body;

  try {
    const pool = getPool();

    if (RoleName) {
      const checkResult = await pool.request()
        .input('RoleName', sql.NVarChar, RoleName)
        .input('id', sql.Int, id)
        .query(`
          SELECT 1 FROM Role 
          WHERE RoleName = @RoleName AND RoleID != @id
        `);

      if (checkResult.recordset.length > 0) {
        return res.status(400).json({ message: "Tên vai trò đã tồn tại" });
      }
    }

    await pool.request()
      .input('id', sql.Int, id)
      .input('RoleName', sql.NVarChar, RoleName)
      .input('Description', sql.NVarChar, Description)
      .query(`
        UPDATE Role
        SET RoleName = @RoleName, Description = @Description
        WHERE RoleID = @id
      `);

    res.json({ message: "Cập nhật vai trò thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = getPool();

    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT COUNT(*) AS Total
        FROM Account
        WHERE RoleID = @id
      `);

    if (checkResult.recordset[0].Total > 0) {
      return res.status(400).json({
        message: "Không thể xóa vai trò đang được sử dụng"
      });
    }

    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM Role WHERE RoleID = @id`);

    res.json({ message: "Xóa vai trò thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};