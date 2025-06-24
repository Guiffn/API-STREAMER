import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5169/api",
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const rotaAtual = window.location.pathname;

    if (status === 401 && !rotaAtual.includes("/usuario/login")) {
      console.warn("Token inválido ou expirado. Redirecionando para login.");
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("permission");
      window.location.replace("/usuario/login");
    }

    return Promise.reject(error);
  }
);

export default api;