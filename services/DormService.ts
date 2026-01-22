import { Dorm } from '../types';
import { API_BASE, handleJson } from './apiClient';

export async function getDorm(token: string): Promise<Dorm | null> {
  const url = `${API_BASE}/dorms`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  });

  if (res.status === 204) {
    return null;
  }

  return handleJson<Dorm>(res);
}

export async function addUserToDormByCode(token: string, code: string): Promise<Dorm> {
  const res = await fetch(`${API_BASE}/dorms`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ code }),
    credentials: 'include',
  });
  return await handleJson(res);
}

export async function createDorm(token: string, name: string): Promise<Dorm> {
  const res = await fetch(`${API_BASE}/dorms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ name }),
    credentials: 'include',
  });
  return await handleJson(res);
}

export async function leaveDorm(token: string): Promise<Dorm> {
  const res = await fetch(`${API_BASE}/dorms`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  });
  return await handleJson(res);
}

const DormService = { getDorm, addUserToDormByCode, createDorm, leaveDorm };

export default DormService;
