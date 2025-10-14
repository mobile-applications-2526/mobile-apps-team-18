import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  children: React.ReactNode;
  title: string;
}

export default function Section({ children, title }: Props) {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-xl font-bold text-white">{title}</Text>
      {children}
    </View>
  );
}
