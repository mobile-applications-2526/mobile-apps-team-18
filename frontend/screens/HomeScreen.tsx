'use client';

import { View, Text, Pressable, TextInput, Alert, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import useSWR, { mutate } from 'swr';
import { useState, useMemo } from 'react';
import DormService from '../services/DormService';
import type { Dorm } from '../types';
import SectionHeader from '../components/SectionHeader';
import React from 'react';
import { Check, X } from 'lucide-react-native';

export const HomeScreen = () => {
  const { logout, auth, isLoading } = useAuth();
  const [code, setCode] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const fetcher = async (): Promise<Dorm> => {
    if (!auth?.token) throw new Error('No auth token');
    return await DormService.getDorm(auth.token);
  };

  const {
    data: dorm,
    isLoading: dataLoading,
    error,
  } = useSWR(auth?.token ? 'homeData' : null, fetcher, {
    revalidateOnFocus: false,
  });

  const handleJoinDorm = async () => {
    if (!code || !code.trim()) {
      Alert.alert('Missing Code', 'Please enter a dorm code before joining.');
      return;
    }

    const response = await DormService.addUserToDormByCode(auth?.token as string, code);

    if (response) {
      setCode('');
      mutate('homeData');
    }
  };

  const weekDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  const monthYear = useMemo(() => {
    const months = [
      'Januari',
      'Februari',
      'Maart',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Augustus',
      'September',
      'Oktober',
      'November',
      'December',
    ];
    return `${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  }, [selectedDate]);

  const selectedDayLabel = useMemo(() => {
    const days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
    const months = [
      'januari',
      'februari',
      'maart',
      'april',
      'mei',
      'juni',
      'juli',
      'augustus',
      'september',
      'oktober',
      'november',
      'december',
    ];
    return `${days[selectedDate.getDay()]} ${selectedDate.getDate()} ${months[selectedDate.getMonth()]}`;
  }, [selectedDate]);

  const selectedDateString = useMemo(() => {
    return selectedDate.toISOString().split('T')[0];
  }, [selectedDate]);

  const filteredTasks = useMemo(() => {
    if (!dorm?.tasks) return [];
    return dorm.tasks.filter((task) => task.date?.startsWith(selectedDateString));
  }, [dorm?.tasks, selectedDateString]);

  const filteredEvents = useMemo(() => {
    if (!dorm?.events) return [];
    return dorm.events.filter((event) => event.date.startsWith(selectedDateString));
  }, [dorm?.events, selectedDateString]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <View className="h-12 w-12 rounded-full border-4 border-gray-700 border-t-emerald-500" />
        <Text className="mt-4 text-gray-400">Loading...</Text>
      </View>
    );
  }

  if (!auth) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="font-bold text-red-500">Please login to access this page.</Text>
      </View>
    );
  }

  if (error || !dorm) {
    return (
      <ScrollView contentContainerClassName="px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="mb-6 text-3xl font-bold text-white">Homepage</Text>

        <View className="rounded-3xl border border-gray-700 bg-gray-800 p-6">
          <View className="items-center">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600">
              <Text className="text-3xl">🏠</Text>
            </View>
            <Text className="mb-2 text-center text-xl font-bold text-white">
              You don't have a dorm yet
            </Text>
            <Text className="mb-6 text-center text-sm text-gray-400">
              Enter your dorm code to get started
            </Text>

            <TextInput
              placeholder="Enter dorm code"
              placeholderTextColor="#6B7280"
              className="mb-4 w-full rounded-2xl border border-gray-700 bg-gray-900 px-4 py-3 text-white"
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
            />

            <Pressable
              onPress={handleJoinDorm}
              className="w-full rounded-2xl bg-emerald-600 px-4 py-3 active:opacity-80"
              accessibilityRole="button"
              accessibilityLabel="Join dorm">
              <Text className="text-center font-semibold text-white">Join Dorm</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerClassName="px-6 pt-6" showsVerticalScrollIndicator={false}>
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-white">{dorm.name}</Text>
        <Pressable
          onPress={handleLogout}
          className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel="Logout">
          <Text className="text-sm font-medium text-gray-300">Logout</Text>
        </Pressable>
      </View>

      <View className="mb-4 rounded-3xl border border-gray-700 bg-gray-800 p-5">
        <Text className="mb-4 text-center text-xl font-semibold text-white">{monthYear}</Text>

        <View className="flex-row justify-between">
          {['M', 'D', 'W', 'D', 'V', 'Z', 'Z'].map((day, index) => (
            <View key={index} className="items-center" style={{ width: 40 }}>
              <Text className="mb-3 text-xs font-medium text-gray-500">{day}</Text>
              <Pressable
                onPress={() => setSelectedDate(weekDates[index])}
                className={`h-10 w-10 items-center justify-center rounded-full ${
                  selectedDate.toDateString() === weekDates[index].toDateString()
                    ? 'bg-white'
                    : 'bg-transparent'
                }`}>
                <Text
                  className={`text-sm font-semibold ${
                    selectedDate.toDateString() === weekDates[index].toDateString()
                      ? 'text-gray-950'
                      : 'text-gray-300'
                  }`}>
                  {weekDates[index].getDate()}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>

      <View className="rounded-3xl border border-gray-700 bg-gray-800 px-5">
        <SectionHeader title={selectedDayLabel} />

        {filteredTasks.length === 0 && filteredEvents.length === 0 ? (
          <View className="py-8">
            <Text className="text-center text-sm text-gray-500">
              Geen taken of evenementen voor deze dag
            </Text>
          </View>
        ) : (
          <View className="gap-3 pb-5">
            {filteredTasks.map((task) => (
              <View key={task.id} className="rounded-2xl border border-gray-700 bg-gray-900 p-4">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="mb-2 text-base font-semibold text-white">{task.title}</Text>
                    <View className="flex-row items-center gap-2">
                      <View className="rounded-full bg-emerald-600/20 px-3 py-1">
                        <Text className="text-xs font-medium text-emerald-400">Taak</Text>
                      </View>
                      <Text className="text-sm text-gray-400">{task.assignedUser?.username}</Text>

                      <View
                        className={`ml-auto rounded-full p-2 ${
                          task.done ? 'bg-green-500/30' : 'bg-red-500/30'
                        }`}>
                        {task.done ? (
                          <Check size={16} color="#22c55e" />
                        ) : (
                          <X size={16} color="#ef4444" />
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
            {filteredEvents.map((event) => (
              <View key={event.id} className="rounded-2xl border border-gray-700 bg-gray-900 p-4">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="mb-2 text-base font-semibold text-white">{event.name}</Text>
                    <View className="mb-1 flex-row items-center gap-2">
                      <View className="rounded-full bg-purple-600/20 px-3 py-1">
                        <Text className="text-xs font-medium text-purple-400">Evenement</Text>
                      </View>
                      <Text className="text-sm text-gray-400">{event.organizer?.username}</Text>

                      <View
                        className={`ml-auto rounded-full p-2 ${
                          event.done ? 'bg-green-500/30' : 'bg-red-500/30'
                        }`}>
                        {event.done ? (
                          <Check size={16} color="#22c55e" />
                        ) : (
                          <X size={16} color="#ef4444" />
                        )}
                      </View>
                    </View>

                    {event.location && (
                      <Text className="mt-1 text-xs text-gray-500">📍 {event.location}</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
