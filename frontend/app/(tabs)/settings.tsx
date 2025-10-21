import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingsScreen from '../../screens/profile/SettingsScreen';

export default function SettingsRoute() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <SettingsScreen />
    </SafeAreaView>
  );
}
