/**
 * CHE·NU — Task Store (Zustand)
 */

import { create } from 'zustand';
import { 
  tasksService, 
  Task, 
  TaskList,
  TaskStatus,
  TaskPriority,
  CreateTaskRequest,
  UpdateTaskRequest 
} from '@/services/tasks';

interface TaskState {
  tasks: Task[];
  taskLists: TaskList[];
  selectedList: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Filters
  statusFilter: TaskStatus | null;
  priorityFilter: TaskPriority | null;
  
  // Pagination
  total: number;
  page: number;
  
  // Actions
  fetchTasks: (params?: { task_list_id?: string; status?: TaskStatus }) => Promise<void>;
  fetchLists: () => Promise<void>;
  createTask: (data: CreateTaskRequest) => Promise<Task>;
  updateTask: (taskId: string, data: UpdateTaskRequest) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleComplete: (task: Task) => Promise<void>;
  
  // List actions
  createList: (data: { name: string; color?: string }) => Promise<TaskList>;
  selectList: (listId: string | null) => void;
  
  // Filters
  setStatusFilter: (status: TaskStatus | null) => void;
  setPriorityFilter: (priority: TaskPriority | null) => void;
  
  clearError: () => void;
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  taskLists: [],
  selectedList: null,
  isLoading: false,
  error: null,
  statusFilter: null,
  priorityFilter: null,
  total: 0,
  page: 1,

  fetchTasks: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const { statusFilter, priorityFilter, selectedList } = get();
      const response = await tasksService.list({
        task_list_id: params?.task_list_id || selectedList || undefined,
        status: params?.status || statusFilter || undefined,
        priority: priorityFilter || undefined,
      });
      set({
        tasks: response.data,
        total: response.total,
        page: response.page,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur de chargement',
        isLoading: false 
      });
    }
  },

  fetchLists: async () => {
    try {
      const lists = await tasksService.getLists();
      set({ taskLists: lists });
    } catch (error) {
      console.error('Failed to fetch task lists:', error);
    }
  },

  createTask: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const task = await tasksService.create(data);
      set((state) => ({
        tasks: [task, ...state.tasks],
        isLoading: false,
      }));
      return task;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur de création',
        isLoading: false 
      });
      throw error;
    }
  },

  updateTask: async (taskId, data) => {
    try {
      const updated = await tasksService.update(taskId, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updated : t)),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour' });
    }
  },

  deleteTask: async (taskId) => {
    try {
      await tasksService.delete(taskId);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erreur de suppression' });
    }
  },

  toggleComplete: async (task) => {
    try {
      const updated = await tasksService.toggleComplete(task);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === task.id ? updated : t)),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erreur' });
    }
  },

  createList: async (data) => {
    try {
      const list = await tasksService.createList(data);
      set((state) => ({
        taskLists: [...state.taskLists, list],
      }));
      return list;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erreur de création' });
      throw error;
    }
  },

  selectList: (listId) => {
    set({ selectedList: listId });
    get().fetchTasks({ task_list_id: listId || undefined });
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status });
    get().fetchTasks();
  },

  setPriorityFilter: (priority) => {
    set({ priorityFilter: priority });
    get().fetchTasks();
  },

  clearError: () => set({ error: null }),
}));

export default useTaskStore;
