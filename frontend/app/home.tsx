import React from 'react';
import { Redirect } from 'expo-router';

export default function HomeRedirect() {
  // Redirect legacy /home route into the tabbed home so the bottom tabs show up
  return <Redirect href="/(tabs)/home" />;
}
