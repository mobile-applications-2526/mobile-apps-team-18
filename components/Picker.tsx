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
  const isEmpty = value === undefined || value === null || value === '';

  return (
    <View className="mb-2 overflow-hidden rounded-2xl border border-gray-700 bg-gray-800">
      <View className="p-3">
        <View className="mb-2 flex-row items-center">
          <View
            className={`mr-3 h-9 w-9 items-center justify-center rounded-lg ${
              isEmpty ? 'bg-gray-700' : 'bg-emerald-600/20'
            }`}>
            <Icon color={isEmpty ? '#9CA3AF' : '#10B981'} size={18} />
          </View>

          <Text className="flex-1 text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </Text>
        </View>

        <Pressable
          onPress={() => pickerRef.current?.togglePicker(true)}
          className="rounded-lg border border-gray-600 bg-gray-900 px-3 py-2.5">
          <Text className={`text-base ${value ? 'text-white' : 'text-gray-400'}`}>
            {displayValue}
          </Text>
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
    </View>
  );
}
