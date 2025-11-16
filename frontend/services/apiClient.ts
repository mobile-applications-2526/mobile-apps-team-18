import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
/**
 * Dynamically resolves API base URL for Expo (works in dev and prod).
 */
function resolveApiBase() {
  // 1) Explicit override via .env
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2) Try Expo dev host IP (works for emulator + LAN)

  const hostUri =
    (Constants as any)?.expoConfig?.hostUri || (Constants as any)?.manifest?.debuggerHost;

  if (hostUri) {
    const host = hostUri.split(':')[0];

    return `http://${host}:8080`;
  }

  // 3) Local fallbacks

  if (Platform.OS === 'android') return 'http://10.0.2.2:8080';

  return 'http://localhost:8080';
}

export const API_BASE = resolveApiBase();

/**
 * Safely get stored auth token
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('authToken');
  } catch {
    return null;
  }
}

/**
 * Universal JSON handler
 */
export async function handleJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = undefined;
  }

  if (!res.ok) {
    let msg = 'Request failed';
    if (Array.isArray(data?.errors) && data.errors.length > 0) msg = data.errors.join('\n');
    else if (data?.message) msg = data.message;
    else if (data?.error) msg = data.error;
    else if (text) msg = text;
    else msg = res.statusText || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data ?? ({} as T);
}
