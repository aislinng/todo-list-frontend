export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

export interface TaskList {
  id: string;
  title: string;
  description?: string;
  color?: string;
  taskCount?: number;
  completedCount?: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  listId: string;
  createdAt: string;
  updatedAt: string;
}

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  ListDetail: { listId: string; listTitle: string };
  ListForm: { list?: TaskList };
  TaskForm: { listId: string; task?: Task };
};