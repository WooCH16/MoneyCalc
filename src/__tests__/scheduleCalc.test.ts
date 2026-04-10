import { analyzeDayWork, calcMonthSchedule } from '../utils/scheduleCalc';
import { DayWork, MonthSchedule } from '../utils/types';

describe('analyzeDayWork', () => {
  const HOURLY = 10_030;

  test('정상 8시간 근무 (09:00~18:00, 휴게 60분)', () => {
    const work: DayWork = { date: '2025-04-07', type: 'normal', startTime: '09:00', endTime: '18:00', breakMinutes: 60 };
    const result = analyzeDayWork(work, 8);
    expect(result.regularMinutes).toBe(480);  // 8시간
    expect(result.overtimeMinutes).toBe(0);
    expect(result.nightMinutes).toBe(0);
  });

  test('연장근로 포함 (09:00~21:00, 휴게 60분 → 11시간, 연장 3시간)', () => {
    const work: DayWork = { date: '2025-04-07', type: 'normal', startTime: '09:00', endTime: '21:00', breakMinutes: 60 };
    const result = analyzeDayWork(work, 8);
    expect(result.regularMinutes).toBe(480);
    expect(result.overtimeMinutes).toBe(180); // 3시간
  });

  test('야간근로 포함 (18:00~23:00, 휴게 0분)', () => {
    const work: DayWork = { date: '2025-04-07', type: 'normal', startTime: '18:00', endTime: '23:00', breakMinutes: 0 };
    const result = analyzeDayWork(work, 8);
    // 22:00~23:00 = 60분 야간
    expect(result.nightMinutes).toBe(60);
  });

  test('연차 입력 시 0 반환', () => {
    const work: DayWork = { date: '2025-04-07', type: 'annual_leave' };
    const result = analyzeDayWork(work, 8);
    expect(result.regularMinutes).toBe(0);
    expect(result.overtimeMinutes).toBe(0);
  });

  test('조퇴 (09:00~14:00, 휴게 0분 → 5시간 근무, 3시간 차감)', () => {
    const work: DayWork = { date: '2025-04-07', type: 'early_leave', startTime: '09:00', endTime: '14:00', breakMinutes: 0 };
    const result = analyzeDayWork(work, 8);
    expect(result.regularMinutes).toBe(300); // 5시간
    expect(result.overtimeMinutes).toBe(0);
  });
});

describe('calcMonthSchedule', () => {
  const HOURLY = 10_030;
  const DAILY = 8;
  const WEEKLY = 40;

  test('주 5일 정상근무 → 주휴수당 1주 지급', () => {
    // 월요일~금요일 (2025-03-03 ~ 2025-03-07)
    const schedule: MonthSchedule = {};
    const days = ['2025-03-03', '2025-03-04', '2025-03-05', '2025-03-06', '2025-03-07'];
    days.forEach(date => {
      schedule[date] = { date, type: 'normal', startTime: '09:00', endTime: '18:00', breakMinutes: 60 };
    });
    const result = calcMonthSchedule(schedule, HOURLY, DAILY, WEEKLY);
    expect(result.holidayPayDays).toBeGreaterThanOrEqual(1);
    expect(result.regularMinutes).toBe(480 * 5); // 5일 × 8시간
  });

  test('연차 1일 → annualLeaveDays 1', () => {
    const schedule: MonthSchedule = {
      '2025-03-03': { date: '2025-03-03', type: 'annual_leave' },
    };
    const result = calcMonthSchedule(schedule, HOURLY, DAILY, WEEKLY);
    expect(result.annualLeaveDays).toBe(1);
  });

  test('조퇴 시 earlyLeaveMinutes 반영', () => {
    const schedule: MonthSchedule = {
      '2025-03-03': { date: '2025-03-03', type: 'early_leave', startTime: '09:00', endTime: '14:00', breakMinutes: 0 },
    };
    const result = calcMonthSchedule(schedule, HOURLY, DAILY, WEEKLY);
    expect(result.earlyLeaveMinutes).toBe(180); // 3시간 차감
  });

  test('빈 스케줄 → 모두 0', () => {
    const result = calcMonthSchedule({}, HOURLY, DAILY, WEEKLY);
    expect(result.grossWage).toBe(0);
    expect(result.totalMinutes).toBe(0);
  });
});
