import { calcInsurance } from './insuranceCalc';
import { calcTax } from './taxCalc';
import { SalaryInput, SalaryResult } from './types';

// 비과세 한도 (2025년)
const NON_TAXABLE_MEAL_LIMIT = 200_000;      // 식대 20만 원
const NON_TAXABLE_VEHICLE_LIMIT = 200_000;   // 차량유지비 20만 원

export function calcSalary(input: SalaryInput): SalaryResult {
  const {
    baseSalary, mealAllowance, vehicleAllowance, otherAllowances, dependents,
  } = input;

  // 음수 입력 방어
  const safeBase     = Math.max(baseSalary, 0);
  const safeMeal     = Math.max(mealAllowance, 0);
  const safeVehicle  = Math.max(vehicleAllowance, 0);
  const safeOther    = Math.max(otherAllowances, 0);
  const safeDep      = Math.max(Math.round(dependents), 1);

  // 비과세 계산 (한도 초과분은 과세)
  const mealNonTaxable    = Math.min(safeMeal, NON_TAXABLE_MEAL_LIMIT);
  const vehicleNonTaxable = Math.min(safeVehicle, NON_TAXABLE_VEHICLE_LIMIT);
  const nonTaxable = mealNonTaxable + vehicleNonTaxable;

  const grossSalary  = safeBase + safeMeal + safeVehicle + safeOther;
  const taxableSalary = Math.max(grossSalary - nonTaxable, 0);

  // 재할당: 방어된 값으로 계산
  const adjustedInput = { ...input, dependents: safeDep };

  const insurance = calcInsurance(taxableSalary);
  const tax = calcTax(taxableSalary, adjustedInput.dependents);

  const totalDeduction = insurance.total + tax.total;
  const netSalary = Math.max(grossSalary - totalDeduction, 0);

  return {
    grossSalary,
    nonTaxable,
    taxableSalary,
    insurance,
    tax,
    totalDeduction,
    netSalary,
  };
}
