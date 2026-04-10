import { INSURANCE_RATES, PENSION_INCOME_LIMIT } from './constants/insuranceRates';
import { InsuranceResult } from './types';

export function calcInsurance(taxableSalary: number): InsuranceResult {
  // 국민연금: 상·하한 적용
  const pensionBase = Math.min(
    Math.max(taxableSalary, PENSION_INCOME_LIMIT.min),
    PENSION_INCOME_LIMIT.max,
  );
  const nationalPension = Math.floor(pensionBase * INSURANCE_RATES.nationalPension);

  // 건강보험
  const healthInsurance = Math.floor(taxableSalary * INSURANCE_RATES.healthInsurance);

  // 장기요양보험 = 건강보험료 × 12.95% (10원 단위 절사)
  const longTermCare = Math.floor((healthInsurance * INSURANCE_RATES.longTermCareRate) / 10) * 10;

  // 고용보험
  const employmentInsurance = Math.floor(taxableSalary * INSURANCE_RATES.employmentInsurance);

  const total = nationalPension + healthInsurance + longTermCare + employmentInsurance;

  return { nationalPension, healthInsurance, longTermCare, employmentInsurance, total };
}
