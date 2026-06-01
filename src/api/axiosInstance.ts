import axios from 'axios';
import { auth } from '../services/firebase';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — adjunta el token JWT en cada request
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — manejo centralizado de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Token expirado — Firebase lo renueva automáticamente en el request interceptor
        // pero si persiste, aquí podrías disparar un logout
        console.warn('401 - No autorizado');
      } else if (status === 403) {
        console.warn('403 - Sin permisos');
      } else if (status >= 500) {
        console.error('Error del servidor:', error.response.data);
      }
    } else if (error.request) {
      console.error('Sin respuesta del servidor — verifica tu conexión');
    }
    return Promise.reject(error);
  }
);

export default api;