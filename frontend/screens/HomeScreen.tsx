import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';

type Props = {
  onLogout?: () => void;
};

export const HomeScreen = ({ onLogout }: Props) => {
  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="pb-8">
      {/* Header */}
      <View className="px-6 pt-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-3xl font-extrabold text-gray-900">KotConnect</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log out"
            onPress={onLogout}
            className="rounded-full bg-red-50 px-3 py-1 active:opacity-80"
          >
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
          <QuickAction label="New task" color="bg-emerald-600" onPress={() => { /* TODO: navigate */ }} />
          <QuickAction label="New event" color="bg-indigo-600" onPress={() => { /* TODO: navigate */ }} />
          <QuickAction label="Invite" color="bg-amber-600" onPress={() => { /* TODO: share */ }} />
        </View>
      </View>

      {/* Upcoming section */}
      <View className="mt-6 px-6">
        <Text className="mb-3 text-base font-semibold text-gray-900">Upcoming</Text>
        <Card>
          <UpcomingItem title="Clean kitchen" subtitle="Due today • Assigned to You" badge="Task" />
          <Divider />
          <UpcomingItem title="Buy groceries" subtitle="Due tomorrow • Assigned to Alex" badge="Task" />
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

const QuickAction = ({ label, color, onPress }: { label: string; color: string; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    className={`flex-1 items-center justify-center rounded-xl ${color} px-4 py-3 active:opacity-90`}
  >
    <Text className="text-center font-semibold text-white">{label}</Text>
  </Pressable>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    {children}
  </View>
);

const Divider = () => <View className="my-3 h-px w-full bg-gray-200" />;

const UpcomingItem = ({ title, subtitle, badge }: { title: string; subtitle: string; badge: string }) => (
  <View className="flex-row items-start gap-3">
    <View className="h-9 w-9 items-center justify-center rounded-full bg-gray-100">
      <Text className="text-base">🗓️</Text>
    </View>
    <View className="flex-1">
      <Text className="text-base font-semibold text-gray-900">{title}</Text>
      <Text className="mt-0.5 text-sm text-gray-600">{subtitle}</Text>
    </View>
    <View className="self-start rounded-full bg-gray-100 px-2.5 py-1">
      <Text className="text-xs font-medium text-gray-700">{badge}</Text>
    </View>
  </View>
);

const Pill = ({ text }: { text: string }) => (
  <View className="rounded-full bg-gray-100 px-3 py-1">
    <Text className="text-sm font-medium text-gray-700">{text}</Text>
  </View>
);

export default HomeScreen;
