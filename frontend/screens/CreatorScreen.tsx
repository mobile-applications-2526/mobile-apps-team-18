'use client';

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import DateInputField from '../components/DateInputField';
import useSWR, { mutate } from 'swr';
import { Calendar, CheckSquare, FileText, MapPin, Sparkles } from 'lucide-react-native';
import EventService from '../services/EventService';
import TaskService from '../services/TaskService';
import { Dorm, TaskType } from '../types';
import { Picker } from '@react-native-picker/picker';

const CreatorScreen = () => {
  const { auth } = useAuth();

  const [isEvent, setIsEvent] = useState(true);

  // Event fields
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState<Date | null>(null);

  // Task fields
  const [title, setTitle] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [taskDate, setTaskDate] = useState<Date | null>(null);
  const [type, setType] = useState<TaskType>(TaskType.CLEANING);

  const [loading, setLoading] = useState(false);

  const { data: dorm } = useSWR<Dorm>(auth?.token ? 'homeData' : null);

  const hasDorm = Boolean(
    dorm &&
      typeof dorm === 'object' &&
      (dorm.id || dorm.code || (Array.isArray(dorm.users) && dorm.users.length > 0))
  );

  const handleCreateEvent = async () => {
    if (!name.trim() || !eventDate) {
      Alert.alert('Missing Fields', 'Please fill in the name and select a date');
      return;
    }

    if (!auth?.token) return;

    setLoading(true);
    try {
      const formattedDate = eventDate.toISOString();
      await EventService.createEvent(
        auth.token,
        dorm?.code!,
        name,
        formattedDate,
        location,
        eventDescription
      );
      Alert.alert('Success!', 'Event created successfully 🎉');
      mutate('homeData');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!title.trim() || !taskDate) {
      Alert.alert('Missing Fields', 'Please fill in the title and select a due date');
      return;
    }

    if (!auth?.token) return;

    setLoading(true);
    try {
      const formattedDate = taskDate.toISOString();
      await TaskService.createTask(
        auth.token,
        dorm?.code!,
        title,
        formattedDate,
        type,
        taskDetails
      );
      Alert.alert('Success!', 'Task created successfully 🎉');
      mutate('homeData');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const isEventFormValid =
    name.trim().length > 0 &&
    eventDate !== null &&
    location.trim().length > 0 &&
    eventDescription.trim().length > 0;

  const isTaskFormValid =
    title.trim().length > 0 && taskDate !== null && taskDetails.trim().length > 0 && type !== null;

  // Use the proper one depending on the form
  const isFormValid = isEvent ? isEventFormValid : isTaskFormValid;

  const taskTypes = [
    { label: 'Cleaning', value: TaskType.CLEANING },
    { label: 'Bathroom', value: TaskType.BATHROOM },
    { label: 'Cooking', value: TaskType.COOKING },
    { label: 'Groceries', value: TaskType.GROCERIES },
    { label: 'Dishes', value: TaskType.DISHES },
    { label: 'Kitchen', value: TaskType.KITCHEN },
    { label: 'Trash', value: TaskType.TRASH },
  ];

  if (!hasDorm) {
    return (
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-center text-lg text-gray-400">
          You are not part of a dorm yet. Please join or create a dorm to use this feature.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-white">Creator</Text>
          <View className="items-center justify-center rounded-full bg-emerald-500/20 p-3">
            <Sparkles color="#10b981" size={24} />
          </View>
        </View>
        <View className="mb-6 flex-row gap-3 rounded-3xl border border-gray-700 bg-gray-800/50 p-2">
          <Pressable
            onPress={() => {
              setIsEvent(true);
            }}
            className={`flex-1 items-center justify-center rounded-2xl py-3 ${
              isEvent ? 'bg-emerald-500' : 'bg-gray-700/50'
            }`}>
            <View className="flex-row items-center justify-center gap-2">
              <Calendar color={isEvent ? '#ffffff' : '#9CA3AF'} size={18} />
              <Text className={`font-semibold ${isEvent ? 'text-white' : 'text-gray-400'}`}>
                Event
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              setIsEvent(false);
            }}
            className={`flex-1 items-center justify-center rounded-2xl py-3 ${
              !isEvent ? 'bg-emerald-500' : 'bg-gray-700/50'
            }`}>
            <View className="flex-row items-center justify-center gap-2">
              <CheckSquare color={!isEvent ? '#ffffff' : '#9CA3AF'} size={18} />
              <Text className={`font-semibold ${!isEvent ? 'text-white' : 'text-gray-400'}`}>
                Task
              </Text>
            </View>
          </Pressable>
        </View>

        {isEvent ? (
          <>
            <InputField
              label="Event Name"
              value={name}
              onChangeText={setName}
              placeholder="Event Name"
              icon={FileText}
              onBlur={() => {}}
              loading={false}
            />
            <DateInputField
              label="Date"
              value={eventDate}
              onChange={setEventDate}
              icon={Calendar}
              placeholder="Select date"
              onConfirm={() => {}}
            />
            <InputField
              label="Location"
              value={location}
              onChangeText={setLocation}
              placeholder="Location"
              icon={MapPin}
              onBlur={() => {}}
              loading={false}
            />
            <InputField
              label="Description"
              value={eventDescription}
              onChangeText={setEventDescription}
              placeholder="Description"
              icon={FileText}
              onBlur={() => {}}
              loading={false}
            />
          </>
        ) : (
          <>
            <InputField
              label="Task Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Task Title"
              icon={FileText}
              onBlur={() => {}}
              loading={false}
            />
            <DateInputField
              label="Due Date"
              value={taskDate}
              onChange={setTaskDate}
              icon={Calendar}
              placeholder="Select due date"
              onConfirm={() => {}}
            />
            <InputField
              label="Details"
              value={taskDetails}
              onChangeText={setTaskDetails}
              placeholder="Details"
              icon={FileText}
              onBlur={() => {}}
              loading={false}
            />
            <Text style={{ marginBottom: 5, color: '#999', fontWeight: 'bold' }}>Category</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#374151',
                borderRadius: 24,
                marginBottom: 10,
              }}>
              <Picker
                selectedValue={type}
                onValueChange={(itemValue) => setType(itemValue)}
                style={{ backgroundColor: '#1f2937', borderRadius: 24 }}>
                {taskTypes.map((taskType) => (
                  <Picker.Item
                    key={taskType.value}
                    label={taskType.label}
                    value={taskType.value}
                    color="#fff"
                  />
                ))}
              </Picker>
            </View>
          </>
        )}

        <Pressable
          accessibilityRole="button"
          onPress={isEvent ? handleCreateEvent : handleCreateTask}
          disabled={loading || !isFormValid}
          className="mt-2 items-center justify-center rounded-lg py-4"
          style={{
            backgroundColor: loading ? '#374151' : isFormValid ? '#10B981' : 'rgba(55,65,81,0.5)',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {loading ? (
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#9CA3AF' }}>Creating...</Text>
            ) : (
              <>
                <Sparkles color="#fff" size={20} />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: isFormValid ? '#fff' : '#9CA3AF',
                  }}>
                  Create {isEvent ? 'Event' : 'Task'}
                </Text>
              </>
            )}
          </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreatorScreen;
