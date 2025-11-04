import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="home">
        <Label>Home</Label>
        <Icon sf={'house.fill'} drawable="ic_menu_home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon sf={'gear'} drawable="ic_account_circle" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="creator" role="search">
        <Label>Add</Label>
        <Icon sf={'plus'} drawable="ic_menu_add" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
