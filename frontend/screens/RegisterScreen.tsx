import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator, Platform,
} from "react-native";
import { userService } from "../services/userService";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import type { SignupInput } from "../types";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";

const RegisterScreen = ({ onBack, onSuccess }: Props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [geboortedatum, setGeboortedatum] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [locatie, setLocatie] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSubmit = !loading;

  const formatDate = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const onChangeBirth = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      // Android returns 'set' or 'dismissed'
      if (event.type === 'set' && selectedDate) {
        setBirthDate(selectedDate);
        setGeboortedatum(formatDate(selectedDate));
      }
      setShowDatePicker(false);
    } else {
      // iOS updates continuously on change
      if (selectedDate) {
        setBirthDate(selectedDate);
        setGeboortedatum(formatDate(selectedDate));
      }
    }
  };

  const handleRegister = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const input: SignupInput = {
        username,
        email,
        geboortedatum,
        locatie,
        password,
      };
      const data = await userService.signup(input);

      // If your signup returns a token, auto-login
      if (data.token) {
        await login({ token: data.token, username: data.username });
        router.replace("/home");
      } else {
        // Otherwise, go to login
        router.replace("/login");
      }
    } catch (e: any) {
      setError(e?.message || "Registration failed");
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
          Register
        </Text>
      </View>

      <View className="items-center">
        <Text className="text-4xl">📝</Text>
        <Text className="mt-2 text-xl font-bold text-white">
          Create your account
        </Text>
        <Text className="mt-1 text-center text-gray-500">
          Join KotConnect to organize your home
        </Text>
      </View>

        <View className="mt-8 gap-4">
          <LabeledInput label="Username" value={username} onChangeText={setUsername} placeholder="username" className="text-white" />
          <LabeledInput label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" autoCapitalize="none" className="text-white" />
          {Platform.OS === 'web' ? (
            <LabeledInput label="Birthdate" value={geboortedatum} onChangeText={setGeboortedatum} placeholder="YYYY-MM-DD" className="text-white" />
          ) : (
            <View>
              <Text className="mb-2 text-sm font-medium text-white">Birthdate</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => setShowDatePicker(true)}
                className="rounded-2xl border border-gray-300 px-4 py-3"
              >
                <Text className="text-base text-white">
                  {geboortedatum ? geboortedatum : 'YYYY-MM-DD'}
                </Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={birthDate ?? new Date(2000, 0, 1)}
                  mode="date"
                  display={'spinner'}
                  onChange={onChangeBirth}
                  maximumDate={new Date()}
                />
              )}
              {Platform.OS === 'ios' && showDatePicker && (
                <View className="mt-2 flex-row justify-end">
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setShowDatePicker(false)}
                    className="rounded-xl bg-emerald-600 px-4 py-2 active:opacity-90"
                  >
                    <Text className="text-white">Done</Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}
          <LabeledInput label="Location" value={locatie} onChangeText={setLocatie} placeholder="Your kot address" className="text-white" />
          <LabeledInput label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry className="text-white" />
        </View>

      {error ? (
        <Text className="mt-2 text-sm text-red-600">{error}</Text>
      ) : null}

      <View className="mt-6">
        <Pressable
          accessibilityRole="button"
          disabled={!canSubmit}
          onPress={handleRegister}
          className={`w-full items-center justify-center rounded-2xl px-4 py-4 active:opacity-90 ${
            canSubmit ? "bg-emerald-600" : "bg-emerald-300"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-semibold text-white">Register</Text>
          )}
        </Pressable>
      </View>
    </View>
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
