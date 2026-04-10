import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Modal, FlatList,
} from 'react-native';
import { useScheduleStore } from '../stores/useScheduleStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { DayWork, WorkType } from '../utils/types';
import { formatDate, formatTime } from '../utils/formatters';
import { analyzeDayWork } from '../utils/scheduleCalc';

const WORK_TYPES: { value: WorkType; label: string; color: string }[] = [
  { value: 'normal',       label: '정상 근무', color: '#1a73e8' },
  { value: 'early_leave',  label: '조퇴',      color: '#f59e0b' },
  { value: 'annual_leave', label: '연차',      color: '#10b981' },
  { value: 'holiday',      label: '휴일 근무', color: '#ef4444' },
  { value: 'off',          label: '휴무',      color: '#9ca3af' },
];

// 시간 선택 옵션 생성 (30분 단위)
function genTimeOptions(use24h: boolean): string[] {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const hhmm = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      times.push(hhmm);
    }
  }
  return times;
}

interface TimePickerProps {
  visible: boolean;
  value: string;
  use24h: boolean;
  onSelect: (time: string) => void;
  onClose: () => void;
}

function TimePicker({ visible, value, use24h, onSelect, onClose }: TimePickerProps) {
  const times = genTimeOptions(use24h);
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={tpStyles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={tpStyles.sheet}>
          <View style={tpStyles.header}>
            <Text style={tpStyles.title}>시간 선택</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={tpStyles.close}>완료</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={times}
            keyExtractor={(t) => t}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[tpStyles.timeItem, item === value && tpStyles.selectedItem]}
                onPress={() => { onSelect(item); onClose(); }}
              >
                <Text style={[tpStyles.timeText, item === value && tpStyles.selectedText]}>
                  {formatTime(item, use24h)}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const tpStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '60%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 16, fontWeight: '700', color: '#222' },
  close: { fontSize: 15, color: '#1a73e8', fontWeight: '600' },
  timeItem: { padding: 14, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  selectedItem: { backgroundColor: '#e8f0fe' },
  timeText: { fontSize: 16, color: '#333' },
  selectedText: { color: '#1a73e8', fontWeight: '700' },
});

interface Props {
  date: string;
  onClose: () => void;
}

export function DayDetailScreen({ date, onClose }: Props) {
  const { getDayWork, setDayWork, removeDayWork } = useScheduleStore();
  const { use24Hour, dailyWorkHours } = useSettingsStore();

  const existing = getDayWork(date);
  const [workType, setWorkType] = useState<WorkType>(existing?.type ?? 'normal');
  const [startTime, setStartTime] = useState(existing?.startTime ?? '09:00');
  const [endTime, setEndTime] = useState(existing?.endTime ?? '18:00');
  const [breakMins, setBreakMins] = useState(existing?.breakMinutes ?? 60);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const needsTime = workType === 'normal' || workType === 'early_leave' || workType === 'holiday';

  // 분석 미리보기
  const preview = needsTime
    ? analyzeDayWork({ date, type: workType, startTime, endTime, breakMinutes: breakMins }, dailyWorkHours)
    : null;

  function save() {
    if (workType === 'off') {
      removeDayWork(date);
    } else {
      const work: DayWork = {
        date, type: workType,
        ...(needsTime ? { startTime, endTime, breakMinutes: breakMins } : {}),
      };
      setDayWork(date, work);
    }
    onClose();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelBtn}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.dateTitle}>{formatDate(date)}</Text>
        <TouchableOpacity onPress={save}>
          <Text style={styles.saveBtn}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body}>
        {/* 근무 유형 */}
        <Text style={styles.sectionLabel}>근무 유형</Text>
        <View style={styles.typeRow}>
          {WORK_TYPES.map((t) => (
            <TouchableOpacity
              key={t.value}
              style={[styles.typeBtn, workType === t.value && { backgroundColor: t.color, borderColor: t.color }]}
              onPress={() => setWorkType(t.value)}
            >
              <Text style={[styles.typeBtnText, workType === t.value && styles.typeBtnTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 시간 선택 (연차/휴무는 숨김) */}
        {needsTime && (
          <>
            <Text style={styles.sectionLabel}>근무 시간</Text>
            <View style={styles.timeRow}>
              <TouchableOpacity style={styles.timeBtn} onPress={() => setShowStart(true)}>
                <Text style={styles.timeBtnLabel}>출근</Text>
                <Text style={styles.timeBtnValue}>{formatTime(startTime, use24Hour)}</Text>
              </TouchableOpacity>
              <Text style={styles.timeSep}>~</Text>
              <TouchableOpacity style={styles.timeBtn} onPress={() => setShowEnd(true)}>
                <Text style={styles.timeBtnLabel}>퇴근</Text>
                <Text style={styles.timeBtnValue}>{formatTime(endTime, use24Hour)}</Text>
              </TouchableOpacity>
            </View>

            {/* 휴게 시간 */}
            <Text style={styles.sectionLabel}>휴게 시간</Text>
            <View style={styles.breakRow}>
              {[0, 30, 60, 90].map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.breakBtn, breakMins === m && styles.breakBtnActive]}
                  onPress={() => setBreakMins(m)}
                >
                  <Text style={[styles.breakBtnText, breakMins === m && styles.breakBtnTextActive]}>
                    {m === 0 ? '없음' : `${m}분`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 미리보기 */}
            {preview && (
              <View style={styles.preview}>
                <Text style={styles.previewTitle}>자동 계산 미리보기</Text>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>소정근로</Text>
                  <Text style={styles.previewVal}>{Math.floor(preview.regularMinutes / 60)}시간 {preview.regularMinutes % 60}분</Text>
                </View>
                {preview.overtimeMinutes > 0 && (
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>연장근로 (×1.5)</Text>
                    <Text style={[styles.previewVal, { color: '#f59e0b' }]}>+{Math.floor(preview.overtimeMinutes / 60)}시간 {preview.overtimeMinutes % 60}분</Text>
                  </View>
                )}
                {preview.nightMinutes > 0 && (
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>야간근로 (×0.5 추가)</Text>
                    <Text style={[styles.previewVal, { color: '#8b5cf6' }]}>+{Math.floor(preview.nightMinutes / 60)}시간 {preview.nightMinutes % 60}분</Text>
                  </View>
                )}
                {preview.isHoliday && (
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>휴일근로 (×1.5)</Text>
                    <Text style={[styles.previewVal, { color: '#ef4444' }]}>적용</Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <TimePicker visible={showStart} value={startTime} use24h={use24Hour}
        onSelect={setStartTime} onClose={() => setShowStart(false)} />
      <TimePicker visible={showEnd} value={endTime} use24h={use24Hour}
        onSelect={setEndTime} onClose={() => setShowEnd(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fa' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', padding: 16, paddingTop: 20,
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  cancelBtn: { fontSize: 15, color: '#888' },
  dateTitle: { fontSize: 16, fontWeight: '700', color: '#222' },
  saveBtn: { fontSize: 15, color: '#1a73e8', fontWeight: '700' },
  body: { flex: 1 },
  sectionLabel: { fontSize: 13, color: '#888', marginTop: 16, marginLeft: 16, marginBottom: 8 },
  typeRow: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8,
  },
  typeBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff',
  },
  typeBtnText: { fontSize: 13, color: '#666' },
  typeBtnTextActive: { color: '#fff', fontWeight: '600' },
  timeRow: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, gap: 8,
  },
  timeBtn: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: '#ddd',
  },
  timeBtnLabel: { fontSize: 11, color: '#888', marginBottom: 4 },
  timeBtnValue: { fontSize: 18, fontWeight: '700', color: '#1a73e8' },
  timeSep: { fontSize: 18, color: '#ccc' },
  breakRow: { flexDirection: 'row', marginHorizontal: 12, gap: 8 },
  breakBtn: {
    flex: 1, height: 38, borderRadius: 8, borderWidth: 1, borderColor: '#ddd',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
  },
  breakBtnActive: { backgroundColor: '#1a73e8', borderColor: '#1a73e8' },
  breakBtnText: { fontSize: 13, color: '#666' },
  breakBtnTextActive: { color: '#fff', fontWeight: '600' },
  preview: {
    margin: 12, backgroundColor: '#fff', borderRadius: 12, padding: 14,
  },
  previewTitle: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 10 },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  previewLabel: { fontSize: 13, color: '#666' },
  previewVal: { fontSize: 13, fontWeight: '600', color: '#333' },
});
