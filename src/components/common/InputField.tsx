import React, { useState } from 'react';
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
  const [focused, setFocused] = useState(false);

  const handleChange = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, '');
    onChangeText(numeric);
  };

  const numericVal = parseInt(value, 10);
  const displayValue = value && !isNaN(numericVal) ? numericVal.toLocaleString('ko-KR') : '';

  return (
    <View style={styles.container}>
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
      <View style={[styles.inputRow, focused && styles.inputRowFocused]}>
        <TextInput
          style={styles.input}
          value={displayValue}
          onChangeText={handleChange}
          placeholder={placeholder ?? '0'}
          placeholderTextColor="#aaa"
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 14, color: '#555', marginBottom: 4 },
  labelFocused: { color: '#1a73e8' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
  },
  inputRowFocused: {
    borderColor: '#1a73e8',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#222',
  },
  suffix: { fontSize: 14, color: '#888', marginLeft: 4 },
});
