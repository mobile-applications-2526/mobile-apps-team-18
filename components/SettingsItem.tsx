import { ChevronRight, LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, View, Text } from 'react-native';

interface Props {
  icon: LucideIcon;
  label: string;
  description: string;
  onPress: () => void;
  showChevron?: boolean;
  destructive?: boolean;
}

export default function SettingsItem({
  icon: Icon,
  label,
  description,
  onPress,
  showChevron = true,
  destructive = false,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="flex-row items-center justify-between py-4 active:opacity-70">
      <View className="flex-1 flex-row items-center">
        <View
          className={`mr-4 h-10 w-10 items-center justify-center rounded-xl ${
            destructive ? 'bg-red-950/40' : 'bg-gray-700'
          }`}>
          <Icon color={destructive ? '#EF4444' : '#9CA3AF'} size={20} />
        </View>
        <View className="flex-1">
          <Text className={`text-base font-medium ${destructive ? 'text-red-400' : 'text-white'}`}>
            {label}
          </Text>
          {description && <Text className="mt-0.5 text-sm text-gray-400">{description}</Text>}
        </View>
      </View>
      {showChevron && <ChevronRight color="#6B7280" size={20} />}
    </Pressable>
  );
}
