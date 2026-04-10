import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DayWork } from '../../utils/types';
import { formatTime } from '../../utils/formatters';

interface Props {
  date: string;        // YYYY-MM-DD
  day: number;         // 1~31
  dayOfWeek: number;   // 0=일, 6=토
  work?: DayWork;
  isToday: boolean;
  isCurrentMonth: boolean;
  use24Hour: boolean;
  onPress: (date: string) => void;
}

const TYPE_COLORS: Record<string, string> = {
  normal:       '#1a73e8',
  early_leave:  '#f59e0b',
  annual_leave: '#10b981',
  holiday:      '#ef4444',
};

const TYPE_LABELS: Record<string, string> = {
  annual_leave: '연차',
  holiday:      '휴일',
};

export const DayCell = memo(function DayCell({ date, day, dayOfWeek, work, isToday, isCurrentMonth, use24Hour, onPress }: Props) {
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const hasWork = work && work.type !== 'off';
  const color = hasWork ? TYPE_COLORS[work.type] ?? '#1a73e8' : undefined;

  return (
    <TouchableOpacity
      style={[styles.cell, isToday && styles.todayCell]}
      onPress={() => onPress(date)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.dayNum,
        !isCurrentMonth && styles.otherMonth,
        dayOfWeek === 0 && styles.sunday,
        dayOfWeek === 6 && styles.saturday,
        isToday && styles.todayNum,
      ]}>
        {day}
      </Text>

      {hasWork && (
        <View style={[styles.badge, { backgroundColor: color + '20' }]}>
          {work.type === 'annual_leave' || work.type === 'holiday' ? (
            <Text style={[styles.badgeLabel, { color }]}>{TYPE_LABELS[work.type]}</Text>
          ) : (
            <>
              <Text style={[styles.timeText, { color }]}>
                {formatTime(work.startTime!, use24Hour)}
              </Text>
              <Text style={[styles.timeSep, { color }]}>~</Text>
              <Text style={[styles.timeText, { color }]}>
                {formatTime(work.endTime!, use24Hour)}
              </Text>
              {work.type === 'early_leave' && (
                <Text style={styles.earlyIcon}>✂</Text>
              )}
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    minHeight: 64,
    padding: 4,
    borderRadius: 6,
    margin: 1,
    alignItems: 'center',
  },
  todayCell: {
    backgroundColor: '#e8f0fe',
  },
  dayNum: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  otherMonth: { color: '#ccc' },
  sunday:     { color: '#ef4444' },
  saturday:   { color: '#3b82f6' },
  todayNum:   { fontWeight: '800' },
  badge: {
    borderRadius: 4,
    paddingHorizontal: 3,
    paddingVertical: 2,
    alignItems: 'center',
    width: '100%',
  },
  badgeLabel: { fontSize: 10, fontWeight: '700' },
  timeText:   { fontSize: 9, fontWeight: '600' },
  timeSep:    { fontSize: 8, opacity: 0.6 },
  earlyIcon:  { fontSize: 9 },
});
