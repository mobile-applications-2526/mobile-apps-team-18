import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import useSWR, { mutate } from 'swr';
import { FileText, DollarSign, ArrowLeft, User as UserIcon, Check } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import ExpenseService from '../../services/ExpenseService';
import InputField from '../../components/InputField';
import { User } from '../../types';

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
    if (Number.isNaN(parsed) || parsed <= 0)
      return Alert.alert('Invalid amount', 'Enter a valid amount > 0');
    if (!selectedIds.length)
      return Alert.alert('No participants', 'Select at least one user to split with');

    setLoading(true);
    try {
      await ExpenseService.createExpense(
        auth.token!,
        dorm?.code ?? '',
        title.trim(),
        parsed,
        selectedIds
      );
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

  const splitAmount = selectedIds.length > 0 ? (parseFloat(amount) || 0) / selectedIds.length : 0;

  return (
    <ScrollView contentContainerClassName="px-6 pt-6 pb-8" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="mb-6 flex-row items-center">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 items-center justify-center rounded-full border border-gray-700 active:bg-gray-800">
          <ArrowLeft color="#E5E7EB" size={20} />
        </Pressable>
        <Text className="text-2xl font-bold text-white">New Expense</Text>
      </View>

      {/* Info Card */}
      <View className="mb-6 rounded-3xl border border-orange-600/30 bg-orange-950/20 p-5">
        <Text className="text-center text-sm text-orange-300">
          Split expenses equally with your dorm mates
        </Text>
      </View>

      {/* Form Section */}
      <View className="mb-6 gap-4">
        <InputField
          icon={FileText}
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Groceries, Utilities"
          loading={false}
        />

        <InputField
          icon={DollarSign}
          label="Amount (€)"
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="numeric"
          loading={false}
        />
      </View>

      {/* Split Preview */}
      {selectedIds.length > 0 && amount && parseFloat(amount) > 0 && (
        <View className="mb-6 rounded-3xl border border-emerald-600/30 bg-emerald-950/20 p-5">
          <Text className="mb-2 text-center text-sm uppercase tracking-wide text-emerald-400">
            Per Person
          </Text>
          <Text className="text-center text-3xl font-bold text-white">
            €{splitAmount.toFixed(2)}
          </Text>
          <Text className="mt-2 text-center text-sm text-emerald-300/70">
            Split between {selectedIds.length} {selectedIds.length === 1 ? 'person' : 'people'}
          </Text>
        </View>
      )}

      {/* Participants Section */}
      <View className="mb-6 rounded-3xl border border-gray-700 bg-gray-800 p-5">
        <Text className="mb-4 text-sm font-medium uppercase tracking-wide text-gray-400">
          Split With
        </Text>

        {(dorm?.users as User[] | undefined)?.length ? (
          <View className="gap-2">
            {(dorm?.users as User[] | undefined)?.map((user) => {
              const isSelected = selectedIds.includes(user.id as number);

              return (
                <Pressable
                  key={user.id}
                  onPress={() => toggleSelect(user.id)}
                  className={`flex-row items-center justify-between rounded-2xl border p-4 active:opacity-80 ${
                    isSelected
                      ? 'border-emerald-600/50 bg-emerald-950/20'
                      : 'border-gray-700 bg-gray-900'
                  }`}>
                  <View className="flex-row items-center gap-3">
                    <View
                      className={`h-10 w-10 items-center justify-center rounded-full ${
                        isSelected ? 'bg-emerald-600' : 'bg-gray-700'
                      }`}>
                      <UserIcon color="#fff" size={18} />
                    </View>
                    <View>
                      <Text
                        className={`font-medium ${isSelected ? 'text-emerald-300' : 'text-white'}`}>
                        {user.username}
                      </Text>
                      {isSelected && splitAmount > 0 && (
                        <Text className="text-sm text-emerald-400">€{splitAmount.toFixed(2)}</Text>
                      )}
                    </View>
                  </View>

                  {isSelected && (
                    <View className="h-6 w-6 items-center justify-center rounded-full bg-emerald-600">
                      <Check color="#fff" size={14} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        ) : (
          <Text className="text-center text-sm text-gray-400">No users in dorm</Text>
        )}
      </View>

      {/* Create Button */}
      <Pressable
        accessibilityRole="button"
        onPress={handleCreate}
        disabled={loading}
        className="items-center rounded-2xl bg-emerald-600 px-6 py-4 active:opacity-90 disabled:opacity-50">
        <Text className="text-base font-semibold text-white">
          {loading ? 'Creating...' : 'Create Expense'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
