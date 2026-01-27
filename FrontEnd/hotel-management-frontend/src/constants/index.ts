export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  MANAGER_DASHBOARD: '/manager',
  RECEPTIONIST_DASHBOARD: '/receptionist',
  CUSTOMER_DASHBOARD: '/customer',
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
} as const;

export const ROLES = {
  MANAGER: 1,
  RECEPTIONIST: 2,
  CUSTOMER: 3,
} as const;

export const ROLE_NAMES = {
  1: 'Manager',
  2: 'Receptionist',
  3: 'Customer',
} as const;

export const TOKEN_KEY = 'hotel_auth_token';
export const USER_KEY = 'hotel_user_data';