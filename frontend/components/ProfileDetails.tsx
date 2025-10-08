import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { Profile } from '../types';

type RowProps = {
  label: string;
  value?: string | number | null;
  onEdit?: () => void;
};

const Row = ({ label, value, onEdit }: RowProps) => (
  <View className="mb-5">
    <Text className="mb-1 text-xs uppercase tracking-wider text-gray-400">{label}</Text>
    {onEdit ? (
      <View className="mt-1 flex-row items-center rounded-2xl   px-4 py-3">
        <Text className="flex-1 text-base text-white" numberOfLines={1} ellipsizeMode="tail">
          {value ?? '—'}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onEdit}
          android_ripple={{ color: '#065F46' }}
          className="ml-3 rounded-xl bg-emerald-600 px-3 py-2 active:opacity-90"
        >
          <Text className="text-sm font-medium text-white">Edit</Text>
        </Pressable>
      </View>
    ) : (
      <View className="mt-1 rounded-2xl   px-4 py-3">
        <Text className="text-base text-white">{value ?? '—'}</Text>
      </View>
    )}
  </View>
);

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return iso as string;
  }
};

export const ProfileDetails = ({
  profile,
  onEdit,
}: {
  profile: Profile;
  onEdit?: (field: 'username' | 'email' | 'geboortedatum' | 'locatie') => void;
}) => (
  <View className="rounded-2xl border border-gray-700 bg-gray-800 p-5">
    <Row label="Username" value={profile.username} onEdit={onEdit ? () => onEdit('username') : undefined} />
    <Row label="Email" value={profile.email} onEdit={onEdit ? () => onEdit('email') : undefined} />
    <Row
      label="Birthdate"
      value={formatDate(profile.geboortedatum)}
      onEdit={onEdit ? () => onEdit('geboortedatum') : undefined}
    />
    <Row label="Location" value={profile.locatie} onEdit={onEdit ? () => onEdit('locatie') : undefined} />
    <Row label="User ID" value={profile.id} />
  </View>
);

export default ProfileDetails;
