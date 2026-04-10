import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import { useYearEndStore } from '../stores/useYearEndStore';
import { InputField } from '../components/common/InputField';
import { ResultCard } from '../components/common/ResultCard';
import { formatCurrency } from '../utils/formatters';

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월'];

export function YearEndTaxScreen() {
  const {
    input, result,
    setMonthlyData, setDependents, setDisabledCount, setSeniorCount,
    setSingleParent, setCreditCardTotal, setMedicalExpense, setEducationExpense,
    setDonationExpense, setPensionSaving, setHousingFund, calculate, reset,
  } = useYearEndStore();

  const [tab, setTab] = useState<'monthly' | 'deduction'>('monthly');

  const isRefund = result ? result.refundOrPay >= 0 : null;

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>연말정산 예상 계산기</Text>
      <Text style={styles.desc}>월별 급여와 공제 항목을 입력하면 환급/추납 예상액을 계산합니다.</Text>

      {/* 탭 */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'monthly' && styles.tabActive]}
          onPress={() => setTab('monthly')}
        >
          <Text style={[styles.tabText, tab === 'monthly' && styles.tabTextActive]}>월별 급여</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'deduction' && styles.tabActive]}
          onPress={() => setTab('deduction')}
        >
          <Text style={[styles.tabText, tab === 'deduction' && styles.tabTextActive]}>공제 항목</Text>
        </TouchableOpacity>
      </View>

      {tab === 'monthly' && (
        <View style={styles.section}>
          <Text style={styles.hint}>각 월의 총급여(세전)와 납부세액을 입력하세요.</Text>
          {MONTHS.map((label, i) => (
            <View key={i} style={styles.monthRow}>
              <Text style={styles.monthLabel}>{label}</Text>
              <View style={styles.monthInputs}>
                <View style={styles.monthField}>
                  <InputField
                    label="총급여"
                    value={String(input.monthlyNetSalaries[i] || '')}
                    onChangeText={(v) => setMonthlyData(i, Number(v), input.monthlyTaxPaid[i])}
                    suffix="원"
                    placeholder="0"
                  />
                </View>
                <View style={styles.monthField}>
                  <InputField
                    label="납부세액"
                    value={String(input.monthlyTaxPaid[i] || '')}
                    onChangeText={(v) => setMonthlyData(i, input.monthlyNetSalaries[i], Number(v))}
                    suffix="원"
                    placeholder="0"
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {tab === 'deduction' && (
        <View style={styles.section}>
          {/* 인적공제 */}
          <Text style={styles.subTitle}>인적공제</Text>
          <View style={styles.row3}>
            <View style={styles.flex1}>
              <InputField label="부양가족(본인포함)" value={String(input.dependents)}
                onChangeText={(v) => setDependents(Number(v))} suffix="명" />
            </View>
            <View style={styles.flex1}>
              <InputField label="장애인" value={String(input.disabledCount || '')}
                onChangeText={(v) => setDisabledCount(Number(v))} suffix="명" />
            </View>
            <View style={styles.flex1}>
              <InputField label="경로우대(70세+)" value={String(input.seniorCount || '')}
                onChangeText={(v) => setSeniorCount(Number(v))} suffix="명" />
            </View>
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>한부모 공제 (100만 원)</Text>
            <Switch
              value={input.singleParent}
              onValueChange={setSingleParent}
              trackColor={{ false: '#ccc', true: '#1a73e8' }}
              thumbColor="#fff"
            />
          </View>

          {/* 소득·세액공제 */}
          <Text style={[styles.subTitle, { marginTop: 16 }]}>소득공제 / 세액공제</Text>
          <InputField label="신용카드 등 사용액 합계" value={String(input.creditCardTotal || '')}
            onChangeText={(v) => setCreditCardTotal(Number(v))} suffix="원" />
          <InputField label="의료비" value={String(input.medicalExpense || '')}
            onChangeText={(v) => setMedicalExpense(Number(v))} suffix="원" />
          <InputField label="교육비" value={String(input.educationExpense || '')}
            onChangeText={(v) => setEducationExpense(Number(v))} suffix="원" />
          <InputField label="기부금" value={String(input.donationExpense || '')}
            onChangeText={(v) => setDonationExpense(Number(v))} suffix="원" />
          <InputField label="연금저축 납입액" value={String(input.pensionSaving || '')}
            onChangeText={(v) => setPensionSaving(Number(v))} suffix="원" placeholder="한도 600만 원" />
          <InputField label="주택청약저축 납입액" value={String(input.housingFund || '')}
            onChangeText={(v) => setHousingFund(Number(v))} suffix="원" placeholder="한도 400만 원" />
        </View>
      )}

      <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
        <Text style={styles.calcBtnText}>연말정산 예상 계산</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultSection}>
          {/* 환급/추납 배너 */}
          <View style={[styles.banner, isRefund ? styles.bannerRefund : styles.bannerPay]}>
            <Text style={styles.bannerLabel}>
              {isRefund ? '예상 환급액' : '예상 추가납부액'}
            </Text>
            <Text style={[styles.bannerAmount, isRefund ? styles.refundAmt : styles.payAmt]}>
              {isRefund ? '+' : '-'}{formatCurrency(Math.abs(result.refundOrPay))}원
            </Text>
          </View>

          <ResultCard
            title="소득 계산"
            rows={[
              { label: '연간 총급여', amount: result.annualGrossSalary },
              { label: '근로소득공제', amount: result.laborIncomeDeduction, deduction: true },
              { label: '근로소득금액', amount: result.laborIncome, highlight: true },
            ]}
          />
          <ResultCard
            title="공제 합계"
            rows={[
              { label: '인적공제', amount: result.personalDeduction, deduction: true },
              { label: '특별소득공제', amount: result.specialDeduction, deduction: true },
              { label: '기타공제', amount: result.otherDeduction, deduction: true },
            ]}
            totalLabel="과세표준"
            totalAmount={result.taxableIncome}
          />
          <ResultCard
            title="세액 계산"
            rows={[
              { label: '산출세액', amount: result.calculatedTax },
              { label: '세액공제', amount: result.taxCredit, deduction: true },
              { label: '결정세액(지방세 포함)', amount: result.finalTax, highlight: true },
              { label: '기납부세액', amount: result.totalPaidTax, deduction: true },
            ]}
          />

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
  tabRow: {
    flexDirection: 'row', marginHorizontal: 12, marginBottom: 4,
    backgroundColor: '#e8eaf6', borderRadius: 10, padding: 3,
  },
  tab: { flex: 1, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 },
  tabText: { fontSize: 14, color: '#888' },
  tabTextActive: { color: '#1a73e8', fontWeight: '700' },
  section: { backgroundColor: '#fff', margin: 12, marginBottom: 0, borderRadius: 12, padding: 16 },
  hint: { fontSize: 12, color: '#888', marginBottom: 12 },
  monthRow: { marginBottom: 8 },
  monthLabel: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 4 },
  monthInputs: { flexDirection: 'row', gap: 8 },
  monthField: { flex: 1 },
  subTitle: { fontSize: 14, fontWeight: '700', color: '#444', marginBottom: 10 },
  row3: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  flex1: { flex: 1 },
  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8,
  },
  toggleLabel: { fontSize: 14, color: '#444' },
  calcBtn: {
    margin: 12, height: 52, backgroundColor: '#1a73e8',
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  calcBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  resultSection: { paddingHorizontal: 12, paddingBottom: 32 },
  banner: {
    borderRadius: 14, padding: 20, marginBottom: 12,
    alignItems: 'center',
  },
  bannerRefund: { backgroundColor: '#e8f5e9' },
  bannerPay: { backgroundColor: '#fce4ec' },
  bannerLabel: { fontSize: 14, color: '#555', marginBottom: 6 },
  bannerAmount: { fontSize: 28, fontWeight: '800' },
  refundAmt: { color: '#2e7d32' },
  payAmt: { color: '#c62828' },
  resetBtn: {
    height: 44, borderRadius: 10, borderWidth: 1, borderColor: '#ddd',
    alignItems: 'center', justifyContent: 'center', marginTop: 4,
  },
  resetBtnText: { fontSize: 14, color: '#888' },
});
