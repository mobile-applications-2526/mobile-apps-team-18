import { Event } from '../types';
import { API_BASE, handleJson } from './apiClient';

export async function createEvent(
  token: string,
  dormCode: string,
  name: string,
  date: string,
  location: string,
  description: string
): Promise<any> {
  const res = await fetch(`${API_BASE}/events/${dormCode}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ name, date, location, description }),
    credentials: 'include',
  });
  return await handleJson(res);
}

export async function joinEvent(token: string, eventId: number): Promise<Event> {
  const res = await fetch(`${API_BASE}/events/join/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      credentials: 'include',
    },
  });
  return await handleJson(res);
}

export async function getById(token: string, eventId: number): Promise<Event> {
  const res = await fetch(`${API_BASE}/events/${eventId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      credentials: 'include',
    },
  });
  return await handleJson(res);
}

const EventService = { createEvent, joinEvent, getById };

export default EventService;
