import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111827', // gray-900
          borderTopColor: '#1F2937', // gray-800
        },
        tabBarActiveTintColor: '#10B981', // emerald-500
        tabBarInactiveTintColor: '#9CA3AF', // gray-400
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
