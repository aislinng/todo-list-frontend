import api from '../api/axiosInstance';
import { ENDPOINTS } from '../api/endpoints';
import { TaskList } from '../types';

export const listService = {
  getAll: async (): Promise<TaskList[]> => {
    const res = await api.get(ENDPOINTS.lists);
    return res.data;
  },

  getById: async (id: string): Promise<TaskList> => {
    const res = await api.get(ENDPOINTS.list(id));
    return res.data;
  },

  create: async (data: Pick<TaskList, 'title' | 'description' | 'color'>): Promise<TaskList> => {
    const res = await api.post(ENDPOINTS.lists, data);
    return res.data;
  },

  update: async (id: string, data: Partial<TaskList>): Promise<TaskList> => {
    const res = await api.put(ENDPOINTS.list(id), data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.list(id));
  },
};