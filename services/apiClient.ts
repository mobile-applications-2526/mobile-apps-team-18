import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
/**
 * Dynamically resolves API base URL for Expo (works in dev and prod).
 */
function resolveApiBase() {
  const isDev = __DEV__ === true;
  const hostUri = Constants?.expoConfig?.hostUri;

  if (isDev) {
    const host = hostUri?.split(':')[0] || 'localhost';
    console.log('Using host:', host);
    return `http://${host}:8080`;
  }

  return 'https://kotconnect-team18-backend-hshwbkhff3gzf7b3.westeurope-01.azurewebsites.net';
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
