import { View, Text, Pressable, TextInput, Alert, ScrollView, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useAuth } from '../../context/AuthContext';
import useSWR, { mutate } from 'swr';
import { useState, useMemo } from 'react';
import DormService from '../../services/DormService';
import SectionHeader from '../../components/SectionHeader';
import { Check, ChevronRight, Plus, Unplug, X } from 'lucide-react-native';
import React from 'react';
import * as SecureStore from 'expo-secure-store';
import TaskService from '../../services/TaskService';
import EventService from '../../services/EventService';
import { Dorm, Event, Task } from '../../types';
import { router } from 'expo-router';

export const HomeScreen = () => {
  const { auth, isLoading: authLoading } = useAuth();
  const [code, setCode] = useState<string>('');
  const [showCode, setShowCode] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const fetcher = async () => {
    if (!auth?.token) throw new Error('No auth token');
    const dorm = await DormService.getDorm(auth.token);

    if (!dorm) {
      return null;
    }

    if (dorm?.code) {
      if (Platform.OS === 'web') {
        localStorage.setItem('dormCode', dorm.code);
      } else {
        await SecureStore.setItemAsync('dormCode', dorm.code);
      }
    }

    return dorm;
  };

  const { data: dorm, isLoading: dormLoading } = useSWR(auth?.token ? 'homeData' : null, fetcher);

  const handleJoinDorm = async () => {
    if (!code || !code.trim()) {
      Alert.alert('Missing Code', 'Please enter a dorm code before joining.');
      return;
    }

    const response = await DormService.addUserToDormByCode(auth?.token as string, code);

    if (response) {
      setCode('');
      setIsJoining(false);
      mutate('homeData', response, false);
      mutate('homeData');
    }
  };

  const handleCreateDorm = async () => {
    if (!name || !name.trim()) {
      Alert.alert('Missing Code', 'Please enter a dorm code before joining.');
      return;
    }

    const response = await DormService.createDorm(auth?.token as string, name);

    if (response) {
      setName('');
      setIsCreating(false);
      mutate('homeData', response, false);
      mutate('homeData');
    }
  };

  const handleReset = () => {
    setIsCreating(false);
    setIsJoining(false);
  };

  const handleChangeCompleted = async (taskId: number) => {
    if (!auth?.token) return;

    try {
      const response = await TaskService.completeTask(auth.token, taskId);

      if (response) {
        mutate(
          'homeData',
          (data: any) => {
            if (!data || !data.tasks) return data;
            return {
              ...data,
              tasks: data.tasks.map((task: Task) =>
                task.id === taskId ? { ...task, ...response } : task
              ),
            };
          },
          false
        );
      }
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  const handleEventPress = (eventId?: number | string) => {
    if (!eventId) return;
    router.push(`/event/${eventId}`);
  };

  const selectedDayLabel = useMemo(() => {
    const date = new Date(selectedDate);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
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

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-950">
        <Text className="text-gray-400">Loading...</Text>
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

  if (dormLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-950">
        <Text className="text-gray-400">Loading dorm...</Text>
      </View>
    );
  }

  if (dorm === null) {
    return (
      <ScrollView contentContainerClassName="pt-6 pb-10" showsVerticalScrollIndicator={false}>
        <Text className="mb-6 px-6 text-3xl font-bold text-white">Homepage</Text>
        <View className="flex flex-col gap-4">
          <View className="mx-6 rounded-3xl border border-gray-700 bg-gray-800 p-6">
            <View className="mb-4 h-16 w-16 items-center justify-center self-center rounded-2xl bg-emerald-600">
              <Text className="text-3xl">🏠</Text>
            </View>
            <Text className="mb-2 text-center text-xl font-bold text-white">
              You don't have a dorm yet
            </Text>
            <Text className="mb-6 text-center text-sm text-gray-400">
              Would you like to join or create one?
            </Text>

            {!isJoining && !isCreating && (
              <View className="flex gap-4">
                <Pressable
                  onPress={() => setIsJoining(true)}
                  className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 active:opacity-80"
                  accessibilityRole="button"
                  accessibilityLabel="Join dorm">
                  <Text className="text-center font-semibold text-white">Join Dorm</Text>
                </Pressable>
                <Pressable
                  onPress={() => setIsCreating(true)}
                  className="flex-1 rounded-2xl bg-orange-400 px-4 py-3 active:opacity-80"
                  accessibilityRole="button"
                  accessibilityLabel="Create dorm">
                  <Text className="text-center font-semibold text-white">Create dorm</Text>
                </Pressable>
              </View>
            )}

            {isJoining && (
              <>
                <TextInput
                  placeholder="Enter dorm code"
                  placeholderTextColor="#6B7280"
                  className="mb-4 w-full rounded-2xl border border-gray-700 bg-gray-900 px-4 py-3 text-white"
                  value={code}
                  onChangeText={setCode}
                />

                <View className="flex w-full flex-row items-center gap-2">
                  <Pressable
                    onPress={handleReset}
                    className="rounded-2xl bg-red-600 px-4 py-3 active:opacity-80"
                    accessibilityRole="button"
                    accessibilityLabel="Go back">
                    <Text className="text-center font-semibold text-white">Back</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleJoinDorm}
                    className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 active:opacity-80"
                    accessibilityRole="button"
                    accessibilityLabel="Join dorm">
                    <Text className="text-center font-semibold text-white">Join Dorm</Text>
                  </Pressable>
                </View>
              </>
            )}

            {isCreating && (
              <>
                <TextInput
                  placeholder="Enter the name of your dorm"
                  placeholderTextColor="#6B7280"
                  className="mb-4 w-full rounded-2xl border border-gray-700 bg-gray-900 px-4 py-3 text-white"
                  value={name}
                  onChangeText={setName}
                />
                <View className="flex w-full flex-row items-center gap-2">
                  <Pressable
                    onPress={handleReset}
                    className="rounded-2xl bg-red-600 px-4 py-3 active:opacity-80"
                    accessibilityRole="button"
                    accessibilityLabel="Go back">
                    <Text className="text-center font-semibold text-white">Back</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleCreateDorm}
                    className="flex-1 rounded-2xl bg-orange-400 px-4 py-3 active:opacity-80"
                    accessibilityRole="button"
                    accessibilityLabel="Create dorm">
                    <Text className="text-center font-semibold text-white">Create dorm</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerClassName="px-6 pt-6 pb-10" showsVerticalScrollIndicator={false}>
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-white">{dorm?.name}</Text>
        <Pressable
          onPress={() => setShowCode(!showCode)}
          className="rounded-2xl bg-emerald-600 px-3 py-2 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Text className="text-md font-bold text-white">
            {!showCode ? 'View code' : dorm?.code}
          </Text>
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
              No tasks or events for this day
            </Text>
          </View>
        ) : (
          <View className="gap-3 pb-5">
            {filteredTasks.map((task) => (
              <View key={task.id} className="rounded-2xl border border-gray-700 bg-gray-900 p-4">
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-base font-semibold text-white">{task.title}</Text>
                    <View className="flex-row items-center gap-2">
                      <View className="rounded-full bg-emerald-600/20 px-3 py-1">
                        <Text className="text-xs font-medium text-emerald-400">Taak</Text>
                      </View>
                      <Text className="text-sm text-gray-400">{task.assignedUser?.username}</Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => handleChangeCompleted(task.id!)}
                    className={`rounded-lg p-2 ${
                      task.done ? 'bg-emerald-600' : 'bg-gray-700'
                    } active:opacity-80`}>
                    <Check size={20} color="white" />
                  </Pressable>
                </View>
              </View>
            ))}

            {filteredEvents.map((event) => {
              const isJoined = event.participants?.some((u) => u.username === auth.username);

              return (
                <Pressable
                  key={event.id}
                  data-cy={`event-card-${event.id}`}
                  onPress={() => handleEventPress(event.id)}
                  className="rounded-2xl border border-gray-700 bg-gray-900 p-4 active:bg-gray-800">
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <View className="mb-2 flex-row items-center justify-between">
                        <Text className="flex-1 text-base font-semibold text-white">
                          {event.name}
                        </Text>
                        <ChevronRight size={20} color="#9ca3af" />
                      </View>
                      <View className="flex-row items-center gap-2">
                        <View className="rounded-full bg-purple-600/20 px-3 py-1">
                          <Text className="text-xs font-medium text-purple-400">Event</Text>
                        </View>
                        <Text className="text-sm text-gray-400">{event.organizer?.username}</Text>
                      </View>
                      {event.location && (
                        <Text className="mt-2 text-xs text-gray-500">📍 {event.location}</Text>
                      )}
                      {isJoined && (
                        <View className="mt-2 flex-row items-center gap-1">
                          <View className="h-2 w-2 rounded-full bg-emerald-500" />
                          <Text className="text-xs text-emerald-500">You're participating</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
