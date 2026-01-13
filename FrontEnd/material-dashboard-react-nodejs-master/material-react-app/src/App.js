import { useState, useEffect, useMemo, useContext } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

// MUI
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Core components
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Themes
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import themeRTL from "assets/theme/theme-rtl";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Routes & Context
import routes from "routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import { AuthContext } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

// Auth pages
import Login from "auth/login";
import Register from "auth/register";
import ForgotPassword from "auth/forgot-password";
import ResetPassword from "auth/reset-password";

// Protected
import ProtectedRoute from "examples/ProtectedRoute";

// ⚠️ TẠM THỜI: trang đặt phòng online (sẽ làm sau)
const DatPhongOnline = () => <h2>Đặt phòng online (Khách)</h2>;

export default function App() {
  const authContext = useContext(AuthContext);
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // RTL cache
  useMemo(() => {
    setRtlCache(
      createCache({
        key: "rtl",
        stylisPlugins: [rtlPlugin],
      })
    );
  }, []);

  // Sidenav hover
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);

  // Scroll top
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Generate protected routes
  const getRoutes = (allRoutes) =>
  allRoutes.map((route) => {
    if (route.collapse) return getRoutes(route.collapse);

    if (route.route) {
      return (
        <Route
          key={route.key}
          path={route.route}
          element={
            <ProtectedRoute roles={route.roles || []}>
              {route.component}
            </ProtectedRoute>
          }
        />
      );
    }

    return null;
  });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small">settings</Icon>
    </MDBox>
  );

  const mainContent = (
    <>
      <CssBaseline />

      {layout === "dashboard" && authContext.isAuthenticated && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={
              (transparentSidenav && !darkMode) || whiteSidenav
                ? brandDark
                : brandWhite
            }
            brandName="Quản lý khách sạn"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/dat-phong-online" element={<DatPhongOnline />} />

        {/* Auth */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />

        {/* Protected */}
        {getRoutes(routes)}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        {mainContent}
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      {mainContent}
    </ThemeProvider>
  );
}
