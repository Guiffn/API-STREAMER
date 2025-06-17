import axios from 'axios';
import { getSession } from 'next-auth/react';

// URL
const API_URL = 'http://localhost:5169/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptador para adicionar o token de autenticação em futuras requisições
api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export default api;