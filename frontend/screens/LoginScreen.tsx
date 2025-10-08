import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { userService } from "../services/userService";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    username.trim().length > 0 && password.length >= 1 && !loading;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
  const data = await userService.login(username, password);
  await login({ token: data.token, username: data.username, plaats: data.plaats });
      router.replace("/home");
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 px-6 py-6">
      <View className="mb-8 flex-row items-center justify-center relative">
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/")}
          className="absolute left-0 rounded-xl  px-4 active:opacity-80 bg-gray-800 hover:bg-red-600"
        >
          <Text className="text-4xl font-bold text-white">←</Text>
        </Pressable>
        <Text className="text-lg font-semibold text-white text-center">
          Log in
        </Text>
      </View>

      <View className="items-center">
        <Text className="text-4xl">🔐</Text>
        <Text className="mt-2 text-xl font-bold text-white text-center">
          Welcome back
        </Text>
        <Text className="mt-1 text-center text-white">
          Sign in to continue to KotConnect
        </Text>
      </View>

      <View className="mt-8 gap-4">
        <View>
          <Text className="mb-2 text-sm font-medium text-white">Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Enter your username"
            placeholderTextColor="#9CA3AF"
            className="rounded-2xl border border-gray-300 px-4 py-3 text-base text-white"
          />
        </View>
        <View>
          <Text className="mb-2 text-sm font-medium text-white">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            className="rounded-2xl border border-gray-300 px-4 py-3 text-base text-white"
          />
        </View>
      </View>

      {error ? (
        <Text className="mt-4 text-center text-sm text-red-600">{error}</Text>
      ) : null}

      <View className="mt-6">
        <Pressable
          accessibilityRole="button"
          disabled={!canSubmit}
          onPress={handleLogin}
          className={`w-full items-center justify-center rounded-2xl px-4 py-4 active:opacity-90 ${
            canSubmit ? "bg-emerald-600" : "bg-emerald-300"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-semibold text-black">Log in</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default LoginScreen;
