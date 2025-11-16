'use client';

import { useState, useEffect } from 'react';
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
import {
  Calendar,
  MapPin,
  FileText,
  CheckSquare,
  ChevronDown,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import EventService from '../services/EventService';
import TaskService from '../services/TaskService';
import { TaskType } from '../types';
import InputField from '../components/InputField';
import DateInputField from '../components/DateInputField';
import * as SecureStore from 'expo-secure-store';
import useSWR, { mutate } from 'swr';
import React from 'react';
import { Picker } from '@react-native-picker/picker';

const CreatorScreen = () => {
  const { auth } = useAuth();
  const [dormCode, setDormCode] = useState<string>('');
  const [isEvent, setIsEvent] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');
  const [eventDate, setEventDate] = useState<Date | null>(null);

  const [title, setTitle] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [taskDate, setTaskDate] = useState<Date | null>(null);
  const [type, setType] = useState<TaskType>(TaskType.CLEANING);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [celebration, setCelebration] = useState<boolean>(false);

  useEffect(() => {
    const loadDormCode = async () => {
      try {
        const storedCode = await SecureStore.getItemAsync('dormCode');
        if (storedCode) {
          setDormCode(storedCode);
        }
      } catch (error) {
        console.error('Error loading dorm code:', error);
      }
    };
    loadDormCode();
  }, []);

  const { data: dorm } = useSWR(auth?.token ? 'homeData' : null);
  const hasDorm = Boolean(
    dorm && typeof dorm === 'object' && (dorm.id || dorm.code || (Array.isArray(dorm.users) && dorm.users.length > 0))
  );

  const handleCreateEvent = async () => {
    if (!name.trim() || !eventDate) {
      Alert.alert('Missing Fields', 'Please fill in name and date');
      return;
    }

    setLoading(true);
    try {
      const formattedDate = eventDate.toISOString();
      await EventService.createEvent(
        auth?.token as string,
        dormCode,
        name,
        formattedDate,
        location,
        eventDescription
      );
      setCelebration(true);
      setTimeout(() => {
        Alert.alert('Success!', 'Event created successfully 🎉');
        mutate('homeData');
        router.back();
      }, 400);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!title.trim() || !taskDate) {
      Alert.alert('Missing Fields', 'Please fill in title and date');
      return;
    }

    setLoading(true);
    try {
      const formattedDate = taskDate.toISOString();
      await TaskService.createTask(
        auth?.token as string,
        dormCode,
        title,
        formattedDate,
        type,
        taskDescription
      );
      setCelebration(true);
      setTimeout(() => {
        Alert.alert('Success!', 'Task created successfully 🎉');
        mutate('homeData');
        router.back();
      }, 400);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const taskTypes = [
    { label: 'Cleaning', value: TaskType.CLEANING },
    { label: 'Bathroom', value: TaskType.BATHROOM },
    { label: 'Cooking', value: TaskType.COOKING },
    { label: 'Groceries', value: TaskType.GROCERIES },
    { label: 'Dishes', value: TaskType.DISHES },
    { label: 'Kitchen', value: TaskType.KITCHEN },
    { label: 'Trash', value: TaskType.TRASH },
  ];

  const getProgress = () => {
    if (isEvent) {
      const filled = [name, eventDate, location, eventDescription].filter(
        (v) => v !== null && v !== undefined && v !== ''
      ).length;
      return (filled / 4) * 100;
    } else {
      const filled = [title, taskDate, type, taskDescription].filter(
        (v) => v !== null && v !== undefined && v !== ''
      ).length;
      return (filled / 4) * 100;
    }
  };

  const progress = getProgress();
  const isFormValid = isEvent ? name.trim() && eventDate : title.trim() && taskDate;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ScrollView
        contentContainerClassName="px-6 pb-10 pt-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
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
              setCurrentStep(0);
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
              setCurrentStep(0);
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

        <View className="mb-6 gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-medium text-gray-400">Progress</Text>
            <Text className="text-xs font-semibold text-emerald-500">{Math.round(progress)}%</Text>
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-gray-700">
            <View style={{ width: `${progress}%`, height: '100%' }} className="bg-emerald-500" />
          </View>
        </View>

        <View className="mb-6 gap-3">
          {isEvent ? (
            <>
              <InputField
                icon={FileText}
                label="Event Name"
                value={name}
                onChangeText={setName}
                placeholder="Something catchy..."
                onBlur={() => {}}
                loading={false}
              />

              <DateInputField
                icon={Calendar}
                label="Date & Time"
                value={eventDate}
                onChange={setEventDate}
                placeholder="Pick a date"
                onConfirm={() => {}}
              />

              <InputField
                icon={MapPin}
                label="Where's it at?"
                value={location}
                onChangeText={setLocation}
                placeholder="Location..."
                onBlur={() => {}}
                loading={false}
              />

              <InputField
                icon={FileText}
                label="Add details"
                value={eventDescription}
                onChangeText={setEventDescription}
                placeholder="What's this about?"
                onBlur={() => {}}
                loading={false}
              />
            </>
          ) : (
            <>
              <InputField
                icon={CheckSquare}
                label="Task Title"
                value={title}
                onChangeText={setTitle}
                placeholder="What needs to happen?"
                onBlur={() => {}}
                loading={false}
              />

              <DateInputField
                icon={Calendar}
                label="Due Date"
                value={taskDate}
                onChange={setTaskDate}
                placeholder="When's it due?"
                onConfirm={() => {}}
              />

              <InputField
                icon={FileText}
                label="Details"
                value={taskDescription}
                onChangeText={setTaskDescription}
                placeholder="Add some context..."
                onBlur={() => {}}
                loading={false}
              />
            </>
          )}
        </View>

        {!isEvent && (
          <View className="mb-6 ">
            <Text className="mb-2 text-sm font-semibold text-gray-300">Task Category</Text>

            <View className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-900">
              <Picker
                selectedValue={type}
                onValueChange={(itemValue) => setType(itemValue)}
                dropdownIconColor="#10b981"
                itemStyle={{ color: '#ffffff', backgroundColor: '#1f2937' }} // optional styling
              >
                {taskTypes.map((taskType) => (
                  <Picker.Item key={taskType.value} label={taskType.label} value={taskType.value} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {/* Only show the create button for events when the user is in a dorm */}
        {isEvent && !hasDorm ? (
          <View className="mt-2 items-center rounded-2xl py-4">
            <Text className="text-sm text-gray-500">Join or create a dorm to create events.</Text>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={isEvent ? handleCreateEvent : handleCreateTask}
            disabled={loading || !isFormValid}
            className={`mt-2 items-center rounded-2xl py-4 transition-all ${
              loading
                ? 'bg-gray-700'
                : isFormValid
                  ? 'bg-emerald-500 active:scale-95'
                  : 'bg-gray-700/50'
            }`}>
            <View className="flex-row items-center justify-center gap-2">
              {loading ? (
                <Text className="text-lg font-semibold text-gray-400">Creating...</Text>
              ) : (
                <>
                  <Sparkles color="#ffffff" size={20} />
                  <Text
                    className={`text-lg font-semibold ${isFormValid ? 'text-white' : 'text-gray-500'}`}>
                    Create {isEvent ? 'Event' : 'Task'}
                  </Text>
                </>
              )}
            </View>
          </Pressable>
        )}

        <View className="mt-4 items-center">
          <Text className="text-xs text-gray-500">
            {isFormValid
              ? "You're all set! Ready to go."
              : 'Fill in the required fields to continue'}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreatorScreen;
