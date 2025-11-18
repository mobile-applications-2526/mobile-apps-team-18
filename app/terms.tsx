import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TermsPrivacyScreen from '../screens/profile/TermsPrivacyScreen';

export default function terms() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <TermsPrivacyScreen />
    </SafeAreaView>
  );
}
