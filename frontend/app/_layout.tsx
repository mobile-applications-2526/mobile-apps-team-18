import './global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          gestureDirection: 'horizontal',
        }}
      />
      <StatusBar style="light" />
    </AuthProvider>
  );
}
