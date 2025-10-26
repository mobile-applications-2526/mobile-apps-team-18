import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, UserIcon, Mail, MapPin, Sparkles } from 'lucide-react-native';
import { UserService } from '../../services/UserService';
import InputField from '../../components/InputField';
import React from 'react';

import { Calendar } from 'lucide-react-native';
import DateInputField from '../../components/DateInputField';

const ProfileScreen = () => {
  const { auth, logout, updateAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState(auth?.username || '');
  const [email, setEmail] = useState(auth?.email || '');
  const [location, setLocation] = useState(auth?.locatie || '');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const [usernameSuccess, setUsernameSuccess] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [locationError, setLocationError] = useState(false);

  const [birthday, setBirthday] = useState<Date | null>(
    auth?.geboortedatum ? new Date(auth.geboortedatum) : null
  );
  const [birthdayLoading, setBirthdayLoading] = useState(false);
  const [birthdaySuccess, setBirthdaySuccess] = useState(false);
  const [birthdayError, setBirthdayError] = useState(false);

  const calculateCompletion = () => {
    if (!auth) return 0;
    const fields = [auth.username, auth.email, auth.geboortedatum, auth.locatie];
    const filled = fields.filter((f) => f && f.trim()).length;
    return Math.round((filled / fields.length) * 100);
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!auth?.token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }
      try {
        const data = await UserService.getProfile(auth.token);
        if (mounted) updateAuth(data);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load profile');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [auth?.token]);

  const handleUsernameChange = async () => {
    if (!auth?.token) return;
    setUsernameSuccess(false);
    setUsernameError(false);
    setUsernameLoading(true);
    try {
      const data = await UserService.updateUsername(auth.token, username);
      updateAuth(data);
      setUsernameSuccess(true);
      setTimeout(() => setUsernameSuccess(false), 3000);
    } catch (e: any) {
      console.error('Failed to update username:', e);
      setUsernameError(true);
      Alert.alert('Error', 'Failed to update username');
      setTimeout(() => setUsernameError(false), 3000);
      setUsername('');
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleEmailChange = async () => {
    if (!auth?.token) return;
    setEmailSuccess(false);
    setEmailError(false);
    setEmailLoading(true);
    try {
      const data = await UserService.updateEmail(auth.token, email);
      updateAuth(data);
      setEmailSuccess(true);
      setTimeout(() => setEmailSuccess(false), 3000);
    } catch (e: any) {
      console.error('Failed to update email:', e);
      setEmailError(true);
      Alert.alert('Error', 'Failed to update email');
      setTimeout(() => setEmailError(false), 3000);
      setEmail('');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleLocationChange = async () => {
    if (!auth?.token) return;
    setLocationSuccess(false);
    setLocationError(false);
    setLocationLoading(true);
    try {
      const data = await UserService.updateLocation(auth.token, location);
      updateAuth(data);
      setLocationSuccess(true);
      setTimeout(() => setLocationSuccess(false), 3000);
    } catch (e: any) {
      console.error('Failed to update location:', e);
      setLocationError(true);
      Alert.alert('Error', 'Failed to update location');
      setTimeout(() => setLocationError(false), 3000);
      setLocation('');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleBirthdayChange = async () => {
    if (!auth?.token || !birthday) return;
    setBirthdaySuccess(false);
    setBirthdayError(false);
    setBirthdayLoading(true);
    try {
      // Format date as YYYY-MM-DD for the API
      const formattedDate = birthday.toISOString().split('T')[0];
      const data = await UserService.updateBirthday(auth.token, formattedDate);
      updateAuth(data);
      setBirthdaySuccess(true);
      setTimeout(() => setBirthdaySuccess(false), 3000);
    } catch (e: any) {
      console.error('Failed to update birthday:', e);
      setBirthdayError(true);
      Alert.alert('Error', 'Failed to update birthday');
      setTimeout(() => setBirthdayError(false), 3000);
      setBirthday(null);
    } finally {
      setBirthdayLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!auth?.token) return;
    try {
      await UserService.deleteProfile(auth.token);
      await logout();
      router.replace('/');
    } catch (e: any) {
      Alert.alert('Delete failed', e?.message || 'Failed to delete account');
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete account?',
      'This will permanently delete your account and all your data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDelete },
      ]
    );
  };

  const completion = calculateCompletion();
  const isComplete = completion === 100;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ScrollView
        contentContainerClassName="px-5 pb-8 pt-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              className="mr-3 h-10 w-10 items-center justify-center rounded-full border border-gray-700 active:bg-gray-800">
              <ArrowLeft color="#E5E7EB" size={20} />
            </Pressable>
            <Text className="text-2xl font-bold text-white">Your Profile</Text>
          </View>
        </View>

        {loading && (
          <View className="mt-32 items-center">
            <ActivityIndicator size="large" color="#10B981" />
            <Text className="mt-4 text-base text-gray-400">Loading...</Text>
          </View>
        )}

        {!!error && !loading && (
          <View className="rounded-2xl border border-red-900/50 bg-red-950/30 p-5">
            <Text className="text-center text-base leading-relaxed text-red-400">{error}</Text>
          </View>
        )}

        {!!auth && !loading && !error && (
          <View>
            {/* Completion Card */}
            <View
              className={`mb-6 overflow-hidden rounded-3xl border ${
                isComplete
                  ? 'border-emerald-600/50 bg-gradient-to-br from-emerald-950/40 to-emerald-900/20'
                  : 'border-amber-600/50 bg-gradient-to-br from-amber-950/40 to-amber-900/20'
              }`}>
              <View className="p-5">
                <View className="mb-3 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View
                      className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${
                        isComplete ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}>
                      <Sparkles color="#fff" size={20} />
                    </View>
                    <View>
                      <Text className="text-lg font-bold text-white">
                        {isComplete ? 'Profile Complete!' : 'Complete Your Profile'}
                      </Text>
                      <Text className="text-sm text-gray-400">
                        {isComplete ? "You're all set" : 'Help us get to know you better'}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className={`text-2xl font-bold ${isComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {completion}%
                  </Text>
                </View>

                {/* Progress Bar */}
                <View className="h-2 overflow-hidden rounded-full bg-gray-700">
                  <View
                    className={`h-full rounded-full ${isComplete ? 'bg-emerald-600' : 'bg-amber-600'}`}
                    style={{ width: `${completion}%` }}
                  />
                </View>
              </View>
            </View>

            {/* Input Fields */}
            <View className="gap-4">
              <InputField
                icon={UserIcon}
                label="Username"
                value={username}
                onChangeText={setUsername}
                onBlur={handleUsernameChange}
                loading={usernameLoading}
                success={usernameSuccess}
                error={usernameError}
                placeholder="What should we call you?"
              />

              <InputField
                icon={Mail}
                label="Email"
                value={email}
                onChangeText={setEmail}
                onBlur={handleEmailChange}
                loading={emailLoading}
                success={emailSuccess}
                error={emailError}
                placeholder="Where can we reach you?"
                keyboardType="email-address"
              />

              <InputField
                icon={MapPin}
                label="Location"
                value={location}
                onChangeText={setLocation}
                onBlur={handleLocationChange}
                loading={locationLoading}
                success={locationSuccess}
                error={locationError}
                placeholder="Where are you based?"
              />

              <DateInputField
                icon={Calendar}
                label="Birthday"
                value={birthday}
                onChange={setBirthday}
                onConfirm={handleBirthdayChange}
                loading={birthdayLoading}
                success={birthdaySuccess}
                error={birthdayError}
                placeholder="When were you born?"
              />
            </View>

            {/* Delete Account */}
            <Pressable
              accessibilityRole="button"
              onPress={confirmDelete}
              className="mt-8 items-center rounded-2xl border border-red-900/50 bg-red-950/20 py-4 active:bg-red-950/40">
              <Text className="font-semibold text-red-400">Delete Account</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;
