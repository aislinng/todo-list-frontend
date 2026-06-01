import api from '../api/axiosInstance';
import { ENDPOINTS } from '../api/endpoints';
import { Task } from '../types';

export const taskService = {
  getAll: async (listId: string): Promise<Task[]> => {
    const res = await api.get(ENDPOINTS.tasks(listId));
    return res.data;
  },

  create: async (listId: string, data: Pick<Task, 'title' | 'description' | 'priority' | 'dueDate'>): Promise<Task> => {
    const res = await api.post(ENDPOINTS.tasks(listId), data);
    return res.data;
  },

  update: async (listId: string, taskId: string, data: Partial<Task>): Promise<Task> => {
    const res = await api.put(ENDPOINTS.task(listId, taskId), data);
    return res.data;
  },

  toggleComplete: async (listId: string, taskId: string, completed: boolean): Promise<Task> => {
    const res = await api.patch(ENDPOINTS.task(listId, taskId), { completed });
    return res.data;
  },

  delete: async (listId: string, taskId: string): Promise<void> => {
    await api.delete(ENDPOINTS.task(listId, taskId));
  },
};