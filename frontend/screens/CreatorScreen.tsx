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
  ArrowLeft,
  Calendar,
  MapPin,
  FileText,
  CheckSquare,
  ChevronDown,
} from 'lucide-react-native';
import EventService from '../services/EventService';
import TaskService from '../services/TaskService';
import { TaskType } from '../types';
import InputField from '../components/InputField';
import DateInputField from '../components/DateInputField';
import React from 'react';
import * as SecureStore from 'expo-secure-store';
import { mutate } from 'swr';

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
      Alert.alert('Success', 'Event created successfully');
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
      Alert.alert('Success', 'Task created successfully');
      mutate('homeData');
      router.back();
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ScrollView
        contentContainerClassName="px-5 pb-24 pt-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              className="mr-3 h-10 w-10 items-center justify-center rounded-full border border-gray-700 active:bg-gray-800">
              <ArrowLeft color="#E5E7EB" size={20} />
            </Pressable>
            <Text className="text-2xl font-bold text-white">
              Create {isEvent ? 'Event' : 'Task'}
            </Text>
          </View>
        </View>

        {/* Type Selector Dropdown */}
        <View className="mb-6">
          <Text className="mb-2 text-sm font-medium text-gray-400">Type</Text>
          <Pressable
            onPress={() => setDropdownOpen(!dropdownOpen)}
            className="flex-row items-center justify-between rounded-2xl border border-gray-700 bg-gray-800 px-4 py-4">
            <View className="flex-row items-center">
              {isEvent ? (
                <Calendar color="#10B981" size={20} className="mr-3" />
              ) : (
                <CheckSquare color="#10B981" size={20} className="mr-3" />
              )}
              <Text className="text-base text-white">{isEvent ? 'Event' : 'Task'}</Text>
            </View>
            <ChevronDown
              color="#9CA3AF"
              size={20}
              style={{ transform: [{ rotate: dropdownOpen ? '180deg' : '0deg' }] }}
            />
          </Pressable>

          {dropdownOpen && (
            <View className="mt-2 overflow-hidden rounded-2xl border border-gray-700 bg-gray-800">
              <Pressable
                onPress={() => {
                  setIsEvent(true);
                  setDropdownOpen(false);
                }}
                className="flex-row items-center border-b border-gray-700 px-4 py-4 active:bg-gray-700">
                <Calendar color="#10B981" size={20} className="mr-3" />
                <Text className="text-base text-white">Event</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsEvent(false);
                  setDropdownOpen(false);
                }}
                className="flex-row items-center px-4 py-4 active:bg-gray-700">
                <CheckSquare color="#10B981" size={20} className="mr-3" />
                <Text className="text-base text-white">Task</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View className="gap-4">
          {isEvent ? (
            <>
              <InputField
                icon={FileText}
                label="Event Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter event name"
                onBlur={() => {}}
                loading={false}
              />

              <DateInputField
                icon={Calendar}
                label="Date & Time"
                value={eventDate}
                onChange={setEventDate}
                placeholder="Select date and time"
                onConfirm={() => {}}
              />

              <InputField
                icon={MapPin}
                label="Location"
                value={location}
                onChangeText={setLocation}
                placeholder="Enter location"
                onBlur={() => {}}
                loading={false}
              />

              <InputField
                icon={FileText}
                label="Description"
                value={eventDescription}
                onChangeText={setEventDescription}
                placeholder="Enter description"
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
                placeholder="Enter task title"
                onBlur={() => {}}
                loading={false}
              />

              <DateInputField
                icon={Calendar}
                label="Due Date"
                value={taskDate}
                onChange={setTaskDate}
                placeholder="Select due date"
                onConfirm={() => {}}
              />

              <View>
                <Text className="mb-2 text-sm font-medium text-gray-400">Task Type</Text>
                <Pressable
                  onPress={() => setTypeDropdownOpen(!typeDropdownOpen)}
                  className="flex-row items-center justify-between rounded-2xl border border-gray-700 bg-gray-800 px-4 py-4">
                  <Text className="text-base text-white">
                    {taskTypes.find((t) => t.value === type)?.label}
                  </Text>
                  <ChevronDown
                    color="#9CA3AF"
                    size={20}
                    style={{ transform: [{ rotate: typeDropdownOpen ? '180deg' : '0deg' }] }}
                  />
                </Pressable>

                {typeDropdownOpen && (
                  <View className="mt-2 overflow-hidden rounded-2xl border border-gray-700 bg-gray-800">
                    {taskTypes.map((taskType, index) => (
                      <Pressable
                        key={taskType.value}
                        onPress={() => {
                          setType(taskType.value);
                          setTypeDropdownOpen(false);
                        }}
                        className={`px-4 py-4 active:bg-gray-700 ${
                          index < taskTypes.length - 1 ? 'border-b border-gray-700' : ''
                        }`}>
                        <Text className="text-base text-white">{taskType.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <InputField
                icon={FileText}
                label="Description"
                value={taskDescription}
                onChangeText={setTaskDescription}
                placeholder="Enter description"
                onBlur={() => {}}
                loading={false}
              />
            </>
          )}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={isEvent ? handleCreateEvent : handleCreateTask}
          disabled={loading}
          className={`mt-8 items-center rounded-2xl py-4 ${
            loading ? 'bg-gray-700' : 'bg-emerald-600 active:bg-emerald-700'
          }`}>
          <Text className="text-lg font-semibold text-white">
            {loading ? 'Creating...' : `Create ${isEvent ? 'Event' : 'Task'}`}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreatorScreen;
