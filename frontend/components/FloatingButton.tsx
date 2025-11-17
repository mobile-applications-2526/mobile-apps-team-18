import { LucideIcon, Plus } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
  icon: LucideIcon;
  color: string;
  backgroundColor: string;
  onPress: () => void;
  title: string;
  disabled?: boolean;
  loading?: boolean;
}

export default function FloatingButton({
  icon,
  onPress,
  title,
  color,
  backgroundColor,
  disabled,
  loading,
}: Props) {
  return (
    <View className="absolute bottom-28 left-6 right-6">
      <Pressable
        disabled={disabled}
        onPress={onPress}
        accessibilityRole="button"
        className="flex-row items-center justify-center gap-2 rounded-2xl px-6 py-4 shadow-lg active:opacity-90"
        style={{ backgroundColor }}>
        {React.createElement(icon, { color: '#fff', size: 20 })}

        <Text className="text-base font-semibold" style={{ color }}>
          {loading ? 'loading...' : title}
        </Text>
      </Pressable>
    </View>
  );
}
