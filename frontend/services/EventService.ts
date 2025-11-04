import { API_BASE, handleJson } from './apiClient';

export async function createEvent(token: string, dormCode: string, name: string, date: string, location: string, description: string): Promise<any> {
  const res = await fetch(`${API_BASE}/events/${dormCode}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ name, date, location, description }),
  });
  return await handleJson(res);
}

const EventService = { createEvent };

export default EventService;