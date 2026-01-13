// phong.types.ts
export interface Phong {
  MaPhong: number;
  SoPhong: string;
  TrangThai: 'Trống' | 'Đang ở' | 'Bảo trì';
  MaLoaiPhong: number;
  LoaiPhong?: LoaiPhong;
  TenLoaiPhong?: string;
  GiaPhong?: number;
}

export interface LoaiPhong {
  MaLoaiPhong: number;
  TenLoaiPhong: string;
  GiaPhong: number;
}

export interface PhongFormData {
  SoPhong: string;
  TrangThai: string;
  MaLoaiPhong: number;
}

export interface PhongFilter {
  trangThai?: string;
  maLoaiPhong?: number;
  search?: string;
}