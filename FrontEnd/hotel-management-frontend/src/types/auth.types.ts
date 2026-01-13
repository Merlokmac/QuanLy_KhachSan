// auth.types.ts
export interface LoginRequest {
  tenDangNhap: string;
  matKhau: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}

export interface UserInfo {
  maTaiKhoan: number;
  vaiTro: 'Quản lý' | 'Lễ tân';
}

export interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isLeTan: () => boolean;
}