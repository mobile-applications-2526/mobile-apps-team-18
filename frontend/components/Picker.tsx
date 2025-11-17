import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { View, Text, Platform, Pressable } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

interface PickerItem {
  label: string;
  value: any;
}

interface Props {
  icon: LucideIcon;
  label: string;
  value: any;
  onChange: (value: any) => void;
  items: PickerItem[];
  placeholder?: string;
}

export default function Picker({
  icon: Icon,
  label,
  value,
  onChange,
  items,
  placeholder = 'Select...',
}: Props) {
  const pickerRef = React.useRef<any>(null);
  const displayValue =
    value !== undefined ? items.find((item) => item.value === value)?.label : placeholder;

  return (
    <View className="mb-3">
      <Text className="mb-1 text-xs font-medium uppercase text-gray-400">{label}</Text>

      <Pressable
        onPress={() => pickerRef.current?.togglePicker(true)}
        className={
          'flex-row items-center justify-between rounded-lg border border-gray-700 bg-gray-800 p-2.5'
        }>
        <Text className={`text-base', ${value ? 'text-white' : 'text-gray-400'}`}>
          {displayValue}
        </Text>
        <Icon size={20} color="#4B5563" />
      </Pressable>

      <View className="h-0 overflow-hidden">
        <RNPickerSelect
          ref={pickerRef}
          onValueChange={onChange}
          items={items}
          value={value}
          placeholder={{ label: placeholder, value: undefined, color: '#6B7280' }}
          style={{
            inputIOS: {
              fontSize: 16,
              color: '#FFFFFF',
              paddingVertical: 10,
              paddingHorizontal: 12,
              paddingRight: 36,
              borderWidth: 1,
              borderColor: '#374151',
              borderRadius: 8,
              backgroundColor: '#1F2937',
            },
            inputAndroid: {
              fontSize: 16,
              color: '#FFFFFF',
              paddingVertical: 10,
              paddingHorizontal: 12,
              paddingRight: 36,
              borderWidth: 1,
              borderColor: '#374151',
              borderRadius: 8,
              backgroundColor: '#1F2937',
            },
            placeholder: { color: '#6B7280' },
            iconContainer: { top: Platform.OS === 'ios' ? 12 : 10, right: 12 },
          }}
          useNativeAndroidPickerStyle={false}
          pickerProps={{
            style: {
              backgroundColor: '#1F2937',
              fontSize: 18,
            },
          }}
        />
      </View>
    </View>
  );
}
