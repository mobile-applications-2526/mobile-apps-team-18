'use client';

import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import useSWR from 'swr';
import { useAuth } from '../../context/AuthContext';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

export default function TabsLayout() {
  const { auth } = useAuth();
  const { data: dorm } = useSWR(auth?.token ? 'homeData' : null);

  const hasDorm = Boolean(
    dorm &&
      typeof dorm === 'object' &&
      (dorm.id || dorm.code || (Array.isArray(dorm.users) && dorm.users.length > 0))
  );

  return (
    <ActionSheetProvider>
      <NativeTabs>
        <NativeTabs.Trigger name="home">
          <Label>Home</Label>
          <Icon sf={'house.fill'} drawable="ic_menu_home" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="settings">
          <Label>Settings</Label>
          <Icon sf={'gear'} drawable="ic_account_circle" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="creator" role="search" hidden={!hasDorm}>
          <Label>Add</Label>
          <Icon sf={'plus'} drawable="ic_menu_add" />
        </NativeTabs.Trigger>
      </NativeTabs>
    </ActionSheetProvider>
  );
}
