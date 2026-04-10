import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const MENU_ITEMS = [
  { key: 'Calculator', label: '급여 계산기', icon: '💰', desc: '4대보험·소득세 자동계산' },
  { key: 'Schedule', label: '근무 달력', icon: '📅', desc: '출퇴근 일정 관리' },
  { key: 'Unemployment', label: '실업급여', icon: '📋', desc: '구직급여 실시간 계산' },
  { key: 'Severance', label: '퇴직금', icon: '🏦', desc: '법정 퇴직금 계산' },
  { key: 'YearEndTax', label: '연말정산', icon: '📊', desc: '환급·추납 예상액' },
  { key: 'Settings', label: '설정', icon: '⚙️', desc: '시간제·시급 설정' },
];

interface Props {
  onNavigate?: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: Props) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MoneyCalc</Text>
        <Text style={styles.subtitle}>급여 자동 계산기</Text>
      </View>
      <View style={styles.grid}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.card}
            onPress={() => onNavigate?.(item.key)}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.cardLabel}>{item.label}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fa' },
  header: {
    backgroundColor: '#1a73e8', padding: 28, paddingTop: 48,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    padding: 12, gap: 12,
  },
  card: {
    width: '47%', backgroundColor: '#fff', borderRadius: 14,
    padding: 18, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  icon: { fontSize: 32, marginBottom: 8 },
  cardLabel: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#888', textAlign: 'center' },
});
