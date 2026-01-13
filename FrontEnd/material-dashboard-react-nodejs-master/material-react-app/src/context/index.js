import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useState,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";

/* ================= MATERIAL UI CONTEXT (GIỮ NGUYÊN) ================= */

const MaterialUI = createContext();

/* ================= AUTH CONTEXT ================= */

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  role: null,
  login: () => {},
  logout: () => {},
});

const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  /* ---------- load auth từ localStorage ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) return;

    const parsedUser = JSON.parse(userData);

    setIsAuthenticated(true);
    setUser(parsedUser);
    setRole(parsedUser.role);
  }, []);

  /* ---------- LOGIN ---------- */
  /**
   * payload = { token, user }
   */
  const login = (payload) => {
    const { token, user } = payload;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setIsAuthenticated(true);
    setUser(user);
    setRole(user.role);

    // điều hướng theo role
    if (user.role === "QUAN_LY") {
      navigate("/dashboard");
    } else {
      navigate("/tables");
    }
  };

  /* ---------- LOGOUT ---------- */
  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
    navigate("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= MATERIAL UI REDUCER (GIỮ NGUYÊN) ================= */

MaterialUI.displayName = "MaterialUIContext";

function reducer(state, action) {
  switch (action.type) {
    case "MINI_SIDENAV":
      return { ...state, miniSidenav: action.value };
    case "TRANSPARENT_SIDENAV":
      return { ...state, transparentSidenav: action.value };
    case "WHITE_SIDENAV":
      return { ...state, whiteSidenav: action.value };
    case "SIDENAV_COLOR":
      return { ...state, sidenavColor: action.value };
    case "TRANSPARENT_NAVBAR":
      return { ...state, transparentNavbar: action.value };
    case "FIXED_NAVBAR":
      return { ...state, fixedNavbar: action.value };
    case "OPEN_CONFIGURATOR":
      return { ...state, openConfigurator: action.value };
    case "DIRECTION":
      return { ...state, direction: action.value };
    case "LAYOUT":
      return { ...state, layout: action.value };
    case "DARKMODE":
      return { ...state, darkMode: action.value };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function MaterialUIControllerProvider({ children }) {
  const initialState = {
    miniSidenav: false,
    transparentSidenav: false,
    whiteSidenav: false,
    sidenavColor: "info",
    transparentNavbar: true,
    fixedNavbar: true,
    openConfigurator: false,
    direction: "ltr",
    layout: "dashboard",
    darkMode: false,
  };

  const [controller, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [controller, dispatch], [controller]);

  return <MaterialUI.Provider value={value}>{children}</MaterialUI.Provider>;
}

function useMaterialUIController() {
  const context = useContext(MaterialUI);
  if (!context)
    throw new Error(
      "useMaterialUIController must be used within MaterialUIControllerProvider."
    );
  return context;
}

MaterialUIControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/* ================= EXPORT UTILS ================= */

const setMiniSidenav = (dispatch, value) =>
  dispatch({ type: "MINI_SIDENAV", value });
const setTransparentSidenav = (dispatch, value) =>
  dispatch({ type: "TRANSPARENT_SIDENAV", value });
const setWhiteSidenav = (dispatch, value) =>
  dispatch({ type: "WHITE_SIDENAV", value });
const setSidenavColor = (dispatch, value) =>
  dispatch({ type: "SIDENAV_COLOR", value });
const setTransparentNavbar = (dispatch, value) =>
  dispatch({ type: "TRANSPARENT_NAVBAR", value });
const setFixedNavbar = (dispatch, value) =>
  dispatch({ type: "FIXED_NAVBAR", value });
const setOpenConfigurator = (dispatch, value) =>
  dispatch({ type: "OPEN_CONFIGURATOR", value });
const setDirection = (dispatch, value) =>
  dispatch({ type: "DIRECTION", value });
const setLayout = (dispatch, value) =>
  dispatch({ type: "LAYOUT", value });
const setDarkMode = (dispatch, value) =>
  dispatch({ type: "DARKMODE", value });

export {
  AuthContextProvider,
  MaterialUIControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDirection,
  setLayout,
  setDarkMode,
};
