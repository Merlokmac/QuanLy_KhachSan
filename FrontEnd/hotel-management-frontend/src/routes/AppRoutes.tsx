import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants';

// Pages
import LoginPage from '../pages/LoginPage';
import Layout from '../components/common/Layout';
import DashboardPage from '../pages/DashboardPage';
import PhongPage from '../pages/PhongPage';
import KhachHangPage from '../pages/KhachHangPage';
import DatPhongPage from '../pages/DatPhongPage';
import DichVuPage from '../pages/DichVuPage';
import ThongKePage from '../pages/ThongKePage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path={ROUTES.LOGIN}
        element={isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <LoginPage />}
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path={ROUTES.PHONG} element={<PhongPage />} />
        <Route path={ROUTES.KHACH_HANG} element={<KhachHangPage />} />
        <Route path={ROUTES.DAT_PHONG} element={<DatPhongPage />} />
        
        {/* Admin only routes */}
        <Route
          path={ROUTES.DICH_VU}
          element={
            <ProtectedRoute adminOnly>
              <DichVuPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.THONG_KE}
          element={
            <ProtectedRoute adminOnly>
              <ThongKePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};

export default AppRoutes;