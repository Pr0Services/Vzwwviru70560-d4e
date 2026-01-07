/**
 * CHE·NU — Tasks Service
 * 
 * ALIGNÉ AVEC BACKEND API: /app/api/endpoints/tasks.py
 */

import api from './api';

// ALIGNÉ AVEC BACKEND: TaskStatus enum
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'blocked' | 'done' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskType = 'manual' | 'agent' | 'automated';

export interface Task {
  id: string;
  user_id: string;
  task_list_id?: string;
  parent_id?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  reminder_at?: string;
  completed_at?: string;
  estimated_minutes?: number;
  actual_minutes?: number;
  tags?: string[];
  attachments?: unknown[];
  is_recurring: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TaskList {
  id: string;
  user_id: string;
  sphere_id?: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  is_default: boolean;
  is_archived: boolean;
  sort_order: number;
  tasks: Task[];
  created_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  task_list_id?: string;
  parent_id?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  reminder_at?: string;
  estimated_minutes?: number;
  tags?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  task_list_id?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  reminder_at?: string;
  estimated_minutes?: number;
  actual_minutes?: number;
  tags?: string[];
  sort_order?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

class TasksService {
  // Task Lists
  async getLists(): Promise<TaskList[]> {
    return api.get<TaskList[]>('/tasks/lists');
  }

  async createList(data: {
    name: string;
    description?: string;
    sphere_id?: string;
    color?: string;
    icon?: string;
  }): Promise<TaskList> {
    return api.post<TaskList>('/tasks/lists', data);
  }

  // Tasks
  async list(params?: {
    task_list_id?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Task>> {
    const queryParams: Record<string, string> = {};
    if (params?.task_list_id) queryParams.task_list_id = params.task_list_id;
    if (params?.status) queryParams.status = params.status;
    if (params?.priority) queryParams.priority = params.priority;
    if (params?.page) queryParams.page = String(params.page);
    if (params?.page_size) queryParams.page_size = String(params.page_size);

    return api.get<PaginatedResponse<Task>>('/tasks', queryParams);
  }

  async get(taskId: string): Promise<Task> {
    return api.get<Task>(`/tasks/${taskId}`);
  }

  async create(data: CreateTaskRequest): Promise<Task> {
    return api.post<Task>('/tasks', data);
  }

  async update(taskId: string, data: UpdateTaskRequest): Promise<Task> {
    return api.patch<Task>(`/tasks/${taskId}`, data);
  }

  async delete(taskId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
  }

  async complete(taskId: string): Promise<Task> {
    return api.post<Task>(`/tasks/${taskId}/complete`);
  }

  // Quick actions
  async toggleComplete(task: Task): Promise<Task> {
    if (task.status === 'done') {
      return this.update(task.id, { status: 'todo' });
    }
    return this.complete(task.id);
  }

  async setPriority(taskId: string, priority: TaskPriority): Promise<Task> {
    return this.update(taskId, { priority });
  }
}

export const tasksService = new TasksService();
export default tasksService;
