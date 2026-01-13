// index.ts - Export all types
export * from './auth.types';
export * from './common.types';
export * from './phong.types';

// khachhang.types.ts
export interface KhachHang {
  MaKH: number;
  HoTen: string;
  CCCD: string;
  SoDienThoai: string;
}

export interface KhachHangFormData {
  HoTen: string;
  CCCD: string;
  SoDienThoai: string;
}

// datphong.types.ts
export interface DatPhong {
  MaDatPhong: number;
  MaPhong: number;
  MaKH: number;
  NgayNhan: string;
  NgayTra: string;
  TrangThai: 'Đã đặt' | 'Đang ở' | 'Hoàn thành' | 'Đã hủy';
  KhachHang?: KhachHang;
  Phong?: {
    SoPhong: string;
    LoaiPhong: {
      TenLoaiPhong: string;
      GiaPhong: number;
    };
  };
}

export interface DatPhongFormData {
  MaPhong: number;
  MaKH: number;
  NgayNhan: string;
  NgayTra: string;
  TrangThai: string;
}

// dichvu.types.ts
export interface DichVu {
  MaDichVu: number;
  TenDichVu: string;
  Gia: number;
}

export interface DichVuFormData {
  TenDichVu: string;
  Gia: number;
}

// thongke.types.ts
export interface ThongKeDashboard {
  tongPhong: number;
  phongTrong: number;
  phongDangO: number;
  tongKhachHang: number;
  tongDatPhong: number;
  doanhThuThang: number;
}

export interface DoanhThuTheoThang {
  thang: string;
  doanhThu: number;
}

export interface TyLePhong {
  loaiPhong: string;
  soLuong: number;
  tyLe: number;
}