'use client';

import { type LucideIcon, CheckCircle, XCircle } from 'lucide-react-native';
import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';

interface Props {
  icon: LucideIcon;
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  onConfirm: () => void;
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  placeholder?: string;
}

export default function DateInputField({
  icon: Icon,
  label,
  value,
  onChange,
  onConfirm,
  loading = false,
  success,
  error,
  placeholder = 'Select date',
}: Props) {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date | null) => (date ? date.toLocaleDateString() : placeholder);

  return (
    <View className="mb-4 overflow-hidden rounded-3xl border border-gray-700 bg-gray-800">
      <View className="p-5">
        <View className="mb-3 flex-row items-center">
          <View
            className={`mr-4 h-12 w-12 items-center justify-center rounded-2xl ${
              !value ? 'bg-gray-700' : 'bg-emerald-600/20'
            }`}>
            <Icon color={value ? '#10B981' : '#9CA3AF'} size={22} />
          </View>
          <Text className="flex-1 text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </Text>
          {loading && <ActivityIndicator size="small" color="#10B981" />}
          {!loading && success && (
            <View className="rounded-full bg-emerald-600/20 p-1">
              <CheckCircle color="#10B981" size={24} strokeWidth={2.5} />
            </View>
          )}
          {!loading && error && (
            <View className="rounded-full bg-red-600/20 p-1">
              <XCircle color="#EF4444" size={24} strokeWidth={2.5} />
            </View>
          )}
        </View>

        <Pressable
          onPress={() => setShowPicker(true)}
          className="rounded-2xl border border-gray-600 bg-gray-900 px-5 py-4">
          <Text className={value ? 'text-white' : 'text-gray-500'}>{formatDate(value)}</Text>
        </Pressable>

        {showPicker && Platform.OS === 'ios' && (
          <Modal transparent animationType="fade" visible={showPicker}>
            <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
              <View className="flex-1 items-center justify-center bg-black/50">
                <TouchableWithoutFeedback>
                  <View className="rounded-3xl bg-gray-800 px-5 py-8">
                    <DateTimePicker
                      value={value || new Date()}
                      mode="date"
                      display="spinner"
                      textColor="#fff"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) onChange(selectedDate);
                        onConfirm();
                      }}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}

        {showPicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={value || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (selectedDate) onChange(selectedDate);
              setShowPicker(false);
            }}
          />
        )}
      </View>
    </View>
  );
}
