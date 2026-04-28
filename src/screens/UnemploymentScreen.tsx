import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useUnemploymentStore } from '../stores/useUnemploymentStore';
import { InputField } from '../components/common/InputField';
import { ResultCard } from '../components/common/ResultCard';
import { formatCurrency } from '../utils/formatters';
import { shareUnemploymentResult } from '../utils/shareResult';

export function UnemploymentScreen() {
  const { input, result, setAvgDailySalary, setAge, setInsuredMonths, calculate, reset } =
    useUnemploymentStore();

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>실업급여 계산기</Text>
      <Text style={styles.desc}>구직급여(실업급여) 예상 수령액을 계산합니다.</Text>

      <View style={styles.section}>
        <InputField
          label="이직 전 3개월 평균 일급"
          value={String(input.avgDailySalary || '')}
          onChangeText={(v) => setAvgDailySalary(Number(v))}
          suffix="원"
          placeholder="월급 ÷ 30일로 계산"
        />
        <InputField
          label="나이"
          value={String(input.age || '')}
          onChangeText={(v) => setAge(Number(v))}
          suffix="세"
          placeholder="만 나이"
        />
        <InputField
          label="고용보험 가입 기간"
          value={String(input.insuredMonths || '')}
          onChangeText={(v) => setInsuredMonths(Number(v))}
          suffix="개월"
          placeholder="예) 24 (2년)"
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 상한액 66,000원/일 · 하한액 최저임금(10,030원) × 80% × 8시간 = 64,192원/일 (2025년)
        </Text>
      </View>

      <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
        <Text style={styles.calcBtnText}>계산하기</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultSection}>
          <ResultCard
            title="구직급여 계산 결과"
            rows={[
              { label: '구직급여 일액', amount: result.dailyBenefit, highlight: true },
              { label: '소정급여일수', amount: result.benefitDays },
            ]}
          />
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>예상 총 수령액</Text>
            <Text style={styles.totalAmount}>{formatCurrency(result.totalBenefit)}원</Text>
          </View>

          <View style={styles.tableBox}>
            <Text style={styles.tableTitle}>소정급여일수 기준표</Text>
            <Text style={styles.tableText}>{'50세 미만\n• 1년 미만: 120일\n• 1~3년: 150일\n• 3~5년: 180일\n• 5~10년: 210일\n• 10년 이상: 240일'}</Text>
            <Text style={[styles.tableText, { marginTop: 8 }]}>{'50세 이상 / 장애인\n• 1년 미만: 120일\n• 1~3년: 180일\n• 3~5년: 210일\n• 5~10년: 240일\n• 10년 이상: 270일'}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.shareBtn} onPress={() => shareUnemploymentResult(result)}>
              <Text style={styles.shareBtnText}>공유</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetBtn} onPress={reset}>
              <Text style={styles.resetBtnText}>초기화</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fa' },
  title: { fontSize: 22, fontWeight: '700', color: '#222', padding: 20, paddingBottom: 4 },
  desc: { fontSize: 13, color: '#888', paddingHorizontal: 20, marginBottom: 8 },
  section: { backgroundColor: '#fff', margin: 12, marginBottom: 0, borderRadius: 12, padding: 16 },
  infoBox: {
    marginHorizontal: 12, marginTop: 8, backgroundColor: '#fff9e6',
    borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: '#f59e0b',
  },
  infoText: { fontSize: 12, color: '#92400e', lineHeight: 18 },
  calcBtn: {
    margin: 12, height: 52, backgroundColor: '#1a73e8',
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  calcBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  resultSection: { paddingHorizontal: 12, paddingBottom: 32 },
  totalBox: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#333' },
  totalAmount: { fontSize: 20, fontWeight: '800', color: '#1a73e8' },
  tableBox: { backgroundColor: '#f8faff', borderRadius: 12, padding: 14, marginBottom: 12 },
  tableTitle: { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 8 },
  tableText: { fontSize: 12, color: '#555', lineHeight: 20 },
  actionRow: { flexDirection: 'row', gap: 8 },
  shareBtn: {
    flex: 1, height: 44, borderRadius: 10, backgroundColor: '#1a73e8',
    alignItems: 'center', justifyContent: 'center',
  },
  shareBtnText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  resetBtn: {
    flex: 1, height: 44, borderRadius: 10, borderWidth: 1, borderColor: '#ddd',
    alignItems: 'center', justifyContent: 'center',
  },
  resetBtnText: { fontSize: 14, color: '#888' },
});
