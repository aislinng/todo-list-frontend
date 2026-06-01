import { useState, useCallback } from 'react';
import { Task } from '../types';
import { taskService } from '../services/taskService';

export const useTasks = (listId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAll(listId);
      setTasks(data);
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Error al cargar las tareas.');
    } finally {
      setLoading(false);
    }
  }, [listId]);

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      await taskService.toggleComplete(listId, taskId, completed);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed } : t))
      );
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Error al actualizar la tarea.');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await taskService.delete(listId, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Error al eliminar la tarea.');
    }
  };

  return { tasks, loading, error, fetchTasks, toggleTask, deleteTask };
};