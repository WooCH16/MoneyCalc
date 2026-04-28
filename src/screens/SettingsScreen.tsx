import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useSettingsStore } from '../stores/useSettingsStore';
import { InputField } from '../components/common/InputField';

export function SettingsScreen() {
  const { use24Hour, hourlyWage, dailyWorkHours, weeklyWorkHours,
    setUse24Hour, setHourlyWage, setDailyWorkHours, setWeeklyWorkHours,
  } = useSettingsStore();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>설정</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>시간 표시 형식</Text>
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>
              {use24Hour ? '24시간제' : '12시간제 (AM/PM)'}
            </Text>
            <Text style={styles.toggleDesc}>
              {use24Hour ? '예) 09:00 ~ 22:30' : '예) 오전 9:00 ~ 오후 10:30'}
            </Text>
          </View>
          <Switch
            value={use24Hour}
            onValueChange={setUse24Hour}
            trackColor={{ false: '#ccc', true: '#1a73e8' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>근무 기준</Text>
        <InputField
          label="시급"
          value={String(hourlyWage || '')}
          onChangeText={(v) => setHourlyWage(Number(v))}
          suffix="원"
          placeholder="10,030 (2025년 최저임금)"
        />
        <InputField
          label="일 소정근로시간"
          value={String(dailyWorkHours || '')}
          onChangeText={(v) => setDailyWorkHours(Number(v))}
          suffix="시간"
          placeholder="8"
        />
        <InputField
          label="주 소정근로시간"
          value={String(weeklyWorkHours || '')}
          onChangeText={(v) => setWeeklyWorkHours(Number(v))}
          suffix="시간"
          placeholder="40"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fa' },
  screenTitle: { fontSize: 22, fontWeight: '700', color: '#222', padding: 20, paddingBottom: 8 },
  section: {
    backgroundColor: '#fff', margin: 12, marginBottom: 0,
    borderRadius: 12, padding: 16,
  },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#444', marginBottom: 12 },
  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  toggleLabel: { fontSize: 15, color: '#222', fontWeight: '500' },
  toggleDesc: { fontSize: 12, color: '#888', marginTop: 2 },
});
