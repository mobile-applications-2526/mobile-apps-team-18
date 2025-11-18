import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { UserService } from '../../services/UserService';

const LoginScreen = () => {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [inputFocused, setInputFocused] = useState(false);

  const canSubmit = username.trim().length > 0 && password.length >= 1 && !loading;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const data = await UserService.login(username, password);
      await login({ token: data.token, username: data.username });
      router.replace('/(tabs)/home');
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-between px-6 py-8">
          {/* Hero image at the top */}
          {!inputFocused && (
            <View className="flex-1 items-center justify-center">
              <Image
                source={require('../../assets/hero-picture.png')}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
                accessibilityLabel="KotConnect logo"
              />
            </View>
          )}

          {/* Inputs + Buttons at the bottom */}
          <View>
            {/* Header */}
            <View className="relative mb-6 flex-row items-center gap-4">
              <Pressable
                accessibilityRole="button"
                onPress={() => router.back()}
                className="rounded-xl border border-gray-600 px-2 py-1">
                <ArrowLeft color="#9CA3AF" size={24} />
              </Pressable>
              <Text className="text-4xl font-semibold text-white">Sign in</Text>
            </View>

            {/* Form */}
            <View className="mb-6">
              <Text className="mb-2 text-xl text-gray-400">Sign in with your credentials</Text>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-white">Username</Text>
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Enter your username"
                  placeholderTextColor="#9CA3AF"
                  className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-base text-white"
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium text-white">Password</Text>
                <View className="relative">
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholder="Password"
                    placeholderTextColor="#9CA3AF"
                    className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 pr-12 text-base text-white"
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                  />
                  <Pressable
                    onPress={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff color="#9CA3AF" /> : <Eye color="#9CA3AF" />}
                  </Pressable>
                </View>
              </View>

              {error ? (
                <Text className="mt-4 text-center text-sm text-red-600">{error}</Text>
              ) : null}
            </View>

            {/* Login button */}
            <Pressable
              accessibilityRole="button"
              disabled={!canSubmit}
              onPress={handleLogin}
              className={`w-full items-center justify-center rounded-2xl px-4 py-4 active:opacity-90 ${
                canSubmit ? 'bg-emerald-600' : 'bg-emerald-300'
              }`}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-base font-semibold text-black">Sign in</Text>
              )}
            </Pressable>

            {/* Signup link */}
            <View className="mt-4 flex-row justify-center">
              <Text className="text-white">
                First time here?{' '}
                <Link href="/register" className="text-emerald-400 underline">
                  Sign up for free
                </Link>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
