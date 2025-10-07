import { StatusBar } from 'expo-status-bar';
import { ScreenContent } from '@/components/ScreenContent';

import './globals.css';

export default function App() {
  return (
    <>
      <ScreenContent title="Home" path="App.tsx"></ScreenContent>
      <StatusBar style="auto" />
    </>
  );
}
