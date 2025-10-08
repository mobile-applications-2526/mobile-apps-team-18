import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TextInput, Pressable, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import type { Profile } from '../types';
import ProfileDetails from '../components/ProfileDetails';

const ProfileScreen = () => {
  const { auth } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<null | 'username' | 'email' | 'geboortedatum' | 'locatie'>(null);
  const [draft, setDraft] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const parseIsoToDate = (iso?: string | null): Date | null => {
    if (!iso) return null;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
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
    return () => { mounted = false; };
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


  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView contentContainerClassName="px-6 py-6">
        <Text className="mb-6 text-2xl font-bold text-white">My Profile</Text>

        {loading && (
          <View className="mt-10 items-center">
            <ActivityIndicator color="#10B981" />
            <Text className="mt-3 text-gray-400">Loading your info…</Text>
          </View>
        )}

        {!!error && !loading && (
          <Text className="text-red-500">{error}</Text>
        )}

        {!!profile && !loading && !error && (
          <View className="gap-4">
            <ProfileDetails profile={profile} onEdit={handleEditField} />

            {editingField && (
              <View className="rounded-2xl border border-gray-700 bg-gray-800 p-5">
                <Text className="mb-2 text-sm font-medium text-white">Edit {editingField}</Text>

                {editingField === 'geboortedatum' ? (
                  Platform.OS === 'web' ? (
                    <TextInput
                      value={draft}
                      onChangeText={setDraft}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#9CA3AF"
                      className="rounded-2xl border border-gray-300 px-4 py-3 text-base text-white"
                    />
                  ) : (
                    <View>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => setShowDatePicker(true)}
                        className="rounded-2xl border border-gray-300 px-4 py-3"
                      >
                        <Text className="text-base text-white">{draft || 'YYYY-MM-DD'}</Text>
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
                  )
                ) : (
                  <TextInput
                    value={draft}
                    onChangeText={setDraft}
                    className="rounded-2xl border border-gray-300 px-4 py-3 text-base text-white"
                    placeholderTextColor="#9CA3AF"
                  />
                )}

                {saveError ? (
                  <Text className="mt-2 text-sm text-red-500">{saveError}</Text>
                ) : null}
                <View className="mt-3 flex-row gap-3">
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => { setEditingField(null); setDraft(''); setSaveError(null); setShowDatePicker(false); }}
                    className="flex-1 items-center justify-center rounded-2xl bg-gray-700 px-4 py-3 active:opacity-90"
                  >
                    <Text className="text-white">Cancel</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    disabled={saving || !draft.trim()}
                    onPress={applySave}
                    className={`flex-1 items-center justify-center rounded-2xl px-4 py-3 active:opacity-90 ${
                      !saving && draft.trim() ? 'bg-emerald-600' : 'bg-emerald-300'
                    }`}
                  >
                    {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white">Save</Text>}
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;