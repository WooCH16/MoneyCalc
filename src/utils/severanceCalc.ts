import { SeveranceInput, SeveranceResult } from './types';

export function calcSeverance(input: SeveranceInput): SeveranceResult {
  const { joinDate, leaveDate, lastThreeMonthSalary, lastThreeMonthDays } = input;

  const join = new Date(joinDate);
  const leave = new Date(leaveDate);

  // 재직일수
  const workingDays = Math.floor((leave.getTime() - join.getTime()) / (1000 * 60 * 60 * 24));

  // 1년 미만이면 퇴직금 없음
  if (workingDays < 365) {
    return { avgDailySalary: 0, workingDays, severancePay: 0 };
  }

  // 평균임금 = 최근 3개월 총 임금 / 최근 3개월 총 일수
  const avgDailySalary = lastThreeMonthSalary / lastThreeMonthDays;

  // 퇴직금 = 평균임금 × 30 × (재직일수 / 365)
  const severancePay = Math.floor(avgDailySalary * 30 * (workingDays / 365));

  return { avgDailySalary: Math.floor(avgDailySalary), workingDays, severancePay };
}
