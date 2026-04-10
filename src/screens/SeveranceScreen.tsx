import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal,
} from 'react-native';
import { useSeveranceStore } from '../stores/useSeveranceStore';
import { InputField } from '../components/common/InputField';
import { ResultCard } from '../components/common/ResultCard';
import { formatCurrency, formatDate } from '../utils/formatters';

// 간단한 날짜 선택기 (연/월/일 슬라이더 대신 텍스트 입력)
function DateInput({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  const [y, m, d] = value ? value.split('-') : ['', '', ''];

  function update(part: 'y' | 'm' | 'd', val: string) {
    const ny = part === 'y' ? val.padStart(4, '0').slice(-4) : (y || '2020');
    const nm = part === 'm' ? val.padStart(2, '0').slice(-2) : (m || '01');
    const nd = part === 'd' ? val.padStart(2, '0').slice(-2) : (d || '01');
    onChange(`${ny}-${nm}-${nd}`);
  }

  return (
    <View style={dateStyles.container}>
      <Text style={dateStyles.label}>{label}</Text>
      <View style={dateStyles.row}>
        <View style={dateStyles.part}>
          <InputField label="년" value={y} onChangeText={(v) => update('y', v)} placeholder="2020" />
        </View>
        <View style={dateStyles.part}>
          <InputField label="월" value={m} onChangeText={(v) => update('m', v)} placeholder="01" />
        </View>
        <View style={dateStyles.part}>
          <InputField label="일" value={d} onChangeText={(v) => update('d', v)} placeholder="01" />
        </View>
      </View>
    </View>
  );
}

const dateStyles = StyleSheet.create({
  container: { marginBottom: 4 },
  label: { fontSize: 14, color: '#555', marginBottom: 4 },
  row: { flexDirection: 'row', gap: 8 },
  part: { flex: 1 },
});

export function SeveranceScreen() {
  const { input, result, setJoinDate, setLeaveDate,
    setLastThreeMonthSalary, setLastThreeMonthDays, calculate, reset,
  } = useSeveranceStore();

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>퇴직금 계산기</Text>
      <Text style={styles.desc}>법정 퇴직금을 계산합니다. (계속 근로 1년 이상)</Text>

      <View style={styles.section}>
        <DateInput label="입사일" value={input.joinDate} onChange={setJoinDate} />
        <DateInput label="퇴사일" value={input.leaveDate} onChange={setLeaveDate} />
        <InputField
          label="최근 3개월 총 임금"
          value={String(input.lastThreeMonthSalary || '')}
          onChangeText={(v) => setLastThreeMonthSalary(Number(v))}
          suffix="원"
          placeholder="세전 총 지급액"
        />
        <InputField
          label="최근 3개월 총 일수"
          value={String(input.lastThreeMonthDays || '')}
          onChangeText={(v) => setLastThreeMonthDays(Number(v))}
          suffix="일"
          placeholder="89~92일 (월 일수 합산)"
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 퇴직금 = 평균임금 × 30일 × (재직일수 ÷ 365){'\n'}
          평균임금 = 최근 3개월 총 임금 ÷ 최근 3개월 총 일수
        </Text>
      </View>

      <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
        <Text style={styles.calcBtnText}>계산하기</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultSection}>
          {result.severancePay === 0 ? (
            <View style={styles.noPayBox}>
              <Text style={styles.noPayText}>
                재직기간이 1년 미만이거나 날짜를 확인해주세요.{'\n'}
                ({result.workingDays}일 근무)
              </Text>
            </View>
          ) : (
            <>
              <ResultCard
                title="퇴직금 계산 결과"
                rows={[
                  { label: '재직일수', amount: result.workingDays },
                  { label: '평균임금 (일)', amount: result.avgDailySalary },
                ]}
              />
              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>예상 퇴직금</Text>
                <Text style={styles.totalAmount}>{formatCurrency(result.severancePay)}원</Text>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.resetBtn} onPress={reset}>
            <Text style={styles.resetBtnText}>초기화</Text>
          </TouchableOpacity>
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
    marginHorizontal: 12, marginTop: 8, backgroundColor: '#f0fdf4',
    borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: '#10b981',
  },
  infoText: { fontSize: 12, color: '#065f46', lineHeight: 18 },
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
  noPayBox: {
    backgroundColor: '#fff3cd', borderRadius: 12, padding: 16, marginBottom: 12,
  },
  noPayText: { fontSize: 14, color: '#856404', lineHeight: 22, textAlign: 'center' },
  resetBtn: {
    height: 44, borderRadius: 10, borderWidth: 1, borderColor: '#ddd',
    alignItems: 'center', justifyContent: 'center',
  },
  resetBtnText: { fontSize: 14, color: '#888' },
});
