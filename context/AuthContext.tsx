// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { AuthenticationResponse } from '../types';

type AuthContextType = {
  auth: AuthenticationResponse | null;
  isLoading: boolean;
  login: (data: AuthenticationResponse) => Promise<void>;
  logout: () => Promise<void>;
  updateAuth: (updates: Partial<AuthenticationResponse>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthenticationResponse | null>(null);
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
      const email = await storageGet('authEmail');
      const geboortedatum = await storageGet('authGeboortedatum');
      const locatie = await storageGet('authLocatie');

      if (token) {
        setAuth({
          token,
          username: username || undefined,
          email: email || undefined,
          geboortedatum: geboortedatum || undefined,
          locatie: locatie || undefined,
        });
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: AuthenticationResponse) => {
    try {
      await storageSet('authToken', data.token as string);
      if (data.username) await storageSet('authUsername', data.username);
      if (data.email) await storageSet('authEmail', data.email);
      if (data.geboortedatum) await storageSet('authGeboortedatum', data.geboortedatum);
      if (data.locatie) await storageSet('authLocatie', data.locatie);

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
      await storageDelete('authEmail');
      await storageDelete('authGeboortedatum');
      await storageDelete('authLocatie');

      setAuth(null);
    } catch (error) {
      console.error('Failed to clear auth:', error);
    }
  };

  const updateAuth = (updates: Partial<AuthenticationResponse>) => {
    setAuth((prev) => {
      if (!prev) return prev;
      const newAuth = { ...prev, ...updates };

      // Persist all updated fields

      if (updates.token !== undefined) {
        storageSet('authToken', updates.token);
      }

      if (updates.username !== undefined) {
        if (updates.username) {
          storageSet('authUsername', updates.username);
        } else {
          storageDelete('authUsername');
        }
      }
      if (updates.email !== undefined) {
        if (updates.email) {
          storageSet('authEmail', updates.email);
        } else {
          storageDelete('authEmail');
        }
      }
      if (updates.geboortedatum !== undefined) {
        if (updates.geboortedatum) {
          storageSet('authGeboortedatum', updates.geboortedatum);
        } else {
          storageDelete('authGeboortedatum');
        }
      }
      if (updates.locatie !== undefined) {
        if (updates.locatie) {
          storageSet('authLocatie', updates.locatie);
        } else {
          storageDelete('authLocatie');
        }
      }

      return newAuth;
    });
  };

  return (
    <AuthContext.Provider value={{ auth, isLoading, login, logout, updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
