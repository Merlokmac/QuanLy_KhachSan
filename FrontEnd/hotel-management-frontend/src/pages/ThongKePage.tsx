import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { thongKeApi } from '../api';
import Loading from '../components/common/Loading';
import { formatCurrency } from '../utils';

interface DoanhThuData {
  Thang: number;
  DoanhThu: number;
}

const ThongKePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [doanhThuData, setDoanhThuData] = useState<DoanhThuData[]>([]);
  const [tongDoanhThu, setTongDoanhThu] = useState(0);

  useEffect(() => {
    fetchDoanhThu();
  }, [selectedYear]);

  const fetchDoanhThu = async () => {
    try {
      setLoading(true);
      const data = await thongKeApi.getDoanhThu(selectedYear);
      setDoanhThuData(data);
      
      // Tính tổng doanh thu
      const tong = data.reduce((sum: number, item: DoanhThuData) => sum + item.DoanhThu, 0);
      setTongDoanhThu(tong);
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Lỗi khi tải thống kê');
      setDoanhThuData([]);
      setTongDoanhThu(0);
    } finally {
      setLoading(false);
    }
  };

  // Tạo dữ liệu cho biểu đồ (đầy đủ 12 tháng)
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const thang = i + 1;
    const found = doanhThuData.find((d) => d.Thang === thang);
    return {
      thang: `Tháng ${thang}`,
      doanhThu: found ? found.DoanhThu : 0,
    };
  });

  // Tính doanh thu trung bình
  const doanhThuTrungBinh = doanhThuData.length > 0 
    ? tongDoanhThu / doanhThuData.length 
    : 0;

  // Tìm tháng có doanh thu cao nhất
  const thangCaoNhat = doanhThuData.reduce(
    (max, item) => (item.DoanhThu > max.DoanhThu ? item : max),
    { Thang: 0, DoanhThu: 0 }
  );

  // Generate list of years (5 years back and 2 years forward)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => currentYear - 5 + i);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Thống kê Doanh thu</h1>
        <p className="text-gray-600 mt-1">Xem báo cáo doanh thu theo tháng</p>
      </div>

      {/* Year Selector */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Chọn năm:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8" />
            <h3 className="text-lg font-semibold">Tổng doanh thu</h3>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(tongDoanhThu)}</p>
          <p className="text-blue-100 text-sm mt-2">Năm {selectedYear}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <BarChart className="w-8 h-8" />
            <h3 className="text-lg font-semibold">TB / Tháng</h3>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(doanhThuTrungBinh)}</p>
          <p className="text-green-100 text-sm mt-2">
            {doanhThuData.length} tháng có dữ liệu
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8" />
            <h3 className="text-lg font-semibold">Cao nhất</h3>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(thangCaoNhat.DoanhThu)}</p>
          <p className="text-purple-100 text-sm mt-2">
            {thangCaoNhat.Thang > 0 ? `Tháng ${thangCaoNhat.Thang}` : 'Chưa có dữ liệu'}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Biểu đồ doanh thu năm {selectedYear}
        </h2>
        {doanhThuData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Không có dữ liệu doanh thu cho năm {selectedYear}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="thang" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar 
                dataKey="doanhThu" 
                fill="#4f46e5" 
                name="Doanh thu"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table Detail */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Chi tiết theo tháng</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tháng</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Doanh thu</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">% So với tổng</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, index) => {
                const percent = tongDoanhThu > 0 ? (item.doanhThu / tongDoanhThu) * 100 : 0;
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{item.thang}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      {formatCurrency(item.doanhThu)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.doanhThu > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {percent.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 bg-gray-50">
                <td className="py-3 px-4 font-bold text-gray-900">TỔNG</td>
                <td className="py-3 px-4 text-right font-bold text-indigo-600 text-lg">
                  {formatCurrency(tongDoanhThu)}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                    100%
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ThongKePage;