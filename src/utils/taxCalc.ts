import { TAX_TABLE, HIGH_INCOME_TAX } from './constants/taxTable';
import { TaxResult } from './types';

/**
 * 근로소득 간이세액 계산
 * @param taxableSalary 월 과세 급여
 * @param dependents    부양가족 수 (본인 포함, 최소 1)
 */
export function calcTax(taxableSalary: number, dependents: number): TaxResult {
  const depIndex = Math.min(Math.max(dependents, 1), 10) - 1;

  let incomeTax = 0;

  if (taxableSalary > 10_000_000) {
    // 1,000만 원 초과: 기준 세액 + 초과분 × 35%
    const base = TAX_TABLE.find(row => row[0] === 10_000_000);
    const baseAmount = base ? (base[depIndex + 1] as number) : HIGH_INCOME_TAX.base;
    incomeTax = Math.floor(baseAmount + (taxableSalary - 10_000_000) * HIGH_INCOME_TAX.rateAbove10M);
  } else {
    // 구간 탐색: 월 급여 이하 구간 중 가장 큰 상한
    for (const row of TAX_TABLE) {
      if (taxableSalary <= row[0]) {
        incomeTax = (row[depIndex + 1] as number) ?? 0;
        break;
      }
    }
  }

  incomeTax = Math.max(incomeTax, 0);
  const localIncomeTax = Math.floor(incomeTax * 0.1);
  const total = incomeTax + localIncomeTax;

  return { incomeTax, localIncomeTax, total };
}
