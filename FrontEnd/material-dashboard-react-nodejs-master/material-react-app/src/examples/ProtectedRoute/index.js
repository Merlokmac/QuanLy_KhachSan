import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "context";

const ProtectedRoute = ({ roles = [], children }) => {
  const { isAuthenticated, role } = useContext(AuthContext);

  // Chưa đăng nhập → login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Có login nhưng không có quyền
  if (roles.length > 0 && !roles.includes(role)) {
    // redirect theo role
    if (role === "QUAN_LY") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/tables" replace />;
  }

  return children;
};

export default ProtectedRoute;
