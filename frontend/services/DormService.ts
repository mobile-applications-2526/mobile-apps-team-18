import { Dorm } from '../types';
import { API_BASE, handleJson } from './apiClient';

export async function getDorm(token: string): Promise<Dorm> {
  const url = `${API_BASE}/dorms`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
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
  });
  return await handleJson(res);
}

const DormService = { getDorm, addUserToDormByCode };

export default DormService;
