// api/index.ts - Export all APIs
import axiosInstance from './axios.config';
import { ApiResponse, KhachHang, KhachHangFormData, DatPhong, DatPhongFormData, DichVu, DichVuFormData, ThongKeDashboard } from '../types';

export * from './auth.api';
export * from './phong.api';

// Khách hàng API
export const khachHangApi = {
  getAll: async (): Promise<KhachHang[]> => {
    const response = await axiosInstance.get<ApiResponse<KhachHang[]>>('/api/khachhang');
    return response.data.data || [];
  },

  getById: async (id: number): Promise<KhachHang> => {
    const response = await axiosInstance.get<ApiResponse<KhachHang>>(`/api/khachhang/${id}`);
    return response.data.data!;
  },

  create: async (data: KhachHangFormData): Promise<KhachHang> => {
    const response = await axiosInstance.post<ApiResponse<KhachHang>>('/api/khachhang', data);
    return response.data.data!;
  },

  update: async (id: number, data: KhachHangFormData): Promise<KhachHang> => {
    const response = await axiosInstance.put<ApiResponse<KhachHang>>(`/api/khachhang/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/khachhang/${id}`);
  },
};

// Đặt phòng API
export const datPhongApi = {
  getAll: async (): Promise<DatPhong[]> => {
    const response = await axiosInstance.get<ApiResponse<DatPhong[]>>('/api/datphong');
    return response.data.data || [];
  },

  getById: async (id: number): Promise<DatPhong> => {
    const response = await axiosInstance.get<ApiResponse<DatPhong>>(`/api/datphong/${id}`);
    return response.data.data!;
  },

  create: async (data: DatPhongFormData): Promise<DatPhong> => {
    const response = await axiosInstance.post<ApiResponse<DatPhong>>('/api/datphong', data);
    return response.data.data!;
  },

  update: async (id: number, data: Partial<DatPhongFormData>): Promise<DatPhong> => {
    const response = await axiosInstance.put<ApiResponse<DatPhong>>(`/api/datphong/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/datphong/${id}`);
  },

  checkIn: async (id: number): Promise<DatPhong> => {
    const response = await axiosInstance.put<ApiResponse<DatPhong>>(`/api/datphong/${id}/checkin`);
    return response.data.data!;
  },

  checkOut: async (id: number): Promise<DatPhong> => {
    const response = await axiosInstance.put<ApiResponse<DatPhong>>(`/api/datphong/${id}/checkout`);
    return response.data.data!;
  },
};

// Dịch vụ API (chỉ admin)
export const dichVuApi = {
  getAll: async (): Promise<DichVu[]> => {
    const response = await axiosInstance.get<ApiResponse<DichVu[]>>('/api/dichvu');
    return response.data.data || [];
  },

  getById: async (id: number): Promise<DichVu> => {
    const response = await axiosInstance.get<ApiResponse<DichVu>>(`/api/dichvu/${id}`);
    return response.data.data!;
  },

  create: async (data: DichVuFormData): Promise<DichVu> => {
    const response = await axiosInstance.post<ApiResponse<DichVu>>('/api/dichvu', data);
    return response.data.data!;
  },

  update: async (id: number, data: DichVuFormData): Promise<DichVu> => {
    const response = await axiosInstance.put<ApiResponse<DichVu>>(`/api/dichvu/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/dichvu/${id}`);
  },
};

// Thống kê API (chỉ admin)
export const thongKeApi = {
  getDashboard: async (): Promise<ThongKeDashboard> => {
    const response = await axiosInstance.get<ApiResponse<ThongKeDashboard>>('/api/thongke/dashboard');
    return response.data.data!;
  },

  getDoanhThu: async (nam?: number) => {
    const response = await axiosInstance.get('/api/thongke/doanhthu', { params: { nam } });
    return response.data.data || [];
  },

  getTyLePhong: async () => {
    const response = await axiosInstance.get('/api/thongke/tylephong');
    return response.data.data || [];
  },
};