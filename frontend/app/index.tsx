import React from "react";
import WelcomeScreen from "../screens/WelcomeScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <WelcomeScreen />
    </SafeAreaView>
  );
}
