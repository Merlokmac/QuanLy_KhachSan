import Dashboard from "layouts/dashboard";
import Profile from "layouts/profile";

import UserProfile from "layouts/user-profile";
import UserManagement from "layouts/user-management";

// Nghiệp vụ
import DatPhong from "layouts/dat-phong";
import KhachHang from "layouts/khach-hang";
import Phong from "layouts/phong";
import DichVu from "layouts/dich-vu";

// @mui icons
import Icon from "@mui/material/Icon";

/**
 * roles:
 *  - QUAN_LY
 *  - LE_TAN
 */

const routes = [
  /* ================= QUẢN LÝ ================= */

  {
    type: "collapse",
    name: "Thống kê",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    roles: ["QUAN_LY"],
  },

  {
    type: "collapse",
    name: "Quản lý dịch vụ",
    key: "dich-vu",
    icon: <Icon fontSize="small">room_service</Icon>,
    route: "/dich-vu",
    component: <DichVu />,
    roles: ["QUAN_LY"],
  },

  {
    type: "collapse",
    name: "Phân quyền nhân viên",
    key: "user-management",
    icon: <Icon fontSize="small">admin_panel_settings</Icon>,
    route: "/user-management",
    component: <UserManagement />,
    roles: ["QUAN_LY"],
  },

  { type: "divider", key: "divider-1" },

  /* ================= LỄ TÂN + QUẢN LÝ ================= */

  {
    type: "collapse",
    name: "Quản lý phòng",
    key: "phong",
    icon: <Icon fontSize="small">hotel</Icon>,
    route: "/phong",
    component: <Phong />,
    roles: ["LE_TAN", "QUAN_LY"],
  },

  {
    type: "collapse",
    name: "Khách hàng",
    key: "khach-hang",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/khach-hang",
    component: <KhachHang />,
    roles: ["LE_TAN", "QUAN_LY"],
  },

  {
    type: "collapse",
    name: "Đặt phòng",
    key: "dat-phong",
    icon: <Icon fontSize="small">event_available</Icon>,
    route: "/dat-phong",
    component: <DatPhong />,
    roles: ["LE_TAN", "QUAN_LY"],
  },

  {
    type: "collapse",
    name: "Hồ sơ cá nhân",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    roles: ["LE_TAN", "QUAN_LY"],
  },

  { type: "divider", key: "divider-2" },

  /* ================= TIỆN ÍCH ================= */

  {
    type: "examples",
    name: "Thông tin tài khoản",
    key: "user-profile",
    icon: <Icon fontSize="small">account_circle</Icon>,
    route: "/user-profile",
    component: <UserProfile />,
    roles: ["LE_TAN", "QUAN_LY"],
  },
];

export default routes;
