import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RegisterScreen from "../screens/RegisterScreen";

export default function login() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <RegisterScreen />
    </SafeAreaView>
  );
}
