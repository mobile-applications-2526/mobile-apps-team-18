import { View, Text } from "react-native";
import { Task } from "../types";



type Props = {
  tasks?: Task[];
};

export const TaskHighlights = ({ tasks }: Props) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const todayStr = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  })();

  const upcoming = tasks ? tasks?.filter((t) => t.dueDate >= todayStr).sort((a, b) => a.dueDate.localeCompare(b.dueDate)) : [];

  const upcomingCount = upcoming.length;
  const next = upcoming[0];

  return (
    <View className="flex-1 rounded-2xl bg-emerald-50 p-4">
      <Text className="text-emerald-600">Tasks</Text>
      <Text className="mt-1 text-2xl font-bold text-emerald-800">{upcomingCount} upcoming</Text>
      <Text className="mt-1 text-emerald-700">
        {next ? `Next: ${next.name} • ${next.dueDate}` : "No upcoming tasks"}
      </Text>
    </View>
  );
};
