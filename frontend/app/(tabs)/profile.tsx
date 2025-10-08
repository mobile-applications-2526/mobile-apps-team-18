import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileScreen from '../../screens/ProfileScreen';

export default function ProfileRoute() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ProfileScreen />
    </SafeAreaView>
  );
}
