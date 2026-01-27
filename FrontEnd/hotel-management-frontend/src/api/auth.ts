import apiClient from './client';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<{ message: string; AccountID: number }> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  changePassword: async (data: {
    OldPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
  }): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/change-password', data);
    return response.data;
  },

  refreshToken: async (token: string): Promise<{ message: string; token: string }> => {
    const response = await apiClient.post('/auth/refresh-token', { token });
    return response.data;
  },
};