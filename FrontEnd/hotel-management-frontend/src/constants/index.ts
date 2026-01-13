// constants/index.ts
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '10000');

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'hotel_token',
  USER: 'hotel_user',
};

// Vai trò
export const ROLES = {
  ADMIN: 'Quản lý',
  LE_TAN: 'Lễ tân',
};

// Trạng thái phòng
export const ROOM_STATUS = {
  TRONG: 'Trống',
  DANG_O: 'Đang ở',
  BAO_TRI: 'Bảo trì',
};

// Trạng thái đặt phòng
export const BOOKING_STATUS = {
  DA_DAT: 'Đã đặt',
  DANG_O: 'Đang ở',
  HOAN_THANH: 'Hoàn thành',
  DA_HUY: 'Đã huỷ',
};

// Routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  PHONG: '/phong',
  KHACH_HANG: '/khach-hang',
  DAT_PHONG: '/dat-phong',
  DICH_VU: '/dich-vu',
  THONG_KE: '/thong-ke',
};

// Messages
export const MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  LOGIN_FAILED: 'Đăng nhập thất bại',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  CREATE_SUCCESS: 'Tạo mới thành công',
  UPDATE_SUCCESS: 'Cập nhật thành công',
  DELETE_SUCCESS: 'Xóa thành công',
  ERROR: 'Có lỗi xảy ra',
  CONFIRM_DELETE: 'Bạn có chắc chắn muốn xóa?',
};