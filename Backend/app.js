require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoute = require('./routes/auth.route');
const roleRoute = require('./routes/role.route');
const accountRoute = require('./routes/account.route');
// const roomRoute = require('./routes/room.route');
// const customerRoute = require('./routes/customer.route');
// const bookingRoute = require('./routes/booking.route');
// const serviceRoute = require('./routes/service.route');
// const invoiceRoute = require('./routes/invoice.route');
// const reportRoute = require('./routes/report.route');

app.use('/api/auth', authRoute);
app.use('/api/roles', roleRoute);
app.use('/api/accounts', accountRoute);
// app.use('/api/rooms', roomRoute);
// app.use('/api/customers', customerRoute);
// app.use('/api/bookings', bookingRoute);
// app.use('/api/services', serviceRoute);
// app.use('/api/invoices', invoiceRoute);
// app.use('/api/reports', reportRoute);

// ================= HEALTH CHECK =================
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hotel Management API',
    version: '3.0',
    status: 'running',
    database: 'SQL Server'
  });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Đã xảy ra lỗi server!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({ message: 'Không tìm thấy endpoint' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Cannot connect to database:', err);
  process.exit(1);
});

module.exports = app;
