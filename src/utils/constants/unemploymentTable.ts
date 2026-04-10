// 소정급여일수 테이블 (고용보험법 별표 기준, 2025년)
// [나이 구분, 가입기간 구간, 소정급여일수(일)]

// 나이 구분
export type AgeGroup = 'under50' | 'above50orDisabled';

// 가입기간 구분 (개월)
export type InsuredPeriod =
  | 'under12'       // 1년 미만
  | '12to36'        // 1년 이상 ~ 3년 미만
  | '36to60'        // 3년 이상 ~ 5년 미만
  | '60to120'       // 5년 이상 ~ 10년 미만
  | 'above120';     // 10년 이상

export const BENEFIT_DAYS: Record<AgeGroup, Record<InsuredPeriod, number>> = {
  under50: {
    under12:  120,
    '12to36': 150,
    '36to60': 180,
    '60to120': 210,
    above120: 240,
  },
  above50orDisabled: {
    under12:  120,
    '12to36': 180,
    '36to60': 210,
    '60to120': 240,
    above120: 270,
  },
};

// 구직급여 상·하한 (2025년)
export const BENEFIT_LIMIT = {
  dailyMax: 66_000,       // 상한 66,000원/일
  minWageRate: 0.8,       // 하한 = 최저임금 × 80%
  minWage2025: 10_030,    // 2025년 최저임금 시급
  dailyWorkHours: 8,      // 기준 일 근로시간
} as const;

export function getInsuredPeriod(months: number): InsuredPeriod {
  if (months < 12) return 'under12';
  if (months < 36) return '12to36';
  if (months < 60) return '36to60';
  if (months < 120) return '60to120';
  return 'above120';
}

export function getAgeGroup(age: number): AgeGroup {
  return age >= 50 ? 'above50orDisabled' : 'under50';
}
