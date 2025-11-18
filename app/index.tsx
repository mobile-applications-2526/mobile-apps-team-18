import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import WelcomeScreen from '../screens/auth/WelcomeScreen';

export default function index() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <WelcomeScreen />
    </SafeAreaView>
  );
}
