import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import { Card } from '../components/Card';
import { Pill } from '../components/Pill';
import { UpcomingItem } from '../components/UpcomingItem';
import { Divider } from '../components/Divider';
import { QuickAction } from '../components/QuickAction';

export const HomeScreen = () => {
  const { logout, auth } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (!auth) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="font-bold text-red-500">Please login to access this page.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerClassName="pb-8">
      {/* Header */}
      <View className="px-6 pt-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-3xl font-extrabold text-gray-900">KotConnect</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log out"
            onPress={handleLogout}
            className="rounded-full bg-red-50 px-3 py-1 active:opacity-80">
            <Text className="text-sm font-semibold text-red-600">Log out</Text>
          </Pressable>
        </View>
        <Text className="mt-1 text-base text-gray-600">
          Organize chores and events with your roommates.
        </Text>
      </View>

      {/* Highlights */}
      <View className="mt-6 px-6">
        <View className="flex-row gap-4">
          <View className="flex-1 rounded-2xl bg-emerald-50 p-4">
            <Text className="text-emerald-600">Tasks</Text>
            <Text className="mt-1 text-2xl font-bold text-emerald-800">3 due</Text>
            <Text className="mt-1 text-emerald-700">Next: Take out trash</Text>
          </View>
          <View className="flex-1 rounded-2xl bg-indigo-50 p-4">
            <Text className="text-indigo-600">Events</Text>
            <Text className="mt-1 text-2xl font-bold text-indigo-800">1 upcoming</Text>
            <Text className="mt-1 text-indigo-700">House dinner, Fri 19:00</Text>
          </View>
        </View>
      </View>

      {/* Quick actions */}
      <View className="mt-6 px-6">
        <Text className="mb-3 text-base font-semibold text-gray-900">Quick actions</Text>
        <View className="flex-row gap-3">
          <QuickAction
            label="New task"
            color="bg-emerald-600"
            onPress={() => {
              /* TODO: tasks */
            }}
          />
          <QuickAction
            label="New event"
            color="bg-indigo-600"
            onPress={() => {
              /* TODO: events */
            }}
          />
          <QuickAction
            label="Invite"
            color="bg-amber-600"
            onPress={() => {
              /* TODO: invites */
            }}
          />
        </View>
      </View>

      {/* Upcoming section */}
      <View className="mt-6 px-6">
        <Text className="mb-3 text-base font-semibold text-gray-900">Upcoming</Text>
        <Card>
          <UpcomingItem title="Clean kitchen" subtitle="Due today • Assigned to You" badge="Task" />
          <Divider />
          <UpcomingItem
            title="Buy groceries"
            subtitle="Due tomorrow • Assigned to Alex"
            badge="Task"
          />
          <Divider />
          <UpcomingItem title="Movie night" subtitle="Fri 20:00 • Living room" badge="Event" />
        </Card>
      </View>

      {/* Household */}
      <View className="mt-6 px-6">
        <Text className="mb-3 text-base font-semibold text-gray-900">Your household</Text>
        <Card>
          <Text className="text-lg font-semibold text-gray-900">Kot Leuven - Tiensestraat</Text>
          <Text className="mt-1 text-gray-600">4 roommates • 2 open tasks</Text>
          <View className="mt-4 flex-row gap-3">
            <Pill text="You" />
            <Pill text="Alex" />
            <Pill text="Maya" />
            <Pill text="Robin" />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
