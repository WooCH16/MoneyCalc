import { calcInsurance } from './insuranceCalc';
import { calcTax } from './taxCalc';
import { SalaryInput, SalaryResult } from './types';

// 비과세 한도 (2025년)
const NON_TAXABLE_MEAL_LIMIT = 200_000;      // 식대 20만 원
const NON_TAXABLE_VEHICLE_LIMIT = 200_000;   // 차량유지비 20만 원

export function calcSalary(input: SalaryInput): SalaryResult {
  const { baseSalary, mealAllowance, vehicleAllowance, otherAllowances, dependents } = input;

  // 비과세 계산 (한도 초과분은 과세)
  const mealNonTaxable = Math.min(mealAllowance, NON_TAXABLE_MEAL_LIMIT);
  const vehicleNonTaxable = Math.min(vehicleAllowance, NON_TAXABLE_VEHICLE_LIMIT);
  const nonTaxable = mealNonTaxable + vehicleNonTaxable;

  const grossSalary = baseSalary + mealAllowance + vehicleAllowance + otherAllowances;
  const taxableSalary = grossSalary - nonTaxable;

  const insurance = calcInsurance(taxableSalary);
  const tax = calcTax(taxableSalary, dependents);

  const totalDeduction = insurance.total + tax.total;
  const netSalary = grossSalary - totalDeduction;

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
