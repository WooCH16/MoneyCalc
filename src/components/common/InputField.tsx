import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  suffix?: string;
  keyboardType?: 'numeric' | 'default';
}

export function InputField({ label, value, onChangeText, placeholder, suffix, keyboardType = 'numeric' }: Props) {
  const handleChange = (text: string) => {
    // 숫자만 허용, 콤마 제거 후 전달
    const numeric = text.replace(/[^0-9]/g, '');
    onChangeText(numeric);
  };

  // 표시값: 콤마 포맷
  const displayValue = value ? parseInt(value, 10).toLocaleString('ko-KR') : '';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={displayValue}
          onChangeText={handleChange}
          placeholder={placeholder ?? '0'}
          placeholderTextColor="#aaa"
          keyboardType={keyboardType}
        />
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 14, color: '#555', marginBottom: 4 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#222',
  },
  suffix: { fontSize: 14, color: '#888', marginLeft: 4 },
});
