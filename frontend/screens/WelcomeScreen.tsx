import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  onLogin?: () => void;
  onRegister?: () => void;
};


const WelcomeScreen = ({ onLogin, onRegister }: Props) => {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1 justify-between px-6 py-8">
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl">🏠</Text>
          <Text className="mt-4 text-center text-3xl font-extrabold  text-white">KotConnect</Text>
          <Text className="mt-2 text-center text-base text-gray-400">
            Plan chores and events with your roommates, check who is eating with you tonight!.
          </Text>
        </View>

        <View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log in"
            onPress={onLogin ?? (() => {/* TODO: navigate to login */})}
            className="w-full items-center justify-center rounded-2xl bg-red-600 px-4 py-4 active:opacity-90"
          >
            <Text className="text-base font-semibold text-white">Log in</Text>
          </Pressable>
        </View>
        <View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Register"
            onPress={onRegister ?? (() => {/* TODO: navigate to register */})}
            className="w-full items-center justify-center rounded-2xl bg-orange-600 px-4 py-4 active:opacity-90 mt-4"
          >
            <Text className="text-base font-semibold text-white">Register</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
