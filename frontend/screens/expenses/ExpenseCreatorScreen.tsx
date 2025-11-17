import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import useSWR, { mutate } from 'swr';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/InputField';
import { FileText, User as UserIcon, ChevronLeft } from 'lucide-react-native';
import ExpenseService from '../../services/ExpenseService';
import type { User } from '../../types';

export default function ExpenseCreatorScreen() {
  const { auth } = useAuth();
  const { data: dorm } = useSWR(auth?.token ? 'homeData' : null);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSelect = (id?: number) => {
    if (!id) return;
    setSelectedIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const handleCreate = async () => {
    if (!auth?.token) return Alert.alert('Unauthorized');
    if (!title.trim()) return Alert.alert('Missing title', 'Please enter a title');
    const parsed = parseFloat(amount);
    if (Number.isNaN(parsed) || parsed <= 0) return Alert.alert('Invalid amount', 'Enter a valid amount > 0');
    if (!selectedIds.length) return Alert.alert('No participants', 'Select at least one user to split with');

    setLoading(true);
    try {
      await ExpenseService.createExpense(auth.token!, dorm?.code ?? '', title.trim(), parsed, selectedIds);
      mutate('homeData');
      mutate('expenses');
      if (dorm?.id) mutate(['expenses', dorm.id]);
      Alert.alert('Created', 'Expense created successfully');
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 12 }}>
      <Pressable onPress={() => router.back()} className="mb-4 inline-flex items-start">
        <ChevronLeft color="#22c55e" size={20} />
        <Text className="ml-2 text-sm text-emerald-400">Back</Text>
      </Pressable>
      <Text className="text-2xl font-bold text-white">New Expense</Text>

      <View className="mt-4">
        <InputField
          icon={FileText}
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Groceries"
          loading={false}
        />

        <InputField
          icon={FileText}
          label="Amount (€)"
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="numeric"
          loading={false}
        />

        <View className="mt-4 rounded-2xl border border-gray-700 bg-gray-800 p-4">
          <Text className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-400">Split with</Text>
          {(dorm?.users as User[] | undefined)?.map((u) => (
            <Pressable
              key={u.id}
              onPress={() => toggleSelect(u.id)}
              className={`mb-2 flex-row items-center justify-between rounded-lg px-3 py-2 ${
                selectedIds.includes(u.id as number) ? 'bg-emerald-600/20' : 'bg-gray-900'
              }`}>
              <View className="flex-row items-center gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-gray-700">
                  <UserIcon color="#fff" size={16} />
                </View>
                <Text className="text-base text-white">{u.username}</Text>
              </View>
              <Text className="text-sm text-gray-300">{selectedIds.includes(u.id as number) ? 'Selected' : 'Tap to select'}</Text>
            </Pressable>
          )) ?? <Text className="text-sm text-gray-400">No users in dorm</Text>}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleCreate}
          disabled={loading}
          className="mt-6 items-center rounded-2xl bg-emerald-600 px-4 py-3 active:opacity-90">
          <Text className="text-base font-semibold text-white">{loading ? 'Creating...' : 'Create Expense'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}