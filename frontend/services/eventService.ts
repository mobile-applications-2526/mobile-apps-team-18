import { Event } from '../types';
import { API_BASE, handleJson } from './apiClient';

export async function getEvents(token: string): Promise<Event[]> {
  const url = `${API_BASE}/events/all`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleJson<Event[]>(res);
}

export const eventService = { getEvents };
