import React from "react";
import { View, Text } from "react-native";

export const Pill = ({ text }: { text: string }) => (
  <View className="rounded-full bg-gray-100 px-3 py-1">
    <Text className="text-sm font-medium text-gray-700">{text}</Text>
  </View>
);
