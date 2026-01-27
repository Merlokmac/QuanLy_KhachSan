export interface User {
  AccountID: number;
  Username: string;
  RoleID: number;
  RoleName: string;
  FullName: string;
  EmployeeID?: number;
  CustomerID?: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  Username: string;
  Password: string;
}

export interface RegisterRequest {
  Username: string;
  Password: string;
  ConfirmPassword: string;
  FullName: string;
  IDCardNumber: string;
  PhoneNumber: string;
  Email?: string;
  DateOfBirth?: string;
  Address?: string;
}

export interface ApiError {
  message: string;
  error?: string;
}

export interface Role {
  RoleID: number;
  RoleName: string;
  Description?: string;
}

export interface Account {
  AccountID: number;
  Username: string;
  RoleID: number;
  RoleName: string;
  IsActive: boolean;
  CreatedDate: string;
  EmployeeID?: number;
  EmployeeName?: string;
  EmployeePhone?: string;
  CustomerID?: number;
  CustomerName?: string;
  CustomerPhone?: string;
}