import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'react-native';

const WelcomeScreen = () => {
  return (
    <View className="flex-1 justify-between px-6 py-8">
      {/* Logo at the top */}
      <View className="flex-1 items-center justify-center">
        <Image
          source={require('../assets/hero-picture.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
          accessibilityLabel="KotConnect logo"
        />
      </View>

      {/* Text + Buttons at the bottom */}
      <View>
        <View className="mb-8">
          <Text className="mb-2 text-5xl font-bold text-white">Welcome to KotConnect</Text>
          <Text className="text-base text-gray-400">
            The app that makes dorm life easier. Organize chores, meals, events, and shared expenses
            in one simple app.
          </Text>
        </View>

        <View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log in"
            onPress={() => router.push('/login')}
            className="w-full items-center justify-center rounded-2xl bg-red-600 px-4 py-4 active:opacity-90">
            <Text className="text-base font-semibold text-white">Next</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;
