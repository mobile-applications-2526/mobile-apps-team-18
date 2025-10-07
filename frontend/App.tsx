import { StatusBar } from 'expo-status-bar';
import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  const [route, setRoute] = useState<'welcome' | 'login' | 'register' | 'home'>('welcome');
  const [auth, setAuth] = useState<{ token: string; username?: string } | null>(null);

  return (
    <SafeAreaProvider>
      {route === 'welcome' && (
        <WelcomeScreen onLogin={() => setRoute('login')} onRegister={() => setRoute('register')} />
      )}
      {route === 'register' && (
        <RegisterScreen
          onBack={() => setRoute('welcome')}
          onSuccess={() => setRoute('login')}
        />
      )}

      {route === 'login' && (
        <LoginScreen
          onBack={() => setRoute('welcome')}
          onSuccess={(result) => {
            setAuth(result);
            setRoute('home');
          }}
        />
      )}

      {route === 'home' && (
        <HomeScreen
          onLogout={() => {
            setAuth(null);
            setRoute('welcome');
          }}
        />
      )}

      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
