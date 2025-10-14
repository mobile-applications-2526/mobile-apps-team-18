// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

type AuthData = {
  token: string;
  username?: string;
  plaats?: string;
};

type AuthContextType = {
  auth: AuthData | null;
  isLoading: boolean;
  login: (data: AuthData) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuth();
  }, []);

  const storageSet = async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  };

  const storageGet = async (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  };

  const storageDelete = async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  };

  const loadAuth = async () => {
    try {
      const token = await storageGet('authToken');
      const username = await storageGet('authUsername');
      const plaats = await storageGet('authPlaats');
      if (token) {
        setAuth({ token, username: username || undefined, plaats: plaats || undefined });
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: AuthData) => {
    try {
      await storageSet('authToken', data.token);
      if (data.username) await storageSet('authUsername', data.username);
      if (data.plaats) await storageSet('authPlaats', data.plaats);
      setAuth(data);
    } catch (error) {
      console.error('Failed to save auth:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await storageDelete('authToken');
      await storageDelete('authUsername');
      await storageDelete('authPlaats');
      setAuth(null);
    } catch (error) {
      console.error('Failed to clear auth:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
