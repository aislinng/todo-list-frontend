export const ENDPOINTS = {
  // Auth / Usuario
  register: '/users',
  me: '/users/me',

  // Listas
  lists: '/lists',
  list: (id: string) => `/lists/${id}`,

  // Tareas
  tasks: (listId: string) => `/lists/${listId}/tasks`,
  task: (listId: string, taskId: string) => `/lists/${listId}/tasks/${taskId}`,

  // Búsqueda
  search: '/search',
};