import React from "react";
import { Pressable, Text } from "react-native";

type QuickActionProps = {
  label: string;
  color: string;
  onPress: () => void;
};

export const QuickAction = ({ label, color, onPress }: QuickActionProps) => (
  <Pressable
    onPress={onPress}
    className={`flex-1 items-center justify-center rounded-xl ${color} px-4 py-3 active:opacity-90`}
  >
    <Text className="text-center font-semibold text-white">{label}</Text>
  </Pressable>
);
