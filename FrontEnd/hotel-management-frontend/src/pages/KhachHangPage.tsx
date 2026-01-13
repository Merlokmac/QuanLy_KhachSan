import React, { useEffect, useState } from 'react';
import { Plus, Search, Trash2, User, Phone, CreditCard } from 'lucide-react';
import { khachHangApi } from '../api';
import { KhachHang } from '../types';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import { useAuth } from '../hooks/useAuth';
import { validateCCCD, validatePhone } from '../utils';

const KhachHangPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [khachHangs, setKhachHangs] = useState<KhachHang[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    HoTen: '',
    CCCD: '',
    SoDienThoai: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchKhachHangs();
  }, []);

  const fetchKhachHangs = async () => {
    try {
      setLoading(true);
      const data = await khachHangApi.getAll();
      setKhachHangs(data);
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Lỗi khi tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({ HoTen: '', CCCD: '', SoDienThoai: '' });
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ HoTen: '', CCCD: '', SoDienThoai: '' });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.HoTen.trim()) {
      newErrors.HoTen = 'Vui lòng nhập họ tên';
    }

    if (!formData.CCCD.trim()) {
      newErrors.CCCD = 'Vui lòng nhập CCCD';
    } else if (!validateCCCD(formData.CCCD)) {
      newErrors.CCCD = 'CCCD phải có 12 chữ số';
    }

    if (formData.SoDienThoai && !validatePhone(formData.SoDienThoai)) {
      newErrors.SoDienThoai = 'Số điện thoại phải có 10 chữ số';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await khachHangApi.create(formData);
      alert('Thêm khách hàng thành công!');
      handleCloseModal();
      fetchKhachHangs();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi thêm khách hàng');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, hoTen: string) => {
    if (!isAdmin()) {
      alert('Chỉ quản lý mới có quyền xóa khách hàng');
      return;
    }

    if (!window.confirm(`Bạn có chắc muốn xóa khách hàng "${hoTen}"?`)) {
      return;
    }

    try {
      await khachHangApi.delete(id);
      alert('Xóa khách hàng thành công!');
      fetchKhachHangs();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi xóa khách hàng');
    }
  };

  const filteredKhachHangs = khachHangs.filter(
    (kh) =>
      kh.HoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kh.CCCD.includes(searchTerm) ||
      kh.SoDienThoai?.includes(searchTerm)
  );

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Khách hàng</h1>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Thêm khách hàng
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, CCCD, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Stats */}
        <div className="mb-4 text-sm text-gray-600">
          Tổng số: <span className="font-semibold text-gray-900">{filteredKhachHangs.length}</span> khách hàng
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Mã KH</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Họ tên</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">CCCD</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Số điện thoại</th>
                {isAdmin() && (
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Hành động</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredKhachHangs.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin() ? 5 : 4} className="text-center py-8 text-gray-500">
                    Không tìm thấy khách hàng nào
                  </td>
                </tr>
              ) : (
                filteredKhachHangs.map((kh) => (
                  <tr key={kh.MaKH} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">{kh.MaKH}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{kh.HoTen}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="font-mono text-sm">{kh.CCCD}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{kh.SoDienThoai || '-'}</span>
                      </div>
                    </td>
                    {isAdmin() && (
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(kh.MaKH, kh.HoTen)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Xóa"
                        >
                          <Trash2 className="w-5 h-5 inline" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm Khách hàng */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Thêm Khách hàng mới"
        size="md"
      >
        <div className="space-y-4">
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.HoTen}
              onChange={(e) => setFormData({ ...formData, HoTen: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.HoTen ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập họ tên"
            />
            {errors.HoTen && <p className="text-red-500 text-sm mt-1">{errors.HoTen}</p>}
          </div>

          {/* CCCD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CCCD <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.CCCD}
              onChange={(e) => setFormData({ ...formData, CCCD: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.CCCD ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập 12 số CCCD"
              maxLength={12}
            />
            {errors.CCCD && <p className="text-red-500 text-sm mt-1">{errors.CCCD}</p>}
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="text"
              value={formData.SoDienThoai}
              onChange={(e) => setFormData({ ...formData, SoDienThoai: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.SoDienThoai ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập 10 số điện thoại"
              maxLength={10}
            />
            {errors.SoDienThoai && (
              <p className="text-red-500 text-sm mt-1">{errors.SoDienThoai}</p>
            )}
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
              {submitting ? 'Đang lưu...' : 'Thêm khách hàng'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default KhachHangPage;