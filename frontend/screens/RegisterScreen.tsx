import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { userService } from '../services/userService';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react-native';
import CustomInput from '../components/CustomInput';

const RegisterScreen = () => {
  const { login } = useAuth();

  const [step, setStep] = useState(1);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [geboortedatum, setGeboortedatum] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [locatie, setLocatie] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmitStep1 = username.trim().length > 0 && email.trim().length > 0;
  const canSubmitStep2 = geboortedatum.length > 0 && locatie.trim().length > 0;
  const canSubmitStep3 = password.length > 0;

  const formatDate = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const onChangeBirth = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set' && selectedDate) {
        setBirthDate(selectedDate);
        setGeboortedatum(formatDate(selectedDate));
      }
      setShowDatePicker(false);
    } else {
      if (selectedDate) {
        setBirthDate(selectedDate);
        setGeboortedatum(formatDate(selectedDate));
      }
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const input = { username, email, geboortedatum, locatie, password };
      const data = await userService.signup(input);
      if (data.token) {
        await login({ token: data.token, username: data.username });
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    } catch (e: any) {
      setError(e?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-between bg-gray-900 px-6 py-8">
          {/* Hero image */}
          <View className="flex-1 items-center justify-center">
            <Image
              source={require('../assets/hero-picture.png')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
              accessibilityLabel="KotConnect logo"
            />
          </View>

          {/* Form Steps */}
          <View>
            {/* Header */}
            <View className="relative mb-6 flex-row items-center gap-4">
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/')}
                className="rounded-xl border border-gray-600 px-2 py-1">
                <ArrowLeft color="#9CA3AF" size={24} />
              </Pressable>
              <Text className="text-4xl font-semibold text-white">Register</Text>
            </View>

            {/* Step 1: Username & Email */}
            {step === 1 && (
              <View>
                <CustomInput
                  label="Username"
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter username"
                  className="mb-4"
                />
                <CustomInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  className="mb-6"
                />
                <Pressable
                  disabled={!canSubmitStep1}
                  onPress={() => setStep(2)}
                  className={`mt-4 w-full items-center justify-center rounded-2xl py-4 active:opacity-90 ${
                    canSubmitStep1 ? 'bg-emerald-600' : 'bg-emerald-300'
                  }`}>
                  <Text className="text-base font-semibold text-black">Next</Text>
                </Pressable>
              </View>
            )}

            {/* Step 2: Birthdate & Location */}
            {step === 2 && (
              <View>
                <Text className="mb-2 text-sm font-medium text-white">Birthdate</Text>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  className="mb-4 rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3">
                  <Text className="text-white">{geboortedatum || 'YYYY-MM-DD'}</Text>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    value={birthDate ?? new Date(2000, 0, 1)}
                    mode="date"
                    display="spinner"
                    onChange={onChangeBirth}
                    maximumDate={new Date()}
                  />
                )}
                <CustomInput
                  label="Location"
                  value={locatie}
                  onChangeText={setLocatie}
                  placeholder="Your kot address"
                  className="mb-6"
                />
                <View className="mt-4 flex-row justify-between">
                  <Pressable
                    onPress={() => setStep(1)}
                    className="rounded-2xl bg-gray-700 px-4 py-4 active:opacity-90">
                    <Text className="text-base font-semibold text-white">Back</Text>
                  </Pressable>
                  <Pressable
                    disabled={!canSubmitStep2}
                    onPress={() => setStep(3)}
                    className={`rounded-2xl px-4 py-4 active:opacity-90 ${
                      canSubmitStep2 ? 'bg-emerald-600' : 'bg-emerald-300'
                    }`}>
                    <Text className="text-base font-semibold text-black">Next</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Step 3: Password */}
            {step === 3 && (
              <View>
                <CustomInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  secureTextEntry
                  className="mb-6"
                />
                {error && <Text className="mb-4 text-center text-sm text-red-600">{error}</Text>}
                <View className="mt-4 flex-row justify-between">
                  <Pressable
                    onPress={() => setStep(2)}
                    className="rounded-2xl bg-gray-700 px-4 py-4 active:opacity-90">
                    <Text className="text-base font-semibold text-white">Back</Text>
                  </Pressable>
                  <Pressable
                    disabled={!canSubmitStep3}
                    onPress={handleRegister}
                    className={`rounded-2xl px-4 py-4 active:opacity-90 ${
                      canSubmitStep3 ? 'bg-emerald-600' : 'bg-emerald-300'
                    }`}>
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="text-base font-semibold text-black">Register</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
