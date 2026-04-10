import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { useSalaryStore } from '../stores/useSalaryStore';
import { InputField } from '../components/common/InputField';
import { ResultCard } from '../components/common/ResultCard';
import { shareSalaryResult } from '../utils/shareResult';

export function CalculatorScreen() {
  const {
    input, result,
    setBaseSalary, setMealAllowance, setVehicleAllowance,
    setOtherAllowances, setDependents, calculate, reset,
  } = useSalaryStore();

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.screenTitle}>급여 계산기</Text>

      {/* 입력 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>급여 입력</Text>
        <InputField
          label="기본급"
          value={String(input.baseSalary || '')}
          onChangeText={(v) => setBaseSalary(Number(v))}
          suffix="원"
        />
        <InputField
          label="식대"
          value={String(input.mealAllowance || '')}
          onChangeText={(v) => setMealAllowance(Number(v))}
          suffix="원"
          placeholder="200,000 (20만 원 비과세)"
        />
        <InputField
          label="차량유지비"
          value={String(input.vehicleAllowance || '')}
          onChangeText={(v) => setVehicleAllowance(Number(v))}
          suffix="원"
          placeholder="200,000 (20만 원 비과세)"
        />
        <InputField
          label="기타 수당"
          value={String(input.otherAllowances || '')}
          onChangeText={(v) => setOtherAllowances(Number(v))}
          suffix="원"
        />
      </View>

      {/* 부양가족 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>부양가족 수 (본인 포함)</Text>
        <View style={styles.dependentRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.depBtn, input.dependents === n && styles.depBtnActive]}
              onPress={() => setDependents(n)}
            >
              <Text style={[styles.depBtnText, input.dependents === n && styles.depBtnTextActive]}>
                {n}인
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 계산 버튼 */}
      <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
        <Text style={styles.calcBtnText}>계산하기</Text>
      </TouchableOpacity>

      {/* 결과 */}
      {result && (
        <View style={styles.resultSection}>
          <ResultCard
            title="급여 요약"
            rows={[
              { label: '총 급여', amount: result.grossSalary },
              { label: '비과세', amount: result.nonTaxable },
              { label: '과세 급여', amount: result.taxableSalary },
            ]}
          />
          <ResultCard
            title="4대보험 공제"
            rows={[
              { label: '국민연금', amount: result.insurance.nationalPension, deduction: true },
              { label: '건강보험', amount: result.insurance.healthInsurance, deduction: true },
              { label: '장기요양보험', amount: result.insurance.longTermCare, deduction: true },
              { label: '고용보험', amount: result.insurance.employmentInsurance, deduction: true },
            ]}
            totalLabel="소계"
            totalAmount={result.insurance.total}
          />
          <ResultCard
            title="세금 공제"
            rows={[
              { label: '근로소득세', amount: result.tax.incomeTax, deduction: true },
              { label: '지방소득세', amount: result.tax.localIncomeTax, deduction: true },
            ]}
            totalLabel="소계"
            totalAmount={result.tax.total}
          />
          <ResultCard
            title="최종 실수령액"
            rows={[
              { label: '총 급여', amount: result.grossSalary },
              { label: '총 공제액', amount: result.totalDeduction, deduction: true },
            ]}
            totalLabel="실수령액"
            totalAmount={result.netSalary}
          />

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.shareBtn} onPress={() => shareSalaryResult(result)}>
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
  screenTitle: { fontSize: 22, fontWeight: '700', color: '#222', padding: 20, paddingBottom: 8 },
  section: {
    backgroundColor: '#fff', margin: 12, marginBottom: 0,
    borderRadius: 12, padding: 16,
  },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#444', marginBottom: 12 },
  dependentRow: { flexDirection: 'row', gap: 8 },
  depBtn: {
    flex: 1, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#ddd',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa',
  },
  depBtnActive: { backgroundColor: '#1a73e8', borderColor: '#1a73e8' },
  depBtnText: { fontSize: 14, color: '#666' },
  depBtnTextActive: { color: '#fff', fontWeight: '600' },
  calcBtn: {
    margin: 12, height: 52, backgroundColor: '#1a73e8',
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  calcBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  resultSection: { paddingHorizontal: 12, paddingBottom: 32 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
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
