import { View, Text, TextInput, TextInputProps } from 'react-native';

type Props = {
  label: string;
  className?: string;
} & TextInputProps;

export default function CustomInput({ label, className, ...props }: Props) {
  return (
    <View className={className}>
      <Text className="mb-2 text-sm font-medium text-white">{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor="#9CA3AF"
        className="rounded-2xl border border-gray-300 px-4 py-3 text-base text-white"
      />
    </View>
  );
}
