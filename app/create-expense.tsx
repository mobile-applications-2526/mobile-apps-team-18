import React from 'react';
import ExpenseCreatorScreen from '../screens/expenses/ExpenseCreatorScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateExpenseRoute() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ExpenseCreatorScreen />
    </SafeAreaView>
  );
}
