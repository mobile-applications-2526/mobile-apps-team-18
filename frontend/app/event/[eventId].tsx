import React from 'react';
import { useLocalSearchParams } from 'expo-router';

import { SafeAreaView } from 'react-native-safe-area-context';
import EventOverviewScreen from '../../screens/events/EventOverviewScreen';
import { Text } from 'react-native';

export default function EventDetailScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {eventId != null ? (
        <EventOverviewScreen eventId={eventId as unknown as number} />
      ) : (
        <Text className="text-lg text-white">Invalid event ID</Text>
      )}
    </SafeAreaView>
  );
}
