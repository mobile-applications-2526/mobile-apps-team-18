import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import ExpenseService from '../../services/ExpenseService';
import useSWR, { mutate } from 'swr';
import { Expense } from '../../types';

export default function ExpensesOverviewScreen() {
  const { auth } = useAuth();
  const { data: dorm } = useSWR(auth?.token ? 'homeData' : null);

  if (!auth?.token) return <View><Text>Please login</Text></View>;
  if (!dorm) return <View><Text>No dorm</Text></View>;

  const key = auth?.token && dorm?.id ? ['expenses', dorm.id] : null;

  const fetcher = async () => {
    if (!auth?.token || !dorm?.id) return [];
    return ExpenseService.getExpenses(auth.token, dorm.id);
  };

  const { data: expenses, isValidating, error } = useSWR(key, fetcher);

  if (!auth) return <View><Text>Please login</Text></View>;
  if (!dorm) return <View><Text>No dorm</Text></View>;

  if (isValidating) return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator />
    </View>
  );

  if (error) return <View><Text>Error loading expenses: {(error as Error).message}</Text></View>;

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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 120 }}>
        <Text className="text-2xl font-bold text-white">Expenses</Text>
        {isValidating ? <ActivityIndicator /> : expenses && expenses.map((e) => (
          <View key={e.id} className="rounded-2xl border border-gray-700 bg-gray-900 p-4 mt-4">
            <Text className="text-white font-semibold">{e.title} — €{e.totalAmount}</Text>
            {e.shares?.map((s: any) => (
              <View key={s.id} className="flex-row items-center justify-between mt-2">
                <Text className="text-gray-200">{s.user?.username} — €{s.amount}</Text>
                {(!s.paid && s.user?.username === auth.username!) && (
                  <Pressable onPress={() => handleMarkPaid(e.id!, s.user?.id!)} className="rounded-xl bg-emerald-600 px-3 py-2">
                    <Text className="text-white">Mark paid</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={{ position: 'absolute', left: 16, right: 16, bottom: 70 }}>
        <Pressable
          onPress={() => router.push('/create-expense')}
          accessibilityRole="button"
          className="items-center rounded-2xl bg-emerald-600 px-4 py-3 active:opacity-90">
          <Text className="text-base font-semibold text-white">Create Expense</Text>
        </Pressable>
      </View>
    </View>
  );
}