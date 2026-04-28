import React, { useMemo, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useScheduleStore } from '../stores/useScheduleStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { calcMonthSchedule } from '../utils/scheduleCalc';
import { calcSalary } from '../utils/salaryCalc';
import { DayCell } from '../components/schedule/DayCell';
import { formatCurrency, formatMinutes } from '../utils/formatters';
import { shareScheduleResult } from '../utils/shareResult';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

interface Props {
  onDayPress?: (date: string) => void;
}

export function ScheduleScreen({ onDayPress }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const { getMonthSchedule } = useScheduleStore();
  const { use24Hour, hourlyWage, dailyWorkHours, weeklyWorkHours } = useSettingsStore();

  const yearMonth = `${year}-${String(month + 1).padStart(2, '0')}`;
  const schedule = getMonthSchedule(yearMonth);

  const result = useMemo(
    () => calcMonthSchedule(schedule, hourlyWage, dailyWorkHours, weeklyWorkHours),
    [schedule, hourlyWage, dailyWorkHours, weeklyWorkHours],
  );

  // 실수령액: 스케줄 급여로 급여 계산
  const salaryResult = useMemo(() => calcSalary({
    baseSalary: result.grossWage,
    mealAllowance: 0,
    vehicleAllowance: 0,
    otherAllowances: 0,
    dependents: 1,
  }), [result.grossWage]);

  // 달력 그리드 생성
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1 < 0 ? 11 : month - 1);

  const cells: { date: string; day: number; dayOfWeek: number; isCurrentMonth: boolean }[] = [];

  // 이전 달 빈 칸
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = month - 1 < 0 ? 11 : month - 1;
    const y = month - 1 < 0 ? year - 1 : year;
    cells.push({
      date: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      day: d, dayOfWeek: (firstDay - 1 - i + 7) % 7 === 0 ? 0 : (firstDay - 1 - i),
      isCurrentMonth: false,
    });
  }

  // 이번 달
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = (firstDay + d - 1) % 7;
    cells.push({
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      day: d, dayOfWeek: dow, isCurrentMonth: true,
    });
  }

  // 다음 달 빈 칸 (6주 고정)
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month + 1 > 11 ? 0 : month + 1;
    const y = month + 1 > 11 ? year + 1 : year;
    cells.push({
      date: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      day: d, dayOfWeek: (firstDay + daysInMonth + d - 1) % 7,
      isCurrentMonth: false,
    });
  }

  const todayStr = today.toISOString().slice(0, 10);
  const weeks = Array.from({ length: 6 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  const prevMonth = useCallback(() => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }, [month]);

  const nextMonth = useCallback(() => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }, [month]);

  const handleDayPress = useCallback((date: string) => {
    onDayPress?.(date);
  }, [onDayPress]);

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={prevMonth} style={styles.arrowBtn}>
          <Text style={styles.arrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{year}년 {month + 1}월</Text>
        <TouchableOpacity onPress={nextMonth} style={styles.arrowBtn}>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 요일 헤더 */}
      <View style={styles.weekHeader}>
        {WEEKDAY_LABELS.map((label, i) => (
          <Text key={i} style={[
            styles.weekLabel,
            i === 0 && styles.sundayLabel,
            i === 6 && styles.saturdayLabel,
          ]}>{label}</Text>
        ))}
      </View>

      {/* 달력 */}
      <View style={styles.calendar}>
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.week}>
            {week.map((cell) => (
              <DayCell
                key={cell.date}
                date={cell.date}
                day={cell.day}
                dayOfWeek={cell.dayOfWeek}
                work={schedule[cell.date]}
                isToday={cell.date === todayStr}
                isCurrentMonth={cell.isCurrentMonth}
                use24Hour={use24Hour}
                onPress={handleDayPress}
              />
            ))}
          </View>
        ))}
      </View>

      {/* 빈 달력 안내 */}
      {Object.keys(schedule).length === 0 && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>날짜를 탭하여 근무 일정을 입력하세요</Text>
          <Text style={styles.emptyHint}>출퇴근 시간, 연차, 조퇴를 기록하면{'\n'}자동으로 급여를 계산합니다</Text>
        </View>
      )}

      {/* 월 요약 */}
      {Object.keys(schedule).length > 0 && (
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>{month + 1}월 근무 요약</Text>
          <View style={styles.summaryGrid}>
            <SummaryItem label="총 근무" value={formatMinutes(result.totalMinutes)} />
            <SummaryItem label="연장근로" value={formatMinutes(result.overtimeMinutes)} accent />
            <SummaryItem label="야간근로" value={formatMinutes(result.nightMinutes)} accent />
            <SummaryItem label="주휴수당" value={`${result.holidayPayDays}주`} />
            <SummaryItem label="연차" value={`${result.annualLeaveDays}일`} />
            <SummaryItem label="예상 급여" value={`${formatCurrency(result.grossWage)}원`} highlight />
          </View>
          <View style={styles.netRow}>
            <Text style={styles.netLabel}>예상 실수령액</Text>
            <Text style={styles.netAmount}>{formatCurrency(salaryResult.netSalary)}원</Text>
          </View>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={() => shareScheduleResult(yearMonth, result, salaryResult.netSalary)}
          >
            <Text style={styles.shareBtnText}>공유</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function SummaryItem({ label, value, accent, highlight }: {
  label: string; value: string; accent?: boolean; highlight?: boolean;
}) {
  return (
    <View style={summaryStyles.item}>
      <Text style={summaryStyles.label}>{label}</Text>
      <Text style={[
        summaryStyles.value,
        accent && summaryStyles.accent,
        highlight && summaryStyles.highlight,
      ]}>{value}</Text>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  item: { width: '33%', alignItems: 'center', marginBottom: 12 },
  label: { fontSize: 11, color: '#888', marginBottom: 2 },
  value: { fontSize: 14, fontWeight: '600', color: '#333' },
  accent: { color: '#f59e0b' },
  highlight: { color: '#1a73e8', fontSize: 15 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fa' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff',
  },
  arrowBtn: { padding: 8 },
  arrow: { fontSize: 24, color: '#1a73e8', fontWeight: '300' },
  monthTitle: { fontSize: 18, fontWeight: '700', color: '#222' },
  weekHeader: {
    flexDirection: 'row', backgroundColor: '#fff',
    paddingHorizontal: 8, paddingBottom: 8,
  },
  weekLabel: {
    flex: 1, textAlign: 'center', fontSize: 12,
    fontWeight: '600', color: '#666',
  },
  sundayLabel: { color: '#ef4444' },
  saturdayLabel: { color: '#3b82f6' },
  calendar: { backgroundColor: '#fff', paddingHorizontal: 4, paddingBottom: 8 },
  week: { flexDirection: 'row' },
  summary: {
    margin: 12, backgroundColor: '#fff',
    borderRadius: 14, padding: 16,
  },
  summaryTitle: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 12 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  netRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#eee',
  },
  netLabel: { fontSize: 15, fontWeight: '700', color: '#333' },
  netAmount: { fontSize: 17, fontWeight: '800', color: '#1a73e8' },
  shareBtn: {
    marginTop: 12, height: 44, borderRadius: 10, backgroundColor: '#1a73e8',
    alignItems: 'center', justifyContent: 'center',
  },
  shareBtnText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  emptyBox: {
    alignItems: 'center', padding: 32, margin: 12,
    backgroundColor: '#fff', borderRadius: 14,
  },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 15, fontWeight: '600', color: '#444', marginBottom: 6 },
  emptyHint: { fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 20 },
});
