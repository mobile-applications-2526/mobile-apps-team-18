import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreatorScreen from '../../screens/CreatorScreen';
import ExpensesOverviewScreen from '../../screens/expenses/ExpensesOverviewScreen';

export default function ExpensesRoute() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ExpensesOverviewScreen />
    </SafeAreaView>
  );
}