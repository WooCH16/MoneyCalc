import { DayWork, ScheduleResult, MonthSchedule } from './types';

// 야간근로 시간대: 22:00 ~ 06:00
const NIGHT_START = 22 * 60; // 분
const NIGHT_END = 6 * 60;    // 다음날 06:00

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * 하루 근무 시간 분석
 * - 소정근로: 8시간(480분) 이하
 * - 연장근로: 8시간 초과분 (1.5배)
 * - 야간근로: 22:00~06:00 구간 (0.5배 추가, 연장과 중복 가능)
 * - 휴일근로: 8시간 이하 1.5배, 초과 2.0배
 */
export function analyzeDayWork(work: DayWork, dailyWorkHours = 8): {
  regularMinutes: number;
  overtimeMinutes: number;
  nightMinutes: number;
  isHoliday: boolean;
} {
  if (!work.startTime || !work.endTime || work.type === 'off' || work.type === 'annual_leave') {
    return { regularMinutes: 0, overtimeMinutes: 0, nightMinutes: 0, isHoliday: false };
  }

  const start = timeToMinutes(work.startTime);
  let end = timeToMinutes(work.endTime);
  if (end <= start) end += 24 * 60; // 자정 넘김

  const breakMins = work.breakMinutes ?? 0;
  const actualMins = Math.max(end - start - breakMins, 0);
  const standardMins = dailyWorkHours * 60;

  // 조퇴: 실제 근무 시간 그대로 사용 (이미 단축된 시간)
  const regularMinutes = Math.min(actualMins, standardMins);
  const overtimeMinutes = Math.max(actualMins - standardMins, 0);

  // 야간근로 계산 (22:00 이후 또는 06:00 이전 구간)
  let nightMinutes = 0;
  // 22:00 이후 근무
  if (end > NIGHT_START) {
    nightMinutes += end - Math.max(start, NIGHT_START);
  }
  // 06:00 이전 근무 (다음날로 넘어간 경우)
  if (end > 24 * 60 && start < NIGHT_END + 24 * 60) {
    const nightEnd = Math.min(end, NIGHT_END + 24 * 60);
    const nightStart = 24 * 60; // 자정
    if (nightEnd > nightStart) nightMinutes += nightEnd - nightStart;
  }
  nightMinutes = Math.max(nightMinutes - breakMins, 0);

  const isHoliday = work.type === 'holiday';

  return { regularMinutes, overtimeMinutes, nightMinutes, isHoliday };
}

/**
 * 주휴수당 지급 여부 판단
 * - 주 소정근로시간이 15시간 이상이고, 해당 주 전일 개근 시
 */
function checkHolidayPay(
  weekDays: DayWork[],
  weeklyWorkHours: number,
): boolean {
  const workedMinutes = weekDays
    .filter(d => d.type === 'normal' || d.type === 'early_leave' || d.type === 'annual_leave')
    .reduce((sum, d) => {
      if (d.type === 'annual_leave') return sum + 480; // 연차는 소정근로시간 인정
      if (!d.startTime || !d.endTime) return sum;
      const start = timeToMinutes(d.startTime);
      let end = timeToMinutes(d.endTime);
      if (end <= start) end += 24 * 60;
      return sum + Math.max(end - start - (d.breakMinutes ?? 0), 0);
    }, 0);

  return workedMinutes >= weeklyWorkHours * 60 * (15 / 40);
}

/**
 * 월 스케줄 전체 계산
 */
export function calcMonthSchedule(
  schedule: MonthSchedule,
  hourlyWage: number,
  dailyWorkHours = 8,
  weeklyWorkHours = 40,
): ScheduleResult {
  let totalMinutes = 0;
  let regularMinutes = 0;
  let overtimeMinutes = 0;
  let nightMinutes = 0;
  let holidayMinutes = 0;
  let holidayPayDays = 0;
  let annualLeaveDays = 0;
  let earlyLeaveMinutes = 0;

  const sortedDates = Object.keys(schedule).sort();

  // 주차별 분리 (월요일 기준)
  const weekMap: Record<string, DayWork[]> = {};
  for (const date of sortedDates) {
    const d = new Date(date);
    // 해당 주의 월요일 구하기
    const day = d.getDay(); // 0=일, 1=월 ...
    const diff = (day === 0 ? -6 : 1 - day);
    const monday = new Date(d);
    monday.setDate(d.getDate() + diff);
    const weekKey = monday.toISOString().slice(0, 10);
    if (!weekMap[weekKey]) weekMap[weekKey] = [];
    weekMap[weekKey].push(schedule[date]);
  }

  // 주휴수당 주 수 계산
  for (const weekDays of Object.values(weekMap)) {
    if (checkHolidayPay(weekDays, weeklyWorkHours)) {
      holidayPayDays++;
    }
  }

  // 일별 계산
  for (const date of sortedDates) {
    const work = schedule[date];

    if (work.type === 'annual_leave') {
      annualLeaveDays++;
      regularMinutes += dailyWorkHours * 60;
      totalMinutes += dailyWorkHours * 60;
      continue;
    }

    if (work.type === 'off' || !work.startTime || !work.endTime) continue;

    const analysis = analyzeDayWork(work, dailyWorkHours);

    // 조퇴 차감
    if (work.type === 'early_leave') {
      const standardMins = dailyWorkHours * 60;
      const actualMins = analysis.regularMinutes;
      if (actualMins < standardMins) {
        earlyLeaveMinutes += standardMins - actualMins;
      }
    }

    if (analysis.isHoliday) {
      holidayMinutes += analysis.regularMinutes + analysis.overtimeMinutes;
    } else {
      regularMinutes += analysis.regularMinutes;
      overtimeMinutes += analysis.overtimeMinutes;
    }
    nightMinutes += analysis.nightMinutes;
    totalMinutes += analysis.regularMinutes + analysis.overtimeMinutes;
  }

  // 임금 계산 (분 → 시간)
  const perMin = hourlyWage / 60;
  const regularWage = regularMinutes * perMin;
  const overtimeWage = overtimeMinutes * perMin * 1.5;
  const nightWage = nightMinutes * perMin * 0.5; // 야간 할증분 (0.5 추가)
  const holidayWage = holidayMinutes * perMin * 1.5;

  // 주휴수당: (주 소정근로시간 / 40) × 8 × 시급
  const holidayPayWage = holidayPayDays * (weeklyWorkHours / 40) * 8 * hourlyWage;

  // 연차 임금: 소정근로시간 × 시급
  const annualLeaveWage = annualLeaveDays * dailyWorkHours * hourlyWage;

  // 조퇴 차감
  const earlyLeaveDeduction = earlyLeaveMinutes * perMin;

  const grossWage = Math.floor(
    regularWage + overtimeWage + nightWage + holidayWage +
    holidayPayWage + annualLeaveWage - earlyLeaveDeduction,
  );

  return {
    totalMinutes,
    regularMinutes,
    overtimeMinutes,
    nightMinutes,
    holidayMinutes,
    holidayPayDays,
    annualLeaveDays,
    earlyLeaveMinutes,
    grossWage,
  };
}
