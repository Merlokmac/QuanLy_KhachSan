const { getPool, sql } = require("../config/db");

exports.getAll = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT 
        a.AccountID,
        a.Username,
        a.RoleID,
        r.RoleName,
        a.IsActive,
        a.CreatedDate,
        e.EmployeeID,
        e.FullName AS EmployeeName,
        e.PhoneNumber AS EmployeePhone,
        c.CustomerID,
        c.FullName AS CustomerName,
        c.PhoneNumber AS CustomerPhone
      FROM Account a
      JOIN Role r ON a.RoleID = r.RoleID
      LEFT JOIN Employee e ON a.AccountID = e.AccountID
      LEFT JOIN Customer c ON a.AccountID = c.AccountID
      ORDER BY a.CreatedDate DESC
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= CHI TIẾT TÀI KHOẢN =================
exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT 
          a.AccountID,
          a.Username,
          a.RoleID,
          r.RoleName,
          a.IsActive,
          a.CreatedDate,
          e.EmployeeID,
          e.FullName AS EmployeeName,
          e.PhoneNumber AS EmployeePhone,
          e.Email AS EmployeeEmail,
          c.CustomerID,
          c.FullName AS CustomerName,
          c.PhoneNumber AS CustomerPhone,
          c.Email AS CustomerEmail
        FROM Account a
        JOIN Role r ON a.RoleID = r.RoleID
        LEFT JOIN Employee e ON a.AccountID = e.AccountID
        LEFT JOIN Customer c ON a.AccountID = c.AccountID
        WHERE a.AccountID = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= TẠO TÀI KHOẢN (ADMIN - CHỈ CHO NHÂN VIÊN) =================
exports.create = async (req, res) => {
  const { Username, Password, RoleID, FullName, PhoneNumber, Email } = req.body;

  if (!Username || !Password || !RoleID) {
    return res.status(400).json({ message: "Thiếu thông tin tài khoản" });
  }

  // Chỉ cho phép tạo tài khoản Manager và Receptionist
  // Giả sử: Manager = RoleID 1, Receptionist = RoleID 2
  if (![1, 2].includes(RoleID)) {
    return res.status(400).json({ message: "Chỉ được tạo tài khoản cho nhân viên" });
  }

  try {
    const pool = getPool();

    // Kiểm tra trùng username
    const checkUser = await pool.request()
      .input('Username', sql.NVarChar, Username)
      .query(`SELECT 1 FROM Account WHERE Username = @Username`);

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
    }

    // Tạo Account
    const accountResult = await pool.request()
      .input('Username', sql.NVarChar, Username)
      .input('Password', sql.NVarChar, Password)
      .input('RoleID', sql.Int, RoleID)
      .query(`
        INSERT INTO Account (Username, Password, RoleID)
        OUTPUT INSERTED.AccountID
        VALUES (@Username, @Password, @RoleID)
      `);

    const AccountID = accountResult.recordset[0].AccountID;

    // Tạo Employee
    if (FullName) {
      await pool.request()
        .input('FullName', sql.NVarChar, FullName)
        .input('PhoneNumber', sql.NVarChar, PhoneNumber || null)
        .input('Email', sql.NVarChar, Email || null)
        .input('AccountID', sql.Int, AccountID)
        .query(`
          INSERT INTO Employee (FullName, PhoneNumber, Email, AccountID, HireDate)
          VALUES (@FullName, @PhoneNumber, @Email, @AccountID, GETDATE())
        `);
    }

    res.json({ message: "Tạo tài khoản thành công", AccountID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= CẬP NHẬT TÀI KHOẢN =================
exports.update = async (req, res) => {
  const { id } = req.params;
  const { FullName, PhoneNumber, Email } = req.body;

  try {
    const pool = getPool();

    // Kiểm tra tài khoản thuộc Employee hay Customer
    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT RoleID FROM Account WHERE AccountID = @id
      `);

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    const RoleID = checkResult.recordset[0].RoleID;

    // Cập nhật thông tin Employee (Manager, Receptionist)
    if ([1, 2].includes(RoleID)) {
      await pool.request()
        .input('id', sql.Int, id)
        .input('FullName', sql.NVarChar, FullName)
        .input('PhoneNumber', sql.NVarChar, PhoneNumber)
        .input('Email', sql.NVarChar, Email)
        .query(`
          UPDATE Employee
          SET FullName = @FullName, PhoneNumber = @PhoneNumber, Email = @Email
          WHERE AccountID = @id
        `);
    } 
    // Cập nhật thông tin Customer
    else if (RoleID === 3) {
      await pool.request()
        .input('id', sql.Int, id)
        .input('FullName', sql.NVarChar, FullName)
        .input('PhoneNumber', sql.NVarChar, PhoneNumber)
        .input('Email', sql.NVarChar, Email)
        .query(`
          UPDATE Customer
          SET FullName = @FullName, PhoneNumber = @PhoneNumber, Email = @Email
          WHERE AccountID = @id
        `);
    }

    res.json({ message: "Cập nhật thông tin thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= XÓA TÀI KHOẢN =================
exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = getPool();

    // Không cho xóa tài khoản admin đầu tiên
    if (id == 1) {
      return res.status(400).json({ message: "Không thể xóa tài khoản admin chính" });
    }

    // Kiểm tra vai trò
    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT RoleID FROM Account WHERE AccountID = @id
      `);

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    const RoleID = checkResult.recordset[0].RoleID;

    // Xóa Employee nếu là nhân viên
    if ([1, 2].includes(RoleID)) {
      await pool.request()
        .input('id', sql.Int, id)
        .query(`DELETE FROM Employee WHERE AccountID = @id`);
    }

    // Xóa Account
    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM Account WHERE AccountID = @id`);

    res.json({ message: "Xóa tài khoản thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= RESET MẬT KHẨU (ADMIN) =================
exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  const { NewPassword } = req.body;

  if (!NewPassword) {
    return res.status(400).json({ message: "Thiếu mật khẩu mới" });
  }

  try {
    const pool = getPool();

    await pool.request()
      .input('id', sql.Int, id)
      .input('NewPassword', sql.NVarChar, NewPassword)
      .query(`
        UPDATE Account
        SET Password = @NewPassword
        WHERE AccountID = @id
      `);

    res.json({ message: "Reset mật khẩu thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= KÍCH HOẠT/VÔ HIỆU HÓA TÀI KHOẢN =================
exports.toggleActive = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = getPool();

    // Lấy trạng thái hiện tại
    const current = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT IsActive FROM Account WHERE AccountID = @id`);

    if (current.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    const newStatus = !current.recordset[0].IsActive;

    // Cập nhật trạng thái
    await pool.request()
      .input('id', sql.Int, id)
      .input('IsActive', sql.Bit, newStatus)
      .query(`
        UPDATE Account
        SET IsActive = @IsActive
        WHERE AccountID = @id
      `);

    res.json({ 
      message: `${newStatus ? 'Kích hoạt' : 'Vô hiệu hóa'} tài khoản thành công`,
      IsActive: newStatus
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};