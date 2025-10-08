import React from "react";
import { View, Text } from "react-native";

type UpcomingItemProps = {
  title: string;
  subtitle: string;
  badge: string;
};

export const UpcomingItem = ({ title, subtitle, badge }: UpcomingItemProps) => (
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
