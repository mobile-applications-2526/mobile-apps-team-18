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
    <View className="flex-1 bg-white">
      <Text className="my-7 text-xl font-bold text-red-500">{title}</Text>
      <View className="my-7 h-[1px] w-4/5" />
      <EditScreenInfo path={path} />
      {children}
    </View>
  );
};
