import { Task } from '../types';
import { API_BASE, handleJson } from './apiClient';

export async function getTasks(token: string): Promise<Task[]> {
  const url = `${API_BASE}/tasks/all`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleJson<Task[]>(res);
}

export const taskService = { getTasks };
