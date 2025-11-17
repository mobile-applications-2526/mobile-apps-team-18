import { router } from 'expo-router';
import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import useSWR, { mutate } from 'swr';
import { ArrowLeft, Calendar, MapPin, User, Users } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import EventService from '../../services/EventService';
import { Event } from '../../types';

interface Props {
  eventId: number;
}

export default function EventOverviewScreen({ eventId }: Props) {
  const { auth } = useAuth();

  const fetcher = async (key: string) => {
    if (!auth?.token) throw new Error('No auth token');
    return await EventService.getById(auth.token, eventId);
  };

  const { data: event, isLoading } = useSWR<Event>('event-' + eventId, fetcher);

  const handleJoinLeave = async () => {
    if (!auth?.token || !event) return;

    try {
      const response = await EventService.joinEvent(auth.token, eventId);
      if (response) {
        mutate('event-' + eventId, response, false);
      }
    } catch (err) {
      console.error('[v0] Error joining/leaving event:', err);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-950">
        <Text className="text-gray-400">Loading event...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-950">
        <Text className="text-lg text-gray-400">Event not found</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 rounded-2xl bg-emerald-600 px-6 py-3 active:opacity-80">
          <Text className="font-semibold text-white">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const isJoined = event.participants?.some((u) => u.username === auth?.username);
  const isOrganizer = event.organizer?.username === auth?.username;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
    const months = [
      'januari',
      'februari',
      'maart',
      'april',
      'mei',
      'juni',
      'juli',
      'augustus',
      'september',
      'oktober',
      'november',
      'december',
    ];
    const day = days[date.getDay()];
    const dateNum = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${dateNum} ${month} om ${hours}:${minutes}`;
  };

  return (
    <ScrollView contentContainerClassName="px-6 pt-6 pb-10" showsVerticalScrollIndicator={false}>
      {/* Header with Back Button */}
      <View className="mb-6 flex-row items-center">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 items-center justify-center rounded-full border border-gray-700 active:bg-gray-800">
          <ArrowLeft color="#E5E7EB" size={20} />
        </Pressable>
        <Text className="flex-1 text-2xl font-bold text-white">Event Details</Text>
      </View>

      {/* Event Title Card */}
      <View className="mb-4 rounded-3xl border border-gray-700 bg-gray-800 p-6">
        <View className="mb-3 flex-row items-center justify-between">
          <View className="rounded-full bg-purple-600/20 px-3 py-1">
            <Text className="text-xs font-medium text-purple-400">Evenement</Text>
          </View>
          {isJoined && (
            <View className="flex-row items-center gap-1">
              <View className="h-2 w-2 rounded-full bg-emerald-500" />
              <Text className="text-xs text-emerald-500">Je neemt deel</Text>
            </View>
          )}
          {isOrganizer && (
            <View className="rounded-full bg-orange-400/20 px-3 py-1">
              <Text className="text-xs font-medium text-orange-400">Organisator</Text>
            </View>
          )}
        </View>
        <Text className="text-3xl font-bold text-white">{event.name}</Text>
      </View>

      {/* Event Info Card */}
      <View className="mb-4 rounded-3xl border border-gray-700 bg-gray-800 p-6">
        <Text className="mb-4 text-lg font-semibold text-white">Informatie</Text>

        {/* Date */}
        <View className="mb-4 flex-row items-start">
          <View className="mr-3 mt-1 h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/20">
            <Calendar size={16} color="#10B981" />
          </View>
          <View className="flex-1">
            <Text className="mb-1 text-xs font-medium text-gray-400">Datum & Tijd</Text>
            <Text className="text-base text-white">{formatDate(event.date)}</Text>
          </View>
        </View>

        {/* Location */}
        {(event.location || event.kotAddress) && (
          <View className="mb-4 flex-row items-start">
            <View className="mr-3 mt-1 h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/20">
              <MapPin size={16} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-xs font-medium text-gray-400">Locatie</Text>
              <Text className="text-base text-white">
                {event.location || event.kotAddress || 'Geen locatie opgegeven'}
              </Text>
            </View>
          </View>
        )}

        {/* Organizer */}
        {event.organizer && (
          <View className="flex-row items-start">
            <View className="mr-3 mt-1 h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/20">
              <User size={16} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-xs font-medium text-gray-400">Organisator</Text>
              <Text className="text-base text-white">{event.organizer.username}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Description Card */}
      {event.description && (
        <View className="mb-4 rounded-3xl border border-gray-700 bg-gray-800 p-6">
          <Text className="mb-3 text-lg font-semibold text-white">Beschrijving</Text>
          <Text className="text-base leading-relaxed text-gray-300">{event.description}</Text>
        </View>
      )}

      {/* Participants Card */}
      {event.participants && event.participants.length > 0 && (
        <View className="mb-6 rounded-3xl border border-gray-700 bg-gray-800 p-6">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/20">
              <Users size={16} color="#10B981" />
            </View>
            <Text className="text-lg font-semibold text-white">
              Deelnemers ({event.participants.length})
            </Text>
          </View>
          <View className="gap-2">
            {event.participants.map((participant, index) => (
              <View
                key={participant.id || index}
                className="flex-row items-center rounded-2xl border border-gray-700 bg-gray-900 p-3">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-emerald-600">
                  <Text className="font-semibold text-white">
                    {participant.username?.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text className="flex-1 text-base text-white">{participant.username}</Text>
                {participant.username === auth?.username && (
                  <View className="rounded-full bg-emerald-600/20 px-2 py-1">
                    <Text className="text-xs text-emerald-400">Jij</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Join/Leave Button */}
      <Pressable
        onPress={handleJoinLeave}
        className={`items-center rounded-3xl px-6 py-4 active:opacity-80 ${
          isJoined ? 'bg-red-600' : 'bg-emerald-600'
        }`}
        accessibilityRole="button"
        accessibilityLabel={isJoined ? 'Leave event' : 'Join event'}>
        <Text className="text-lg font-semibold text-white">
          {isJoined ? 'Verlaat Evenement' : 'Doe Mee'}
        </Text>
      </Pressable>

      {/* Footer Info */}
      <View className="mt-6 rounded-2xl border border-gray-700 bg-gray-800 p-4">
        <Text className="text-center text-sm text-gray-400">
          {isOrganizer
            ? 'Als organisator kun je dit evenement beheren'
            : 'Neem deel aan dit evenement om op de hoogte te blijven'}
        </Text>
      </View>
    </ScrollView>
  );
}
