import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import type { Profile } from '../types';
import { ArrowLeft, User, Mail, Calendar, MapPin, Sparkles, Check } from 'lucide-react-native';

const ProfileScreen = () => {
  const { auth, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<
    null | 'username' | 'email' | 'geboortedatum' | 'locatie'
  >(null);
  const [draft, setDraft] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const formatDateReadable = (iso?: string | null): string => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const parseIsoToDate = (iso?: string | null): Date | null => {
    if (!iso) return null;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  };

  const calculateCompletion = () => {
    if (!profile) return 0;
    const fields = [profile.username, profile.email, profile.geboortedatum, profile.locatie];
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
        const data = await userService.getProfile(auth.token);
        if (mounted) setProfile(data);
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

  const handleEditField = (field: 'username' | 'email' | 'geboortedatum' | 'locatie') => {
    if (!profile) return;
    setEditingField(field);
    setSaveError(null);
    if (field === 'geboortedatum') {
      const d = parseIsoToDate(profile.geboortedatum) ?? new Date(2000, 0, 1);
      setBirthDate(d);
      setDraft(profile.geboortedatum || formatDate(d));
    } else {
      setDraft(String((profile as any)[field] ?? ''));
    }
  };

  const onChangeBirth = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set' && selectedDate) {
        setBirthDate(selectedDate);
        setDraft(formatDate(selectedDate));
      }
      setShowDatePicker(false);
    } else {
      if (selectedDate) {
        setBirthDate(selectedDate);
        setDraft(formatDate(selectedDate));
      }
    }
  };

  const applySave = async () => {
    if (!auth?.token || !profile || !editingField) return;
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        username: editingField === 'username' ? draft : profile.username,
        email: editingField === 'email' ? draft : profile.email,
        geboortedatum: editingField === 'geboortedatum' ? draft : profile.geboortedatum,
        locatie: editingField === 'locatie' ? draft : profile.locatie,
      };
      const updated = await userService.updateProfile(auth.token, payload);
      setProfile(updated);
      setEditingField(null);
      setDraft('');
    } catch (e: any) {
      setSaveError(e?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!auth?.token) return;
    try {
      await userService.deleteProfile(auth.token);
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

  const ProfileCard = ({
    icon: Icon,
    label,
    value,
    placeholder,
    field,
    isDate = false,
  }: {
    icon: any;
    label: string;
    value?: string | null;
    placeholder: string;
    field: 'username' | 'email' | 'geboortedatum' | 'locatie';
    isDate?: boolean;
  }) => {
    const isEmpty = !value || !value.trim();
    const displayValue = isDate && value ? formatDateReadable(value) : value;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Edit ${label}`}
        onPress={() => handleEditField(field)}
        className="active:bg-gray-750 overflow-hidden rounded-3xl border border-gray-700 bg-gray-800">
        <View className="flex-row items-center p-5">
          <View
            className={`mr-4 h-12 w-12 items-center justify-center rounded-2xl ${
              isEmpty ? 'bg-gray-700' : 'bg-emerald-600/20'
            }`}>
            <Icon color={isEmpty ? '#9CA3AF' : '#10B981'} size={22} />
          </View>
          <View className="flex-1">
            <Text className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
              {label}
            </Text>
            {isEmpty ? (
              <Text className="text-base text-gray-500">{placeholder}</Text>
            ) : (
              <Text className="text-base font-medium text-white">{displayValue}</Text>
            )}
          </View>
          {!isEmpty && (
            <View className="h-6 w-6 items-center justify-center rounded-full bg-emerald-600">
              <Check color="#fff" size={14} strokeWidth={3} />
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  const completion = calculateCompletion();
  const isComplete = completion === 100;

  return (
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

      {!!profile && !loading && !error && (
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
                  className={`text-2xl font-bold ${
                    isComplete ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                  {completion}%
                </Text>
              </View>

              {/* Progress Bar */}
              <View className="h-2 overflow-hidden rounded-full bg-gray-700">
                <View
                  className={`h-full rounded-full ${
                    isComplete ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}
                  style={{ width: `${completion}%` }}
                />
              </View>
            </View>
          </View>

          {/* Profile Cards */}
          <View className="gap-4">
            <ProfileCard
              icon={User}
              label="Username"
              value={profile.username}
              placeholder="What should we call you?"
              field="username"
            />

            <ProfileCard
              icon={Mail}
              label="Email"
              value={profile.email}
              placeholder="Where can we reach you?"
              field="email"
            />

            <ProfileCard
              icon={Calendar}
              label="Birthday"
              value={profile.geboortedatum}
              placeholder="When's your special day?"
              field="geboortedatum"
              isDate
            />

            <ProfileCard
              icon={MapPin}
              label="Location"
              value={profile.locatie}
              placeholder="Where are you based?"
              field="locatie"
            />
          </View>

          {/* Edit Modal */}
          {editingField && (
            <View className="mt-6 rounded-3xl border border-emerald-600/30 bg-gray-800 p-6 shadow-2xl">
              <Text className="mb-5 text-xl font-bold text-white">
                {editingField === 'username' && 'What should we call you?'}
                {editingField === 'email' && 'Where can we reach you?'}
                {editingField === 'geboortedatum' && "When's your birthday?"}
                {editingField === 'locatie' && 'Where are you based?'}
              </Text>

              {editingField === 'geboortedatum' ? (
                Platform.OS === 'web' ? (
                  <TextInput
                    value={draft}
                    onChangeText={setDraft}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#6B7280"
                    className="mb-2 rounded-2xl border border-gray-600 bg-gray-900 px-5 py-4 text-base text-white"
                    autoFocus
                  />
                ) : (
                  <View>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => setShowDatePicker(true)}
                      className="mb-2 rounded-2xl border border-gray-600 bg-gray-900 px-5 py-4 active:bg-gray-800">
                      <Text className="text-base text-white">
                        {draft ? formatDateReadable(draft) : 'Select your birthday'}
                      </Text>
                    </Pressable>
                    {showDatePicker && (
                      <View className="mt-4">
                        <DateTimePicker
                          value={birthDate ?? new Date(2000, 0, 1)}
                          mode="date"
                          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                          onChange={onChangeBirth}
                          maximumDate={new Date()}
                          textColor="#FFFFFF"
                        />
                        {Platform.OS === 'ios' && (
                          <Pressable
                            accessibilityRole="button"
                            onPress={() => setShowDatePicker(false)}
                            className="mt-4 items-center rounded-2xl bg-emerald-600 py-3 active:bg-emerald-700">
                            <Text className="font-semibold text-white">Done</Text>
                          </Pressable>
                        )}
                      </View>
                    )}
                  </View>
                )
              ) : (
                <TextInput
                  value={draft}
                  onChangeText={setDraft}
                  className="mb-2 rounded-2xl border border-gray-600 bg-gray-900 px-5 py-4 text-base text-white"
                  placeholderTextColor="#6B7280"
                  placeholder={
                    editingField === 'username'
                      ? 'Enter your username'
                      : editingField === 'email'
                        ? 'Enter your email'
                        : 'Enter your location'
                  }
                  autoFocus
                  autoCapitalize={editingField === 'email' ? 'none' : 'words'}
                  keyboardType={editingField === 'email' ? 'email-address' : 'default'}
                />
              )}

              {saveError && (
                <View className="mb-4 rounded-xl border border-red-900/50 bg-red-950/30 p-3">
                  <Text className="text-sm text-red-400">{saveError}</Text>
                </View>
              )}

              <View className="mt-4 flex-row gap-3">
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setEditingField(null);
                    setDraft('');
                    setSaveError(null);
                    setShowDatePicker(false);
                  }}
                  className="flex-1 items-center justify-center rounded-2xl border border-gray-600 py-4 active:bg-gray-700">
                  <Text className="text-base font-semibold text-white">Cancel</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={saving || !draft.trim()}
                  onPress={applySave}
                  className={`flex-1 items-center justify-center rounded-2xl py-4 ${
                    !saving && draft.trim()
                      ? 'bg-emerald-600 active:bg-emerald-700'
                      : 'bg-emerald-900/40'
                  }`}>
                  {saving ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text
                      className={`text-base font-semibold ${
                        draft.trim() ? 'text-white' : 'text-emerald-800'
                      }`}>
                      Save
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          )}

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
  );
};

export default ProfileScreen;
