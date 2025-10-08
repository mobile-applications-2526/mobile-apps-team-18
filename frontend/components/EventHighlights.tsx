import { View, Text } from "react-native";
import { Event } from "../types";



type Props = {
  events?: Event[];
};

export const EventHighlights = ({ events }: Props) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const todayStr = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  })();

  const upcoming = events ? events?.filter((e) => e.eventDate >= todayStr).sort((a, b) => a.eventDate.localeCompare(b.eventDate)) : [];

  const upcomingCount = upcoming.length;
  const next = upcoming[0];

  return (
    <View className="flex-1 rounded-2xl bg-indigo-50 p-4">
      <Text className="text-indigo-600">Events</Text>
      <Text className="mt-1 text-2xl font-bold text-indigo-800">{upcomingCount} upcoming</Text>
      <Text className="mt-1 text-indigo-700">
        {next ? `Next: ${next.name} • ${next.eventDate}` : "No upcoming events"}
      </Text>
    </View>
  );
};
