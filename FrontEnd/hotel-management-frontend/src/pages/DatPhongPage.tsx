import React, { useEffect, useState } from 'react';
import { Plus, Search, Calendar, CheckCircle, XCircle, LogIn, LogOut } from 'lucide-react';
import { datPhongApi, phongApi, khachHangApi } from '../api';
import { DatPhong, Phong, KhachHang } from '../types';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import { formatDate, getStatusColor } from '../utils';

const DatPhongPage: React.FC = () => {
  const [datPhongs, setDatPhongs] = useState<DatPhong[]>([]);
  const [phongs, setPhongs] = useState<Phong[]>([]);
  const [khachHangs, setKhachHangs] = useState<KhachHang[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    MaPhong: '',
    MaKH: '',
    NgayNhan: '',
    NgayTra: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [datPhongData, phongData, khachHangData] = await Promise.all([
        datPhongApi.getAll(),
        phongApi.getAll(),
        khachHangApi.getAll(),
      ]);
      setDatPhongs(datPhongData);
      setPhongs(phongData);
      setKhachHangs(khachHangData);
    } catch (error: any) {
      console.error('Error:', error);
      alert('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({ MaPhong: '', MaKH: '', NgayNhan: '', NgayTra: '' });
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ MaPhong: '', MaKH: '', NgayNhan: '', NgayTra: '' });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.MaPhong) newErrors.MaPhong = 'Vui lòng chọn phòng';
    if (!formData.MaKH) newErrors.MaKH = 'Vui lòng chọn khách hàng';
    if (!formData.NgayNhan) newErrors.NgayNhan = 'Vui lòng chọn ngày nhận';
    if (!formData.NgayTra) newErrors.NgayTra = 'Vui lòng chọn ngày trả';

    if (formData.NgayNhan && formData.NgayTra) {
      const ngayNhan = new Date(formData.NgayNhan);
      const ngayTra = new Date(formData.NgayTra);
      
      if (ngayTra <= ngayNhan) {
        newErrors.NgayTra = 'Ngày trả phải sau ngày nhận';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await datPhongApi.create({
        MaPhong: parseInt(formData.MaPhong),
        MaKH: parseInt(formData.MaKH),
        NgayNhan: formData.NgayNhan,
        NgayTra: formData.NgayTra,
        TrangThai: 'Đã đặt',
      });
      alert('Đặt phòng thành công!');
      handleCloseModal();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi đặt phòng');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckIn = async (id: number, soPhong: string) => {
    if (!window.confirm(`Xác nhận check-in phòng ${soPhong}?`)) return;

    try {
      await datPhongApi.checkIn(id);
      alert('Check-in thành công!');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi check-in');
    }
  };

  const handleCheckOut = async (id: number, soPhong: string) => {
    if (!window.confirm(`Xác nhận check-out phòng ${soPhong}?`)) return;

    try {
      await datPhongApi.checkOut(id);
      alert('Check-out thành công!');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi check-out');
    }
  };

  const handleHuy = async (id: number, soPhong: string) => {
    if (!window.confirm(`Xác nhận hủy đặt phòng ${soPhong}?`)) return;

    try {
      await datPhongApi.huy(id);
      alert('Hủy đặt phòng thành công!');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi hủy đặt phòng');
    }
  };

  const filteredDatPhongs = datPhongs.filter(
    (dp) =>
      dp.TenKhachHang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dp.SoPhong?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lọc phòng trống cho dropdown
  const phongTrong = phongs.filter((p) => p.TrangThai === 'Trống');

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Đặt phòng</h1>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Đặt phòng mới
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khách, số phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Stats */}
        <div className="mb-4 flex gap-6 text-sm">
          <div>
            Tổng: <span className="font-semibold">{filteredDatPhongs.length}</span>
          </div>
          <div>
            Đã đặt: <span className="font-semibold text-blue-600">
              {filteredDatPhongs.filter((d) => d.TrangThai === 'Đã đặt').length}
            </span>
          </div>
          <div>
            Đang ở: <span className="font-semibold text-green-600">
              {filteredDatPhongs.filter((d) => d.TrangThai === 'Đang ở').length}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Mã ĐP</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Khách hàng</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Phòng</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Ngày nhận</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Ngày trả</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredDatPhongs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    Không có đặt phòng nào
                  </td>
                </tr>
              ) : (
                filteredDatPhongs.map((dp) => (
                  <tr key={dp.MaDatPhong} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold">{dp.MaDatPhong}</td>
                    <td className="py-3 px-4 font-medium">{dp.TenKhachHang}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded font-semibold">
                        {dp.SoPhong}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(dp.NgayNhan)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(dp.NgayTra)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(dp.TrangThai)}`}>
                        {dp.TrangThai}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        {dp.TrangThai === 'Đã đặt' && (
                          <>
                            <button
                              onClick={() => handleCheckIn(dp.MaDatPhong, dp.SoPhong as number)}
                              className="text-green-600 hover:text-green-800 transition"
                              title="Check-in"
                            >
                              <LogIn className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleHuy(dp.MaDatPhong, dp.SoPhong)}
                              className="text-red-600 hover:text-red-800 transition"
                              title="Hủy"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {dp.TrangThai === 'Đang ở' && (
                          <button
                            onClick={() => handleCheckOut(dp.MaDatPhong, dp.SoPhong)}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Check-out"
                          >
                            <LogOut className="w-5 h-5" />
                          </button>
                        )}
                        {(dp.TrangThai === 'Hoàn thành' || dp.TrangThai === 'Đã huỷ') && (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Đặt phòng */}
      <Modal isOpen={showModal} onClose={handleCloseModal} title="Đặt phòng mới" size="lg">
        <div className="space-y-4">
          {/* Phòng */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phòng <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.MaPhong}
              onChange={(e) => setFormData({ ...formData, MaPhong: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.MaPhong ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Chọn phòng --</option>
              {phongTrong.map((p) => (
                <option key={p.MaPhong} value={p.MaPhong}>
                  Phòng {p.SoPhong} - {p.LoaiPhong?.TenLoaiPhong} ({p.LoaiPhong?.GiaPhong.toLocaleString('vi-VN')} VNĐ)
                </option>
              ))}
            </select>
            {errors.MaPhong && <p className="text-red-500 text-sm mt-1">{errors.MaPhong}</p>}
          </div>

          {/* Khách hàng */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khách hàng <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.MaKH}
              onChange={(e) => setFormData({ ...formData, MaKH: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.MaKH ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Chọn khách hàng --</option>
              {khachHangs.map((kh) => (
                <option key={kh.MaKH} value={kh.MaKH}>
                  {kh.HoTen} - {kh.CCCD}
                </option>
              ))}
            </select>
            {errors.MaKH && <p className="text-red-500 text-sm mt-1">{errors.MaKH}</p>}
          </div>

          {/* Ngày nhận */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày nhận <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.NgayNhan}
              onChange={(e) => setFormData({ ...formData, NgayNhan: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.NgayNhan ? 'border-red-500' : 'border-gray-300'
              }`}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.NgayNhan && <p className="text-red-500 text-sm mt-1">{errors.NgayNhan}</p>}
          </div>

          {/* Ngày trả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày trả <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.NgayTra}
              onChange={(e) => setFormData({ ...formData, NgayTra: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.NgayTra ? 'border-red-500' : 'border-gray-300'
              }`}
              min={formData.NgayNhan || new Date().toISOString().split('T')[0]}
            />
            {errors.NgayTra && <p className="text-red-500 text-sm mt-1">{errors.NgayTra}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {submitting ? 'Đang đặt...' : 'Xác nhận đặt phòng'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DatPhongPage;