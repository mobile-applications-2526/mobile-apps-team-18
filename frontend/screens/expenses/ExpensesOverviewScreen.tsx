import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import useSWR, { mutate } from 'swr';
import { ArrowLeft, Plus, Receipt, User as UserIcon } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import ExpenseService from '../../services/ExpenseService';

export default function ExpensesOverviewScreen() {
  const { auth } = useAuth();
  const { data: dorm } = useSWR(auth?.token ? 'homeData' : null);

  if (!auth?.token)
    return (
      <View>
        <Text>Please login</Text>
      </View>
    );
  if (!dorm)
    return (
      <View>
        <Text>No dorm</Text>
      </View>
    );

  const key = auth?.token && dorm?.id ? ['expenses', dorm.id] : null;

  const fetcher = async () => {
    if (!auth?.token || !dorm?.id) return [];
    return ExpenseService.getExpenses(auth.token, dorm.id);
  };

  const { data: expenses, isValidating, error } = useSWR(key, fetcher);

  if (!auth)
    return (
      <View>
        <Text>Please login</Text>
      </View>
    );
  if (!dorm)
    return (
      <View>
        <Text>No dorm</Text>
      </View>
    );

  if (isValidating)
    return (
      <View className="flex-1 items-center justify-center bg-gray-950">
        <ActivityIndicator color="#10b981" />
      </View>
    );

  if (error)
    return (
      <View className="flex-1 items-center justify-center bg-gray-950">
        <Text className="text-red-400">Error loading expenses: {(error as Error).message}</Text>
      </View>
    );

  const handleMarkPaid = async (expenseId: number, userId: number) => {
    try {
      await ExpenseService.markPaid(auth.token!, expenseId, userId);
      mutate('homeData');
      mutate(key);
      if (dorm?.id) mutate(['expenses', dorm.id]);
    } catch (err) {
      Alert.alert('Error', 'Could not mark as paid.');
    }
  };

  const totalOwed =
    expenses?.reduce((sum, expense) => {
      const myShare = expense.shares?.find((s: any) => s.user?.username === auth.username);
      return sum + (myShare && !myShare.paid ? (myShare.amount ?? 0) : 0);
    }, 0) || 0;

  return (
    <>
      <ScrollView contentContainerClassName="px-6 pt-6 pb-36" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6 flex-row items-center">
          <Text className="text-3xl font-bold text-white">Expenses</Text>
        </View>

        <View className="mb-6 flex-row items-center justify-between rounded-2xl border border-emerald-600/30 bg-emerald-950/20 p-4">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20">
              <Receipt color="#10B981" size={24} />
            </View>
            <View>
              <Text className="text-xs uppercase tracking-wide text-emerald-400">You Owe</Text>
              <Text className="text-2xl font-bold text-white">€{totalOwed.toFixed(2)}</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-xs text-gray-400">Total</Text>
            <Text className="text-sm font-medium text-gray-300">
              {expenses?.length || 0} expenses
            </Text>
          </View>
        </View>

        {expenses && expenses.length > 0 ? (
          <View className="gap-3">
            {expenses.map((expense) => {
              const myShare = expense.shares?.find((s: any) => s.user?.username === auth.username);
              const isPaid = myShare?.paid;

              return (
                <View
                  key={expense.id}
                  className="rounded-2xl border border-gray-700 bg-gray-800 p-4">
                  {/* Expense Header */}
                  <View className="mb-3 flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="mb-1 text-base font-semibold text-white">
                        {expense.title}
                      </Text>
                      <Text className="text-xl font-bold text-emerald-400">
                        €{expense.totalAmount}
                      </Text>
                    </View>
                    {isPaid && (
                      <View className="rounded-full bg-emerald-600/20 px-3 py-1">
                        <Text className="text-xs font-medium text-emerald-400">Paid</Text>
                      </View>
                    )}
                  </View>

                  {/* Divider */}
                  <View className="mb-3 h-px bg-gray-700" />

                  <View className="gap-2">
                    {expense.shares?.map((share: any) => {
                      const isCurrentUser = share.user?.username === auth.username;

                      return (
                        <View
                          key={share.id}
                          className={`flex-row items-center justify-between rounded-xl p-2 ${
                            isCurrentUser ? 'bg-emerald-950/10' : 'bg-gray-900'
                          }`}>
                          <View className="flex-row items-center gap-2">
                            <View className="h-8 w-8 items-center justify-center rounded-full bg-gray-700">
                              <UserIcon color="#fff" size={14} />
                            </View>
                            <Text
                              className={`text-sm font-medium ${isCurrentUser ? 'text-emerald-300' : 'text-white'}`}>
                              {share.user?.username}
                              {isCurrentUser && ' (you)'}
                            </Text>
                            <Text className="text-sm text-gray-400">€{share.amount}</Text>
                          </View>

                          {!share.paid && isCurrentUser && (
                            <Pressable
                              onPress={() => handleMarkPaid(expense.id!, share.user?.id!)}
                              className="rounded-lg bg-emerald-600 px-3 py-1 active:opacity-80">
                              <Text className="text-xs font-semibold text-white">Mark Paid</Text>
                            </Pressable>
                          )}

                          {share.paid && (
                            <View className="rounded-full bg-emerald-600/20 px-2 py-1">
                              <Text className="text-xs font-medium text-emerald-400">✓</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View className="rounded-2xl border border-gray-700 bg-gray-800 p-6">
            <Text className="text-center text-sm text-gray-400">
              No expenses yet. Create one to get started!
            </Text>
          </View>
        )}
      </ScrollView>

      <View className="absolute bottom-28 left-6 right-6">
        <Pressable
          onPress={() => router.push('/create-expense')}
          accessibilityRole="button"
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 shadow-lg active:opacity-90">
          <Plus color="#fff" size={20} />
          <Text className="text-base font-semibold text-white">Create Expense</Text>
        </Pressable>
      </View>
    </>
  );
}
