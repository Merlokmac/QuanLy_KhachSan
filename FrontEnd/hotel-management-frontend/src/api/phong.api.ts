// phong.api.ts
import axiosInstance from './axios.config';
import { Phong, PhongFormData, LoaiPhong, ApiResponse } from '../types';

export const phongApi = {
  // Lấy tất cả phòng
  getAll: async (): Promise<Phong[]> => {
    const response = await axiosInstance.get<ApiResponse<Phong[]>>('/api/phong');
    return response.data.data || [];
  },

  // Lấy chi tiết phòng
  getById: async (id: number): Promise<Phong> => {
    const response = await axiosInstance.get<ApiResponse<Phong>>(`/api/phong/${id}`);
    return response.data.data!;
  },

  // Tạo phòng mới
  create: async (data: PhongFormData): Promise<Phong> => {
    const response = await axiosInstance.post<ApiResponse<Phong>>('/api/phong', data);
    return response.data.data!;
  },

  // Cập nhật phòng
  update: async (id: number, data: PhongFormData): Promise<Phong> => {
    const response = await axiosInstance.put<ApiResponse<Phong>>(`/api/phong/${id}`, data);
    return response.data.data!;
  },

  // Xóa phòng
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/phong/${id}`);
  },

  // Lấy danh sách loại phòng (extract từ phòng)
  getLoaiPhongList: async (): Promise<LoaiPhong[]> => {
    const phongs = await phongApi.getAll();
    const loaiPhongMap = new Map<number, LoaiPhong>();
    phongs.forEach(p => {
      if (p.LoaiPhong && !loaiPhongMap.has(p.MaLoaiPhong)) {
        loaiPhongMap.set(p.MaLoaiPhong, {
          MaLoaiPhong: p.MaLoaiPhong,
          TenLoaiPhong: p.LoaiPhong.TenLoaiPhong,
          GiaPhong: p.LoaiPhong.GiaPhong,
        });
      }
    });
    return Array.from(loaiPhongMap.values());
  },
};