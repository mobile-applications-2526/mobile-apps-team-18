import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { User, SignupInput, SignupUser, Profile } from '../types';



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

export async function login(username: string, password: string): Promise<User> {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await handleJson<User>(res);
  if (!data?.token) {
    throw new Error('No token returned from server');
  }
  return data;
}

export async function signup(input: SignupInput): Promise<SignupUser> {
  const res = await fetch(`${API_BASE}/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleJson<SignupUser>(res);
}

// dit is optioneel als ge bij latere request uw token moet meesturen
export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` } as const;
}

export async function getProfile(token: string): Promise<Profile> {
  const res = await fetch(`${API_BASE}/users/ping`, {
    headers: {
      ...authHeader(token),
      Accept: 'application/json',
    },
  });
  return handleJson<Profile>(res);
}

export async function updateProfile(token: string, input: Partial<Profile>): Promise<Profile> {
  const res = await fetch(`${API_BASE}/users/me`, {
    method: 'PUT',
    headers: {
      ...authHeader(token),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
  });
  return handleJson<Profile>(res);
}

export async function deleteProfile(token: string): Promise<string> {
  const res = await fetch(`${API_BASE}/users/me`, {
    method: 'DELETE',
    headers: {
      ...authHeader(token),
      Accept: 'application/json',
    },
  });
  return handleJson<string>(res);
}

export const userService = { login, signup, getProfile, updateProfile, deleteProfile };
