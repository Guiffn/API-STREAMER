import axios from 'axios';
// REMOVA ESTA LINHA: import { AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

// URL
const API_URL = 'http://localhost:5169/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptador para adicionar o token de autenticação em futuras requisições
api.interceptors.request.use(
  (config) => {
    // Note: getSession() is async, so we can't use it directly here.
    // If you need to add the token dynamically, consider storing it in localStorage or a cookie after login.
    // Example using localStorage (update this logic as needed):
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;