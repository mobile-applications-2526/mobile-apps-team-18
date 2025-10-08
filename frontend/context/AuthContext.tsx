// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Load auth on mount
  useEffect(() => {
    loadAuth();
  }, []);

  const loadAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const username = await SecureStore.getItemAsync('authUsername');
      const plaats = await SecureStore.getItemAsync('authPlaats');
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
      await SecureStore.setItemAsync('authToken', data.token);
      if (data.username) {
        await SecureStore.setItemAsync('authUsername', data.username);
      }
      if (data.plaats) {
        await SecureStore.setItemAsync('authPlaats', data.plaats);
      }
      setAuth(data);
    } catch (error) {
      console.error('Failed to save auth:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('authUsername');
      await SecureStore.deleteItemAsync('authPlaats');
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
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};