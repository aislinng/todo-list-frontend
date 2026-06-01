import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import api from '../api/axiosInstance';
import { ENDPOINTS } from '../api/endpoints';

export const authService = {
  loginWithEmail: async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdToken();
    return { user: result.user, token };
  },

  registerWithEmail: async (email: string, password: string, displayName: string) => {
    try {
      await api.post(ENDPOINTS.register, { fullName: displayName, email, password });
    } catch (e: any) {
      const data = e.response?.data;
      const msg =
        typeof data === 'string'
          ? data
          : data?.message ?? data?.title ?? 'Error al registrarse. Verifica los datos.';
      throw new Error(msg);
    }
    const result = await signInWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdToken();
    return { user: result.user, token };
  },
};
