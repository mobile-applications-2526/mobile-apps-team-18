import React from 'react';
import { Text } from 'react-native';

interface Props {
  title: string;
}

export default function SectionHeader({ title }: Props) {
  return (
    <Text className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
      {title}
    </Text>
  );
}
