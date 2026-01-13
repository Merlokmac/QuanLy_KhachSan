import React, { useEffect, useState } from 'react';
import { Plus, Search, Package } from 'lucide-react';
import { dichVuApi } from '../api';
import { DichVu } from '../types';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import { formatCurrency } from '../utils';

const DichVuPage: React.FC = () => {
  const [dichVus, setDichVus] = useState<DichVu[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    TenDichVu: '',
    Gia: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDichVus();
  }, []);

  const fetchDichVus = async () => {
    try {
      setLoading(true);
      const data = await dichVuApi.getAll();
      setDichVus(data);
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Lỗi khi tải danh sách dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({ TenDichVu: '', Gia: '' });
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ TenDichVu: '', Gia: '' });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.TenDichVu.trim()) {
      newErrors.TenDichVu = 'Vui lòng nhập tên dịch vụ';
    }

    if (!formData.Gia) {
      newErrors.Gia = 'Vui lòng nhập giá dịch vụ';
    } else if (parseFloat(formData.Gia) <= 0) {
      newErrors.Gia = 'Giá phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await dichVuApi.create({
        TenDichVu: formData.TenDichVu,
        Gia: parseFloat(formData.Gia),
      });
      alert('Thêm dịch vụ thành công!');
      handleCloseModal();
      fetchDichVus();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi thêm dịch vụ');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDichVus = dichVus.filter((dv) =>
    dv.TenDichVu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Dịch vụ</h1>
          <p className="text-gray-600 mt-1">Chỉ quản lý mới có quyền thêm dịch vụ</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Thêm dịch vụ
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Stats */}
        <div className="mb-4 text-sm text-gray-600">
          Tổng số: <span className="font-semibold text-gray-900">{filteredDichVus.length}</span> dịch vụ
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDichVus.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              Không tìm thấy dịch vụ nào
            </div>
          ) : (
            filteredDichVus.map((dv) => (
              <div
                key={dv.MaDichVu}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{dv.TenDichVu}</h3>
                      <p className="text-xs text-gray-500">Mã: {dv.MaDichVu}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Giá:</span>
                    <span className="text-lg font-bold text-indigo-600">
                      {formatCurrency(dv.Gia)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Thêm Dịch vụ */}
      <Modal isOpen={showModal} onClose={handleCloseModal} title="Thêm Dịch vụ mới" size="md">
        <div className="space-y-4">
          {/* Tên dịch vụ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên dịch vụ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.TenDichVu}
              onChange={(e) => setFormData({ ...formData, TenDichVu: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.TenDichVu ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập tên dịch vụ"
            />
            {errors.TenDichVu && <p className="text-red-500 text-sm mt-1">{errors.TenDichVu}</p>}
          </div>

          {/* Giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá (VNĐ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.Gia}
              onChange={(e) => setFormData({ ...formData, Gia: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.Gia ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập giá dịch vụ"
              min="0"
              step="1000"
            />
            {errors.Gia && <p className="text-red-500 text-sm mt-1">{errors.Gia}</p>}
            {formData.Gia && parseFloat(formData.Gia) > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                = {formatCurrency(parseFloat(formData.Gia))}
              </p>
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
              {submitting ? 'Đang lưu...' : 'Thêm dịch vụ'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DichVuPage;