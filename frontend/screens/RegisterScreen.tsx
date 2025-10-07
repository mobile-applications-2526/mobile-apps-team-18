import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { userService } from '../services/userService';
import type { SignupInput } from '../types';

type Props = {
  onBack?: () => void;
  onSuccess?: () => void; // after successful registration
};

const RegisterScreen = ({ onBack, onSuccess }: Props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [geboortedatum, setGeboortedatum] = useState('');
  const [locatie, setLocatie] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSubmit = !loading;

  const handleRegister = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const input: SignupInput = { username, email, geboortedatum, locatie, password };
      await userService.signup(input);
      onSuccess?.();
    } catch (e: any) {
      setError(e?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1 px-6 py-6">
        <View className="mb-8 flex-row items-center justify-between">
          <Pressable
                      accessibilityRole="button"
                      onPress={onBack}
                      className="rounded-xl px-3 pb-3 active:opacity-80 bg-gray-800 hover:bg-red-600"
                    >
                      <Text className="text-4xl font-bold text-white">←</Text>
                    </Pressable>
          <Text className="text-lg font-semibold text-white">Register</Text>
          <View className="w-12" />
        </View>

        <View className="items-center">
          <Text className="text-4xl">📝</Text>
          <Text className="mt-2 text-xl font-bold text-white">Create your account</Text>
          <Text className="mt-1 text-center text-gray-500">Join KotConnect to organize your home</Text>
        </View>

        <View className="mt-8 gap-4">
          <LabeledInput label="Username" value={username} onChangeText={setUsername} placeholder="username" className="text-white" />
          <LabeledInput label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" autoCapitalize="none" className="text-white" />
          <LabeledInput label="Birthdate" value={geboortedatum} onChangeText={setGeboortedatum} placeholder="YYYY-MM-DD" className="text-white" />
          <LabeledInput label="Location" value={locatie} onChangeText={setLocatie} placeholder="Your kot address" className="text-white" />
          <LabeledInput label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry className="text-white" />
        </View>

        {error ? <Text className="mt-2 text-sm text-red-600">{error}</Text> : null}

        <View className="mt-6">
          <Pressable
            accessibilityRole="button"
            disabled={!canSubmit}
            onPress={handleRegister}
            className={`w-full items-center justify-center rounded-2xl px-4 py-4 active:opacity-90 ${
              canSubmit ? 'bg-emerald-600' : 'bg-emerald-300'
            }`}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-base font-semibold text-white">Register</Text>}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const LabeledInput = ({ label, ...props }: any) => (
  <View>
    <Text className="mb-2 text-sm font-medium text-white">{label}</Text>
    <TextInput
      {...props}
      placeholderTextColor="#9CA3AF"
      className="rounded-2xl border border-gray-300 px-4 py-3 text-base text-white"
    />
  </View>
);

export default RegisterScreen;
