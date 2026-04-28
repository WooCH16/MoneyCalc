import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  title: string;
  onBack?: () => void;
  rightAction?: { label: string; onPress: () => void };
}

export function ScreenHeader({ title, onBack, rightAction }: Props) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.leftBtn}>
            <Text style={styles.backText}>‹ 뒤로</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.leftBtn} />
        )}
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {rightAction ? (
          <TouchableOpacity onPress={rightAction.onPress} style={styles.rightBtn}>
            <Text style={styles.rightText}>{rightAction.label}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.rightBtn} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  leftBtn: { width: 64 },
  rightBtn: { width: 64, alignItems: 'flex-end' },
  title: { flex: 1, fontSize: 17, fontWeight: '700', color: '#222', textAlign: 'center' },
  backText: { fontSize: 15, color: '#1a73e8' },
  rightText: { fontSize: 15, color: '#1a73e8', fontWeight: '600' },
});
