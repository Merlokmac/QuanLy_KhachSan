// auth.api.ts
import axiosInstance from './axios.config';
import { LoginRequest, LoginResponse } from '../types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Nếu có API logout ở backend
    // await axiosInstance.post('/api/auth/logout');
  },
};