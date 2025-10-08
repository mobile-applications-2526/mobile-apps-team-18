import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Task } from '../types';
import * as SecureStore from 'expo-secure-store';

function resolveApiBase() {
  // 1) Explicit override via env
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  // 2) Use Expo dev host IP (works on emulator and devices on the same LAN)
  const hostUri = (Constants as any)?.expoConfig?.hostUri || (Constants as any)?.manifest?.debuggerHost;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:8080`;
  }
  // 3) Fallbacks
  if (Platform.OS === 'android') return 'http://10.0.2.2:8080';
  return 'http://localhost:8080';
}

const API_BASE = resolveApiBase();
async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('authToken');
  } catch {
    return null;
  }
}

async function handleJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: any;
  try { data = text ? JSON.parse(text) : {}; } catch { data = undefined; }
  if (!res.ok) {
    // Backend now returns clean error messages via GlobalExceptionHandler
    let msg = 'Request failed';
    
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      // Join validation errors from backend
      msg = data.errors.join('\n');
    } else if (data?.message) {
      msg = data.message;
    } else if (data?.error) {
      msg = data.error;
    } else if (text) {
      msg = text;
    } else {
      msg = res.statusText || `Request failed (${res.status})`;
    }
    
    throw new Error(msg);
  }
  return (data ?? ({} as T));
}

export async function getTasks(address: string): Promise<Task[]> {
  const token = await getAuthToken();
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