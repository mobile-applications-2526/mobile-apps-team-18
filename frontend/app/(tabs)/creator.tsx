import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreatorScreen from '../../screens/CreatorScreen';

export default function CreatorRoute() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <CreatorScreen />
    </SafeAreaView>
  );
}