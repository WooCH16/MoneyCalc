import {
  BENEFIT_LIMIT,
  BENEFIT_DAYS,
  getAgeGroup,
  getInsuredPeriod,
} from './constants/unemploymentTable';
import { UnemploymentInput, UnemploymentResult } from './types';

export function calcUnemployment(input: UnemploymentInput): UnemploymentResult {
  const { avgDailySalary, age, insuredMonths } = input;

  // 구직급여 일액 = 평균 일급 × 60%
  const rawDaily = Math.floor(avgDailySalary * 0.6);

  // 하한: 최저임금 × 80% × 8시간
  const dailyMin = Math.floor(
    BENEFIT_LIMIT.minWage2025 * BENEFIT_LIMIT.minWageRate * BENEFIT_LIMIT.dailyWorkHours,
  );

  // 상·하한 적용
  const dailyBenefit = Math.min(Math.max(rawDaily, dailyMin), BENEFIT_LIMIT.dailyMax);

  // 소정급여일수
  const ageGroup = getAgeGroup(age);
  const period = getInsuredPeriod(insuredMonths);
  const benefitDays = BENEFIT_DAYS[ageGroup][period];

  const totalBenefit = dailyBenefit * benefitDays;

  return { dailyBenefit, benefitDays, totalBenefit };
}
