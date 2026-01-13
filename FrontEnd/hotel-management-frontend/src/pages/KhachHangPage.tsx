import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { phongApi } from '../api';
import { Phong } from '../types';
import Loading from '../components/common/Loading';
import { getStatusColor } from '../utils';

const KhachHangPage: React.FC = () => {
  const [phongs, setPhongs] = useState<Phong[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPhongs();
  }, []);

  const fetchPhongs = async () => {
    try {
      setLoading(true);
      const data = await phongApi.getAll();
      setPhongs(data);
    } catch (error) {
      console.error('Error fetching phongs:', error);
      alert('Lỗi khi tải danh sách phòng');
    } finally {
      setLoading(false);
    }
  };

  const filteredPhongs = phongs.filter(
    (p) =>
      p.SoPhong.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.LoaiPhong?.TenLoaiPhong?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Phòng</h1>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          <Plus className="w-5 h-5" />
          Thêm phòng
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Số phòng</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Loại phòng</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Giá</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredPhongs.map((phong) => (
                <tr key={phong.MaPhong} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold">{phong.SoPhong}</td>
                  <td className="py-3 px-4">{phong.LoaiPhong?.TenLoaiPhong || '-'}</td>
                  <td className="py-3 px-4">
                    {phong.LoaiPhong?.GiaPhong.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(phong.TrangThai)}`}>
                      {phong.TrangThai}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">
                      <Edit className="w-5 h-5 inline" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KhachHangPage;