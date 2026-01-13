import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

api.interceptors.request.use((config) => {
  const role = localStorage.getItem("role");
  if (role) {
    config.headers["x-role"] = role;
  }
  return config;
});

export default api;
