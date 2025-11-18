import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import useSWR from 'swr';
import {
  Bell,
  Palette,
  FileText,
  LogOut,
  ChevronRight,
  UserIcon,
  Unplug,
} from 'lucide-react-native';
import { router } from 'expo-router';
import SectionHeader from '../../components/SectionHeader';
import SettingsItem from '../../components/SettingsItem';
import { User } from '../../types';
import { UserService } from '../../services/UserService';
import DormService from '../../services/DormService';
import { mutate } from 'swr';

const SettingsScreen = () => {
  const { auth, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInDorm, setIsInDorm] = useState<boolean>(false);

  // Subscribe to the 'homeData' SWR cache so this screen updates when the user joins/creates/leaves a dorm
  const { data: dorm } = useSWR(auth?.token ? 'homeData' : null);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleLeaveDorm = async () => {
    if (!auth?.token) {
      alert('No authentication token found');
      return;
    }

    try {
      await DormService.leaveDorm(auth.token);

      await mutate('homeData');

      setIsInDorm(false);

      Alert.alert('Left dorm', 'You have successfully left the dorm.');

      router.replace('/(tabs)/home');
    } catch (err) {
      console.error('[v0] Error leaving dorm:', err);
      alert('Error removing dorm: ' + (err as unknown as Error).message);
    }
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!auth?.token) {
        setLoading(false);
        return;
      }
      try {
        const data = await UserService.getProfile(auth.token);
        if (mounted) setProfile(data);
      } catch (e: any) {
        console.error('Failed to load profile:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [auth?.token]);

  useEffect(() => {
    if (dorm !== undefined) {
      setIsInDorm(Boolean(dorm));
    }
  }, [dorm]);

  return (
    <ScrollView contentContainerClassName="px-6 pt-6" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Text className="mb-6 text-3xl font-bold text-white">Settings</Text>

      {loading ? (
        <View className="mt-20 items-center">
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : (
        <>
          {/* Profile Summary Card */}
          {profile && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View profile"
              onPress={() => router.push('/profile')}
              className="active:bg-gray-750 mb-4 overflow-hidden rounded-3xl border border-gray-700 bg-gray-800">
              <View className="p-5">
                <View className="flex-row items-center">
                  <View className="mr-4 h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600">
                    <UserIcon color="#fff" size={28} />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1 text-xl font-bold text-white">
                      {profile.username || 'User'}
                    </Text>
                    <Text className="text-sm text-gray-400">{profile.email || 'No email set'}</Text>
                  </View>
                  <ChevronRight color="#6B7280" size={24} />
                </View>
              </View>
            </Pressable>
          )}

          {/* Preferences Section */}
          <View className="rounded-3xl border border-gray-700 bg-gray-800 px-5">
            <SectionHeader title="Preferences" />

            <SettingsItem
              icon={Bell}
              label="Notifications"
              description="Push notifications and alerts"
              onPress={() =>
                Alert.alert('Coming soon', 'Notification settings will be available soon')
              }
            />

            <View className="h-px bg-gray-700" />

            <SettingsItem
              icon={Palette}
              label="Appearance"
              description="Theme and display options"
              onPress={() =>
                Alert.alert('Coming soon', 'Appearance settings will be available soon')
              }
            />
          </View>

          {/* Support Section */}
          <View className="mt-4 rounded-3xl border border-gray-700 bg-gray-800 px-5">
            <SectionHeader title="Support" />
            <SettingsItem
              icon={FileText}
              label="Terms & Privacy"
              description="Legal information"
              onPress={() => router.push('/terms')}
            />
          </View>

          {/* Logout Button */}
          <View className="mt-6 rounded-3xl border border-red-900/50 bg-gray-800 px-5">
            <SectionHeader title="Dangerous area" />
            {isInDorm && (
              <SettingsItem
                icon={Unplug}
                label="Leave dorm"
                description="Leave your dorm"
                onPress={handleLeaveDorm}
                showChevron={false}
                destructive
              />
            )}
            <View className="h-px bg-gray-700" />
            <SettingsItem
              icon={LogOut}
              label="Log Out"
              description="Sign out of your account"
              onPress={handleLogout}
              showChevron={false}
              destructive
            />
          </View>

          {/* App Version */}
          <Text className="mt-8 text-center text-sm text-gray-500">Version 1.0.0</Text>
        </>
      )}
    </ScrollView>
  );
};

export default SettingsScreen;
