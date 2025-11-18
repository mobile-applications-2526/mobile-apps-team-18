import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileScreen from '../screens/profile/ProfileScreen';

export default function profile() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ProfileScreen />
    </SafeAreaView>
  );
}
