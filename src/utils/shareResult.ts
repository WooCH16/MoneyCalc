import { Share } from 'react-native';
import { SalaryResult, UnemploymentResult, SeveranceResult, ScheduleResult } from './types';
import { formatCurrency, formatMinutes } from './formatters';

const DIVIDER = '─────────────────';
const APP_TAG = 'MoneyCalc';

export async function shareSalaryResult(result: SalaryResult): Promise<void> {
  const lines = [
    `📊 ${APP_TAG} 급여 계산 결과`,
    DIVIDER,
    `총 급여          : ${formatCurrency(result.grossSalary)}원`,
    `비과세           : ${formatCurrency(result.nonTaxable)}원`,
    '',
    '[ 4대보험 공제 ]',
    `  국민연금       : ${formatCurrency(result.insurance.nationalPension)}원`,
    `  건강보험       : ${formatCurrency(result.insurance.healthInsurance)}원`,
    `  장기요양보험   : ${formatCurrency(result.insurance.longTermCare)}원`,
    `  고용보험       : ${formatCurrency(result.insurance.employmentInsurance)}원`,
    '',
    '[ 세금 공제 ]',
    `  근로소득세     : ${formatCurrency(result.tax.incomeTax)}원`,
    `  지방소득세     : ${formatCurrency(result.tax.localIncomeTax)}원`,
    '',
    `총 공제액        : ${formatCurrency(result.totalDeduction)}원`,
    DIVIDER,
    `✅ 실수령액      : ${formatCurrency(result.netSalary)}원`,
  ];

  await Share.share({ message: lines.join('\n') });
}

export async function shareUnemploymentResult(result: UnemploymentResult): Promise<void> {
  const lines = [
    `📊 ${APP_TAG} 실업급여 계산 결과`,
    DIVIDER,
    `구직급여 일액     : ${formatCurrency(result.dailyBenefit)}원`,
    `소정급여일수      : ${result.benefitDays}일`,
    DIVIDER,
    `✅ 예상 총 수령액 : ${formatCurrency(result.totalBenefit)}원`,
    '',
    '(2025년 기준, 실제 지급액은 고용센터 심사 결과에 따라 달라질 수 있습니다)',
  ];

  await Share.share({ message: lines.join('\n') });
}

export async function shareSeveranceResult(
  result: SeveranceResult,
  joinDate: string,
  leaveDate: string,
): Promise<void> {
  const lines = [
    `📊 ${APP_TAG} 퇴직금 계산 결과`,
    DIVIDER,
    `입사일            : ${joinDate}`,
    `퇴사일            : ${leaveDate}`,
    `재직일수          : ${result.workingDays}일`,
    `평균임금(1일)     : ${formatCurrency(result.avgDailySalary)}원`,
    DIVIDER,
    `✅ 예상 퇴직금 : ${formatCurrency(result.severancePay)}원`,
    '',
    '(법정 기준 계산값이며, 실제 지급액은 회사 규정/정산 방식에 따라 달라질 수 있습니다)',
  ];

  await Share.share({ message: lines.join('\n') });
}

export async function shareScheduleResult(
  yearMonth: string,
  result: ScheduleResult,
  netSalary: number,
): Promise<void> {
  const [year, month] = yearMonth.split('-');
  const lines = [
    `📅 ${APP_TAG} ${year}년 ${parseInt(month, 10)}월 근무 요약`,
    DIVIDER,
    `총 근무시간       : ${formatMinutes(result.totalMinutes)}`,
    `연장근로          : ${formatMinutes(result.overtimeMinutes)}`,
    `야간근로          : ${formatMinutes(result.nightMinutes)}`,
    `주휴수당          : ${result.holidayPayDays}주`,
    `연차 사용         : ${result.annualLeaveDays}일`,
    '',
    `예상 급여(세전)   : ${formatCurrency(result.grossWage)}원`,
    DIVIDER,
    `✅ 예상 실수령액 : ${formatCurrency(netSalary)}원`,
    '',
    '(실수령액은 기본 공제 기준으로 계산된 추정치입니다)',
  ];

  await Share.share({ message: lines.join('\n') });
}

export async function shareText(text: string): Promise<void> {
  await Share.share({ message: text });
}
