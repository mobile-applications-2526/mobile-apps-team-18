import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginScreen from '../screens/auth/LoginScreen';

export default function login() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <LoginScreen />
    </SafeAreaView>
  );
}
