import { ScrollView, View, Text, Pressable } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import useSWR from 'swr';
import { taskService } from '../services/taskService';
import { eventService } from '../services/eventService';
import React from 'react';

export const HomeScreen = () => {
  const { logout, auth } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const fetcher = async () => {
    if (!auth?.token) {
      return { events: [], tasks: [] };
    }

    const [events, tasks] = await Promise.all([eventService.getEvents(auth.token), taskService.getTasks(auth.token)]);
    return { events, tasks };
  };

  const { data, isLoading, error } = useSWR(auth?.token! ? 'homeData' : null, fetcher, {
    revalidateOnFocus: false,
  });

  if (!auth) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="font-bold text-red-500">Please login to access this page.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="px-6 pt-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-3xl font-extrabold text-white">KotConnect</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log out"
            onPress={handleLogout}
            className="rounded-full border border-red-900/50 bg-gray-800 px-3 py-1 active:opacity-80">
            <Text className="text-sm font-semibold text-red-500">Log out</Text>
          </Pressable>
        </View>
      </View>

      {/* Highlights */}
      <View className="mt-6 px-6">
        <View className="flex-row gap-4">
          {/* Event Highlights */}
          <View className="flex-1 rounded-3xl border border-gray-700 bg-gray-800 p-4">
            <Text className="text-sm font-medium text-gray-400">Events</Text>
            <Text className="mt-1 text-2xl font-bold text-white">
              {isLoading ? '...' : data?.events?.length || 0}
            </Text>
            <Text className="mt-1 text-xs text-gray-500">upcoming</Text>
          </View>

          {/* Task Highlights */}
          <View className="flex-1 rounded-3xl border border-gray-700 bg-gray-800 p-4">
            <Text className="text-sm font-medium text-gray-400">Tasks</Text>
            <Text className="mt-1 text-2xl font-bold text-white">
              {isLoading ? '...' : data?.tasks?.length || 0}
            </Text>
            <Text className="mt-1 text-xs text-gray-500">pending</Text>
          </View>
        </View>
      </View>

      {/* Quick actions */}
      <View className="mt-6 px-6">
        <Text className="mb-3 text-base font-semibold text-white">Quick actions</Text>
        <View className="flex-row gap-3">
          {/* New Task */}
          <Pressable
            onPress={() => {
              /* TODO: tasks */
            }}
            className="flex-1 items-center rounded-3xl border border-gray-700 bg-emerald-600 py-4 active:opacity-80">
            <Text className="text-sm font-semibold text-white">New task</Text>
          </Pressable>

          {/* New Event */}
          <Pressable
            onPress={() => {
              /* TODO: events */
            }}
            className="flex-1 items-center rounded-3xl border border-gray-700 bg-indigo-600 py-4 active:opacity-80">
            <Text className="text-sm font-semibold text-white">New event</Text>
          </Pressable>

          {/* Invite */}
          <Pressable
            onPress={() => {
              /* TODO: invites */
            }}
            className="flex-1 items-center rounded-3xl border border-gray-700 bg-amber-600 py-4 active:opacity-80">
            <Text className="text-sm font-semibold text-white">Invite</Text>
          </Pressable>
        </View>
      </View>

      {/* Upcoming section */}
      <View className="mt-6 px-6">
        <Text className="mb-3 text-base font-semibold text-white">Upcoming</Text>
        {/* Placeholder for upcoming items */}
      </View>

      {/* Household */}
      <View className="mt-6 px-6">
        <Text className="mb-3 text-base font-semibold text-white">Your household</Text>
        {/* Card */}
        <View className="rounded-3xl border border-gray-700 bg-gray-800 p-4">
          <Text className="text-lg font-semibold text-white">Kot Leuven - Tiensestraat</Text>
          <Text className="mt-1 text-gray-400">4 roommates • 2 open tasks</Text>
          <View className="mt-4 flex-row gap-3">
            {/* Pills */}
            <View className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1">
              <Text className="text-sm text-gray-300">You</Text>
            </View>
            <View className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1">
              <Text className="text-sm text-gray-300">Alex</Text>
            </View>
            <View className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1">
              <Text className="text-sm text-gray-300">Maya</Text>
            </View>
            <View className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1">
              <Text className="text-sm text-gray-300">Robin</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
