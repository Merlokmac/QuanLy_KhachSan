import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES, ROLES } from '../constants';
import { useAuth } from '../hooks/useAuth';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ManagerDashboard from '../pages/ManagerDashboard';
import ReceptionistDashboard from '../pages/ReceptionistDashboard';
import CustomerDashboard from '../pages/CustomerDashboard';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const getDefaultRoute = () => {
    if (!isAuthenticated || !user) return ROUTES.LOGIN;
    
    switch (user.RoleID) {
      case ROLES.MANAGER:
        return ROUTES.MANAGER_DASHBOARD;
      case ROLES.RECEPTIONIST:
        return ROUTES.RECEPTIONIST_DASHBOARD;
      case ROLES.CUSTOMER:
        return ROUTES.CUSTOMER_DASHBOARD;
      default:
        return ROUTES.LOGIN;
    }
  };

  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

      <Route
        path={ROUTES.MANAGER_DASHBOARD}
        element={
          <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.RECEPTIONIST_DASHBOARD}
        element={
          <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}>
            <ReceptionistDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.CUSTOMER_DASHBOARD}
        element={
          <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
};