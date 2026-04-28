// 근무 유형
export type WorkType = 'normal' | 'annual_leave' | 'early_leave' | 'holiday' | 'off';

// 하루 근무 데이터
export interface DayWork {
  date: string;          // YYYY-MM-DD
  type: WorkType;
  startTime?: string;    // HH:mm
  endTime?: string;      // HH:mm
  breakMinutes?: number; // 휴게 시간 (분)
  note?: string;
}

// 월별 스케줄
export type MonthSchedule = Record<string, DayWork>; // key: YYYY-MM-DD

// 4대보험 계산 결과
export interface InsuranceResult {
  nationalPension: number;    // 국민연금
  healthInsurance: number;    // 건강보험
  longTermCare: number;       // 장기요양보험
  employmentInsurance: number; // 고용보험
  total: number;
}

// 세금 계산 결과
export interface TaxResult {
  incomeTax: number;      // 근로소득세
  localIncomeTax: number; // 지방소득세
  total: number;
}

// 급여 계산 입력
export interface SalaryInput {
  baseSalary: number;           // 기본급
  mealAllowance: number;        // 식대
  vehicleAllowance: number;     // 차량유지비
  otherAllowances: number;      // 기타 수당
  dependents: number;           // 부양가족 수 (본인 포함)
}

// 급여 계산 결과
export interface SalaryResult {
  grossSalary: number;          // 총 급여
  nonTaxable: number;           // 비과세
  taxableSalary: number;        // 과세 급여
  insurance: InsuranceResult;
  tax: TaxResult;
  totalDeduction: number;       // 총 공제액
  netSalary: number;            // 실수령액
}

// 스케줄 계산 결과
export interface ScheduleResult {
  totalMinutes: number;         // 총 근무 시간 (분)
  regularMinutes: number;       // 소정근로 시간
  overtimeMinutes: number;      // 연장근로
  nightMinutes: number;         // 야간근로
  holidayMinutes: number;       // 휴일근로
  holidayPayDays: number;       // 주휴수당 지급 주 수
  annualLeaveDays: number;      // 연차 사용일
  earlyLeaveMinutes: number;    // 조퇴 차감 시간
  grossWage: number;            // 총 임금
}

// 실업급여 입력
export interface UnemploymentInput {
  avgDailySalary: number;       // 이직 전 3개월 평균 일급
  age: number;                  // 나이
  insuredMonths: number;        // 고용보험 가입 기간 (개월)
}

// 실업급여 결과
export interface UnemploymentResult {
  dailyBenefit: number;         // 구직급여 일액
  benefitDays: number;          // 소정급여일수
  totalBenefit: number;         // 총 구직급여액
}

// 퇴직금 입력
export interface SeveranceInput {
  joinDate: string;             // 입사일 YYYY-MM-DD
  leaveDate: string;            // 퇴사일 YYYY-MM-DD
  lastThreeMonthSalary: number; // 최근 3개월 총 임금
  lastThreeMonthDays: number;   // 최근 3개월 총 일수 (기본 89 or 91)
}

// 퇴직금 결과
export interface SeveranceResult {
  avgDailySalary: number;       // 평균임금 (일)
  workingDays: number;          // 재직일수
  severancePay: number;         // 퇴직금
}

// 설정
export interface Settings {
  use24Hour: boolean;           // true: 24시간제, false: 12시간제
  hourlyWage: number;           // 기준 시급
  dailyWorkHours: number;       // 소정 근로시간 (시간/일, 기본 8)
  weeklyWorkHours: number;      // 주 소정근로시간 (기본 40)
}
