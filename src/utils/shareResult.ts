import { Share } from 'react-native';
import { SalaryResult } from './types';
import { formatCurrency } from './formatters';

export async function shareSalaryResult(result: SalaryResult): Promise<void> {
  const lines = [
    '📊 MoneyCalc 급여 계산 결과',
    '─────────────────',
    `총 급여       : ${formatCurrency(result.grossSalary)}원`,
    `비과세        : ${formatCurrency(result.nonTaxable)}원`,
    '',
    '[ 4대보험 공제 ]',
    `  국민연금    : ${formatCurrency(result.insurance.nationalPension)}원`,
    `  건강보험    : ${formatCurrency(result.insurance.healthInsurance)}원`,
    `  장기요양    : ${formatCurrency(result.insurance.longTermCare)}원`,
    `  고용보험    : ${formatCurrency(result.insurance.employmentInsurance)}원`,
    '',
    '[ 세금 공제 ]',
    `  근로소득세  : ${formatCurrency(result.tax.incomeTax)}원`,
    `  지방소득세  : ${formatCurrency(result.tax.localIncomeTax)}원`,
    '',
    `총 공제액     : ${formatCurrency(result.totalDeduction)}원`,
    '─────────────────',
    `✅ 실수령액   : ${formatCurrency(result.netSalary)}원`,
  ];

  await Share.share({ message: lines.join('\n') });
}

export async function shareText(text: string): Promise<void> {
  await Share.share({ message: text });
}
