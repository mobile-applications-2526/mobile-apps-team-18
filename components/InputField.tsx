'use client';

import { type LucideIcon, CheckCircle, XCircle } from 'lucide-react-native';
import React from 'react';
import { View, Text, TextInput, ActivityIndicator, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onCustomBlur?: (text: string) => void;
  loading?: boolean;
  success?: boolean;
  error?: boolean;
}

export default function InputField({
  icon: Icon,
  label,
  value,
  onChangeText,
  onCustomBlur,
  loading = false,
  success = false,
  error = false,
  placeholder,
  keyboardType = 'default',
  ...rest
}: Props) {
  const isEmpty = !value || !value.trim();

  return (
    <View className="mb-2 overflow-hidden rounded-2xl border border-gray-700 bg-gray-800">
      <View className="p-3">
        <View className="mb-2 flex-row items-center">
          <View
            className={`mr-3 h-9 w-9 items-center justify-center rounded-lg ${
              isEmpty ? 'bg-gray-700' : 'bg-emerald-600/20'
            }`}>
            <Icon color={isEmpty ? '#9CA3AF' : '#10B981'} size={18} />
          </View>

          <Text className="flex-1 text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </Text>

          {loading && <ActivityIndicator size="small" color="#10B981" />}
          {!loading && success && (
            <View className="rounded-full bg-emerald-600/20 p-0.5">
              <CheckCircle color="#10B981" size={20} strokeWidth={2.5} />
            </View>
          )}
          {!loading && error && (
            <View className="rounded-full bg-red-600/20 p-0.5">
              <XCircle color="#EF4444" size={20} strokeWidth={2.5} />
            </View>
          )}
        </View>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          onBlur={() => onCustomBlur?.(value)}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          keyboardType={keyboardType}
          className="rounded-lg border border-gray-600 bg-gray-900 px-3 py-2.5 text-base text-white"
          {...rest}
        />
      </View>
    </View>
  );
}
