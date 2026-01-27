const { getPool, sql } = require("../config/db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

exports.login = async (req, res) => {
  const { Username, Password } = req.body;

  if (!Username || !Password) {
    return res.status(400).json({ message: "Thiếu thông tin đăng nhập" });
  }

  try {
    const pool = getPool();
    const result = await pool.request()
      .input('Username', sql.NVarChar, Username)
      .input('Password', sql.NVarChar, Password)
      .query(`
        SELECT 
          a.AccountID,
          a.Username,
          a.RoleID,
          r.RoleName,
          e.EmployeeID,
          e.FullName AS EmployeeName,
          c.CustomerID,
          c.FullName AS CustomerName
        FROM Account a
        JOIN Role r ON a.RoleID = r.RoleID
        LEFT JOIN Employee e ON a.AccountID = e.AccountID
        LEFT JOIN Customer c ON a.AccountID = c.AccountID
        WHERE a.Username = @Username 
          AND a.Password = @Password
          AND a.IsActive = 1
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }

    const user = result.recordset[0];

    const token = jwt.sign(
      {
        AccountID: user.AccountID,
        Username: user.Username,
        RoleID: user.RoleID,
        RoleName: user.RoleName,
        EmployeeID: user.EmployeeID,
        CustomerID: user.CustomerID
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        AccountID: user.AccountID,
        Username: user.Username,
        RoleID: user.RoleID,
        RoleName: user.RoleName,
        FullName: user.EmployeeName || user.CustomerName,
        EmployeeID: user.EmployeeID,
        CustomerID: user.CustomerID
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  const { 
    Username, 
    Password, 
    ConfirmPassword,
    FullName, 
    IDCardNumber, 
    PhoneNumber,
    Email,
    DateOfBirth,
    Address
  } = req.body;

  // Validate
  if (!Username || !Password || !ConfirmPassword || !FullName || !PhoneNumber || !IDCardNumber) {
    return res.status(400).json({ message: "Thiếu thông tin đăng ký" });
  }

  if (Password !== ConfirmPassword) {
    return res.status(400).json({ message: "Mật khẩu xác nhận không khớp" });
  }

  if (Password.length < 6) {
    return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
  }

  try {
    const pool = getPool();

    const checkUser = await pool.request()
      .input('Username', sql.NVarChar, Username)
      .query(`SELECT 1 FROM Account WHERE Username = @Username`);

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
    }

    const checkPhone = await pool.request()
      .input('PhoneNumber', sql.NVarChar, PhoneNumber)
      .query(`SELECT 1 FROM Customer WHERE PhoneNumber = @PhoneNumber`);

    if (checkPhone.recordset.length > 0) {
      return res.status(400).json({ message: "Số điện thoại đã được đăng ký" });
    }

    if (IDCardNumber) {
      const checkID = await pool.request()
        .input('IDCardNumber', sql.NVarChar, IDCardNumber)
        .query(`SELECT 1 FROM Customer WHERE IDCardNumber = @IDCardNumber`);

      if (checkID.recordset.length > 0) {
        return res.status(400).json({ message: "CCCD đã được đăng ký" });
      }
    }

    const roleResult = await pool.request()
      .query(`SELECT RoleID FROM Role WHERE RoleName = N'Customer'`);
    
    const CustomerRoleID = roleResult.recordset[0]?.RoleID || 3;

    const accountResult = await pool.request()
      .input('Username', sql.NVarChar, Username)
      .input('Password', sql.NVarChar, Password)
      .input('RoleID', sql.Int, CustomerRoleID)
      .query(`
        INSERT INTO Account (Username, Password, RoleID)
        OUTPUT INSERTED.AccountID
        VALUES (@Username, @Password, @RoleID)
      `);

    const AccountID = accountResult.recordset[0].AccountID;

    await pool.request()
      .input('FullName', sql.NVarChar, FullName)
      .input('IDCardNumber', sql.NVarChar, IDCardNumber)
      .input('PhoneNumber', sql.NVarChar, PhoneNumber)
      .input('Email', sql.NVarChar, Email || null)
      .input('DateOfBirth', sql.Date, DateOfBirth || null)
      .input('Address', sql.NVarChar, Address || null)
      .input('AccountID', sql.Int, AccountID)
      .query(`
        INSERT INTO Customer (FullName, IDCardNumber, PhoneNumber, Email, DateOfBirth, Address, AccountID)
        VALUES (@FullName, @IDCardNumber, @PhoneNumber, @Email, @DateOfBirth, @Address, @AccountID)
      `);

    res.json({ 
      message: "Đăng ký thành công! Vui lòng đăng nhập.",
      AccountID
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = req.user; 
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  res.json({ message: "Đăng xuất thành công" });
};

exports.changePassword = async (req, res) => {
  const { OldPassword, NewPassword, ConfirmPassword } = req.body;
  const AccountID = req.user.AccountID;

  if (!OldPassword || !NewPassword || !ConfirmPassword) {
    return res.status(400).json({ message: "Thiếu thông tin" });
  }

  if (NewPassword !== ConfirmPassword) {
    return res.status(400).json({ message: "Mật khẩu xác nhận không khớp" });
  }

  if (NewPassword.length < 6) {
    return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
  }

  try {
    const pool = getPool();

    const checkResult = await pool.request()
      .input('AccountID', sql.Int, AccountID)
      .input('OldPassword', sql.NVarChar, OldPassword)
      .query(`
        SELECT 1 FROM Account 
        WHERE AccountID = @AccountID AND Password = @OldPassword
      `);

    if (checkResult.recordset.length === 0) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
    }

    await pool.request()
      .input('AccountID', sql.Int, AccountID)
      .input('NewPassword', sql.NVarChar, NewPassword)
      .query(`
        UPDATE Account
        SET Password = @NewPassword
        WHERE AccountID = @AccountID
      `);

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Không có token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const newToken = jwt.sign(
      {
        AccountID: decoded.AccountID,
        Username: decoded.Username,
        RoleID: decoded.RoleID,
        RoleName: decoded.RoleName,
        EmployeeID: decoded.EmployeeID,
        CustomerID: decoded.CustomerID
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ 
      message: "Làm mới token thành công",
      token: newToken 
    });
  } catch (err) {
    res.status(403).json({ message: "Token không hợp lệ" });
  }
};