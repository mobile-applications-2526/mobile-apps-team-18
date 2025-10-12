import React from 'react';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeRedirect() {
  return (
    <SafeAreaView>
      <Redirect href="/(tabs)/home" />
    </SafeAreaView>
  );
}
