import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  children: React.ReactNode;
}

export default function BulletPoint({ children }: Props) {
  return (
    <View className="mb-2 flex-row">
      <Text className="mr-2 text-gray-400">•</Text>
      <Text className="flex-1 text-base leading-relaxed text-gray-300">{children}</Text>
    </View>
  );
}
