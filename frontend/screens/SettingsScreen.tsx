import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, CircleUser, LockKeyhole, LogOut } from 'lucide-react-native';
import { Link, router } from 'expo-router';

const SettingsScreen = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900 px-6 py-8">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex min-h-[400px] flex-col justify-between rounded-xl bg-gray-800 p-8">
          {/* Top content */}
          <View>
            <Text className="mb-4 text-center text-3xl font-bold text-white">Settings</Text>

            <Link href="/profile" asChild className="border-b border-gray-200 py-4">
              <TouchableOpacity className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <CircleUser color={'#fff'} />
                  <Text className="text-white">Account</Text>
                </View>
                <ChevronRight color={'#fff'} />
              </TouchableOpacity>
            </Link>

            <Link href="/profile" asChild className="py-4">
              <TouchableOpacity className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <LockKeyhole color={'#fff'} />
                  <Text className="text-white">Settings</Text>
                </View>
                <ChevronRight color={'#fff'} />
              </TouchableOpacity>
            </Link>
          </View>

          {/* Logout button at the bottom of the box */}
          <View className="mt-8 items-center justify-end">
            <TouchableOpacity className="flex-row items-center gap-4" onPress={handleLogout}>
              <LogOut color={'#ff0000'} />
              <Text className="text-red-500">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
