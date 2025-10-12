import React from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { Card } from "../components/Card";
import { Pill } from "../components/Pill";
import { UpcomingItem } from "../components/UpcomingItem";
import { Divider } from "../components/Divider";
import { QuickAction } from "../components/QuickAction";
import { EventHighlights } from "../components/EventHighlights";
import { TaskHighlights } from "../components/TaskHighlights";
import useSWR from 'swr';
import { taskService } from "../services/taskService";
import { eventService } from "../services/eventService";
import { Task, Event } from "../types";

export const HomeScreen = () => {
  const { logout, auth } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };
  
  const fetcher = async () => {;  

        if (!auth?.token) {
            return;
        }
        
        const events = await eventService.getEvents(auth.plaats!);
        const tasks = await taskService.getTasks(auth.plaats!);
        return { events, tasks };
    };

    const {data, isLoading, error} =useSWR(auth?.token! ? 'homeData' : null, fetcher, { revalidateOnFocus: false });

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
        <EventHighlights events={data?.events || []} />
        <TaskHighlights tasks={data?.tasks || []} />
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
        {/* <Card>
          {(loadingTasks || loadingEvents) && (
            <Text className="text-gray-600">Loading your upcoming items…</Text>
          )}
          {(tasksError || eventsError) && (
            <Text className="text-red-600">Failed to load data.</Text>
          )}
          {!loadingTasks && !loadingEvents && !tasksError && !eventsError && (
            <>
              <UpcomingItem title="Clean kitchen" subtitle="Due today • Assigned to You" badge="Task" />
              <Divider />
              <UpcomingItem
                title="Buy groceries"
                subtitle="Due tomorrow • Assigned to Alex"
                badge="Task"
              />
              <Divider />
              <UpcomingItem title="Movie night" subtitle="Fri 20:00 • Living room" badge="Event" />
            </>
          )}
        </Card> */}
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
