import React from 'react';
import { Text, View } from 'react-native';

import { EditScreenInfo } from './EditScreenInfo';

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="my-7 h-[1px] w-4/5 bg-gray-200">{title}</Text>
      <View className="text-xl font-bold" />
      <EditScreenInfo path={path} />
      {children}
    </View>
  );
};
