import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { phongApi } from '../api';
import { Phong, LoaiPhong } from '../types';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import { getStatusColor, formatCurrency } from '../utils';
import { useAuth } from '../hooks/useAuth';

const PhongPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [phongs, setPhongs] = useState<Phong[]>([]);
  const [loaiPhongs, setLoaiPhongs] = useState<LoaiPhong[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingPhong, setEditingPhong] = useState<Phong | null>(null);
  const [formData, setFormData] = useState({
    SoPhong: '',
    MaLoaiPhong: '',
  });
  const [updateData, setUpdateData] = useState({
    TrangThai: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const phongData = await phongApi.getAll();
      setPhongs(phongData);
      
      // Extract loại phòng
      const loaiPhongData = await phongApi.getLoaiPhongList();
      setLoaiPhongs(loaiPhongData);
    } catch (error: any) {
      console.error('Error:', error);
      alert('Lỗi khi tải danh sách phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    if (!isAdmin()) {
      alert('Chỉ quản lý mới có quyền thêm phòng');
      return;
    }
    setFormData({ SoPhong: '', MaLoaiPhong: '' });
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ SoPhong: '', MaLoaiPhong: '' });
    setErrors({});
  };

  const handleOpenUpdateModal = (phong: Phong) => {
    if (!isAdmin()) {
      alert('Chỉ quản lý mới có quyền cập nhật phòng');
      return;
    }
    setEditingPhong(phong);
    setUpdateData({ TrangThai: phong.TrangThai });
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setEditingPhong(null);
    setUpdateData({ TrangThai: '' });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.SoPhong.trim()) {
      newErrors.SoPhong = 'Vui lòng nhập số phòng';
    }

    if (!formData.MaLoaiPhong) {
      newErrors.MaLoaiPhong = 'Vui lòng chọn loại phòng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await phongApi.create({
        SoPhong: formData.SoPhong,
        TrangThai: 'Trống',
        MaLoaiPhong: parseInt(formData.MaLoaiPhong),
      });
      alert('Thêm phòng thành công!');
      handleCloseModal();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi thêm phòng');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingPhong || !updateData.TrangThai) return;

    try {
      setSubmitting(true);
      await phongApi.update(editingPhong.MaPhong, {
        SoPhong: editingPhong.SoPhong,
        TrangThai: updateData.TrangThai,
        MaLoaiPhong: editingPhong.MaLoaiPhong,
      });
      alert('Cập nhật phòng thành công!');
      handleCloseUpdateModal();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi cập nhật phòng');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (phong: Phong) => {
    if (!isAdmin()) {
      alert('Chỉ quản lý mới có quyền xóa phòng');
      return;
    }

    if (!window.confirm(`Bạn có chắc muốn xóa phòng ${phong.SoPhong}?`)) {
      return;
    }

    try {
      await phongApi.delete(phong.MaPhong);
      alert('Xóa phòng thành công!');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi xóa phòng');
    }
  };

  const filteredPhongs = phongs.filter((p) => {
    const matchSearch = p.SoPhong.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterTrangThai === 'all' || p.TrangThai === filterTrangThai;
    return matchSearch && matchStatus;
  });

  // Stats
  const stats = {
    total: phongs.length,
    trong: phongs.filter(p => p.TrangThai === 'Trống').length,
    dangO: phongs.filter(p => p.TrangThai === 'Đang ở').length,
    baoTri: phongs.filter(p => p.TrangThai === 'Bảo trì').length,
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Phòng</h1>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Thêm phòng
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">Tổng phòng</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">Phòng trống</p>
          <p className="text-2xl font-bold text-green-600">{stats.trong}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">Đang ở</p>
          <p className="text-2xl font-bold text-red-600">{stats.dangO}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">Bảo trì</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.baoTri}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              value={filterTrangThai}
              onChange={(e) => setFilterTrangThai(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Trống">Trống</option>
              <option value="Đang ở">Đang ở</option>
              <option value="Bảo trì">Bảo trì</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Mã phòng</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Số phòng</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Loại phòng</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Giá</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
                {isAdmin() && (
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Hành động</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredPhongs.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin() ? 6 : 5} className="text-center py-8 text-gray-500">
                    Không tìm thấy phòng nào
                  </td>
                </tr>
              ) : (
                filteredPhongs.map((phong) => (
                  <tr key={phong.MaPhong} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">{phong.MaPhong}</td>
                    <td className="py-3 px-4 font-bold text-indigo-600">{phong.SoPhong}</td>
                    <td className="py-3 px-4">{phong.LoaiPhong?.TenLoaiPhong || '-'}</td>
                    <td className="py-3 px-4 font-semibold">
                      {phong.LoaiPhong ? formatCurrency(phong.LoaiPhong.GiaPhong) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          phong.TrangThai
                        )}`}
                      >
                        {phong.TrangThai}
                      </span>
                    </td>
                    {isAdmin() && (
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenUpdateModal(phong)}
                          className="text-blue-600 hover:text-blue-800 mr-3 transition"
                          title="Cập nhật"
                        >
                          <Edit className="w-5 h-5 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(phong)}
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

      {/* Modal Thêm Phòng */}
      <Modal isOpen={showModal} onClose={handleCloseModal} title="Thêm Phòng mới" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số phòng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.SoPhong}
              onChange={(e) => setFormData({ ...formData, SoPhong: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.SoPhong ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ví dụ: 101, 201, ..."
            />
            {errors.SoPhong && <p className="text-red-500 text-sm mt-1">{errors.SoPhong}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại phòng <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.MaLoaiPhong}
              onChange={(e) => setFormData({ ...formData, MaLoaiPhong: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.MaLoaiPhong ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Chọn loại phòng --</option>
              {loaiPhongs.map((lp) => (
                <option key={lp.MaLoaiPhong} value={lp.MaLoaiPhong}>
                  {lp.TenLoaiPhong} - {formatCurrency(lp.GiaPhong)}
                </option>
              ))}
            </select>
            {errors.MaLoaiPhong && (
              <p className="text-red-500 text-sm mt-1">{errors.MaLoaiPhong}</p>
            )}
          </div>

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
              {submitting ? 'Đang lưu...' : 'Thêm phòng'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Cập nhật Trạng thái */}
      <Modal
        isOpen={showUpdateModal}
        onClose={handleCloseUpdateModal}
        title={`Cập nhật Phòng ${editingPhong?.SoPhong}`}
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select
              value={updateData.TrangThai}
              onChange={(e) => setUpdateData({ TrangThai: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Trống">Trống</option>
              <option value="Bảo trì">Bảo trì</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">
              * Trạng thái "Đang ở" được tự động cập nhật khi check-in
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={handleCloseUpdateModal}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              onClick={handleUpdate}
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {submitting ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PhongPage;