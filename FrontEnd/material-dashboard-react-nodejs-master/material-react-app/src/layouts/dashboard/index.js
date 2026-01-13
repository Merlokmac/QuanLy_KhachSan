import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";

// Material Dashboard components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Dashboard components
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// API
import axios from "axios";

function Dashboard() {
  const [tongQuan, setTongQuan] = useState(null);
  const [doanhThuNgay, setDoanhThuNgay] = useState([]);

  useEffect(() => {
    fetchThongKe();
  }, []);

  const fetchThongKe = async () => {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const [tongQuanRes, doanhThuRes] = await Promise.all([
      axios.get("http://localhost:3001/api/thongke/tong-quan", { headers }),
      axios.get("http://localhost:3001/api/thongke/doanh-thu-ngay", { headers }),
    ]);

    setTongQuan(tongQuanRes.data);
    setDoanhThuNgay(doanhThuRes.data);
  };

  if (!tongQuan) return null;

  return (
    <MDBox py={3}>
      {/* ===== CARDS ===== */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <ComplexStatisticsCard
            color="dark"
            icon="hotel"
            title="Tổng phòng"
            count={tongQuan.tongPhong}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <ComplexStatisticsCard
            color="info"
            icon="meeting_room"
            title="Phòng đang sử dụng"
            count={tongQuan.phongDangSuDung}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <ComplexStatisticsCard
            color="success"
            icon="payments"
            title="Doanh thu hôm nay"
            count={`${tongQuan.doanhThuHomNay.toLocaleString()} đ`}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <ComplexStatisticsCard
            color="warning"
            icon="bar_chart"
            title="Doanh thu tháng"
            count={`${tongQuan.doanhThuThang.toLocaleString()} đ`}
          />
        </Grid>
      </Grid>

      {/* ===== CHART ===== */}
      <MDBox mt={5}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ReportsLineChart
              color="info"
              title="Doanh thu theo ngày"
              description="Biểu đồ doanh thu"
              date="Cập nhật hôm nay"
              chart={{
                labels: doanhThuNgay.map((i) => i.ngay),
                datasets: {
                  label: "Doanh thu",
                  data: doanhThuNgay.map((i) => i.tongTien),
                },
              }}
            />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default Dashboard;
