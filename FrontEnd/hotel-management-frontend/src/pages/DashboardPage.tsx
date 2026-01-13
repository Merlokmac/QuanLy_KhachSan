import React, { useEffect, useState } from 'react';
import { Hotel, Users, Calendar, DollarSign } from 'lucide-react';
import Loading from '../components/common/Loading';

// Mock data - thay bằng API call thực tế
const mockStats = {
  tongPhong: 50,
  phongTrong: 12,
  phongDangO: 35,
  tongKhachHang: 125,
  tongDatPhong: 89,
  doanhThuThang: 450000000,
};

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(false);

  const cards = [
    {
      title: 'Tổng phòng',
      value: stats.tongPhong,
      subtitle: `${stats.phongTrong} phòng trống`,
      icon: Hotel,
      color: 'bg-blue-500',
    },
    {
      title: 'Phòng đang ở',
      value: stats.phongDangO,
      subtitle: `${Math.round((stats.phongDangO / stats.tongPhong) * 100)}% lấp đầy`,
      icon: Hotel,
      color: 'bg-red-500',
    },
    {
      title: 'Tổng khách hàng',
      value: stats.tongKhachHang,
      subtitle: 'Khách hàng đã đăng ký',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Đặt phòng',
      value: stats.tongDatPhong,
      subtitle: 'Tổng số đặt phòng',
      icon: Calendar,
      color: 'bg-purple-500',
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                <p className="text-gray-500 text-sm mt-1">{card.subtitle}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Doanh thu */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-800">Doanh thu tháng này</h2>
        </div>
        <p className="text-4xl font-bold text-green-600">
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(stats.doanhThuThang)}
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;