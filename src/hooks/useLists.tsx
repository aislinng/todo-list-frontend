import { useState, useCallback } from 'react';
import { TaskList } from '../types';
import { listService } from '../services/listService';

export const useLists = () => {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listService.getAll();
      setLists(data);
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Error al cargar las listas.');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteList = async (id: string) => {
    try {
      await listService.delete(id);
      setLists((prev) => prev.filter((l) => l.id !== id));
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Error al eliminar la lista.');
    }
  };

  return { lists, loading, error, fetchLists, deleteList };
};