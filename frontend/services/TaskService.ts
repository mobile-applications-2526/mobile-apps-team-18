import { TaskType } from '../types';
import { API_BASE, handleJson } from './apiClient';

export async function createTask(token: string, dormCode: string, title: string, date: string, type: TaskType, description: string): Promise<any> {
  const res = await fetch(`${API_BASE}/tasks/${dormCode}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ title, date, type, description }),
  });
  return await handleJson(res);
}

const TaskService = { createTask };

export default TaskService;