import { View, Text, Pressable, TextInput, Alert, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import useSWR, { mutate } from 'swr';
import { useState, useMemo } from 'react';
import DormService from '../services/DormService';
import type { Dorm } from '../types';
import SectionHeader from '../components/SectionHeader';
import { Check, X } from 'lucide-react-native';
import React from 'react';

export const HomeScreen = () => {
  const { logout, auth, isLoading } = useAuth();
  const [code, setCode] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

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
  } = useSWR(auth?.token ? 'homeData' : null, fetcher, { revalidateOnFocus: false });

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

  const selectedDayLabel = useMemo(() => {
    const date = new Date(selectedDate);
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
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  }, [selectedDate]);

  const filteredTasks = useMemo(() => {
    if (!dorm?.tasks) return [];
    return dorm.tasks.filter((task) => task.date?.startsWith(selectedDate));
  }, [dorm?.tasks, selectedDate]);

  const filteredEvents = useMemo(() => {
    if (!dorm?.events) return [];
    return dorm.events.filter((event) => event.date.startsWith(selectedDate));
  }, [dorm?.events, selectedDate]);

  // Mark dates with tasks/events
  const markedDates = useMemo(() => {
    const marked: any = {};

    dorm?.tasks?.forEach((task) => {
      if (task.date) {
        const dateKey = task.date.split('T')[0];
        if (!marked[dateKey]) marked[dateKey] = { marked: true, dots: [] };
      }
    });

    dorm?.events?.forEach((event) => {
      const dateKey = event.date.split('T')[0];
      if (!marked[dateKey]) marked[dateKey] = { marked: true };
    });

    // Highlight selected date
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: '#10b981',
    };

    return marked;
  }, [dorm?.tasks, dorm?.events, selectedDate]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-950">
        <View className="h-12 w-12 rounded-full border-4 border-gray-700 border-t-emerald-500" />
        <Text className="mt-4 text-gray-400">Loading...</Text>
      </View>
    );
  }

  if (!auth) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-950">
        <Text className="font-bold text-red-500">Please login to access this page.</Text>
      </View>
    );
  }

  if (error || !dorm) {
    return (
      <ScrollView contentContainerClassName="pt-6 pb-10" showsVerticalScrollIndicator={false}>
        <Text className="mb-6 px-6 text-3xl font-bold text-white">Homepage</Text>
        <View className="mx-6 rounded-3xl border border-gray-700 bg-gray-800 p-6">
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
    <ScrollView contentContainerClassName="px-6 pt-6 pb-10" showsVerticalScrollIndicator={false}>
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

      {/* Calendar Component */}
      <View className="mb-4 overflow-hidden rounded-3xl border border-gray-700 bg-gray-800">
        <Calendar
          current={selectedDate}
          onDayPress={(day: any) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            calendarBackground: '#1f2937',
            textSectionTitleColor: '#9ca3af',
            selectedDayBackgroundColor: '#10b981',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#10b981',
            dayTextColor: '#e5e7eb',
            textDisabledColor: '#4b5563',
            monthTextColor: '#ffffff',
            textMonthFontWeight: 'bold',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            arrowColor: '#10b981',
          }}
          style={{
            paddingBottom: 10,
          }}
        />
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
                        className={`ml-auto rounded-full p-2 ${task.done ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
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
                        className={`ml-auto rounded-full p-2 ${event.done ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
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
