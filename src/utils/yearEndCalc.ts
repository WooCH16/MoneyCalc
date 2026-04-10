// 연말정산 예상 계산 (2025년 기준)

export interface YearEndInput {
  monthlyNetSalaries: number[];   // 월별 실수령액 (1~12월, 없는 달 0)
  monthlyTaxPaid: number[];       // 월별 기납부 세액 합계 (근로소득세 + 지방소득세)
  dependents: number;             // 부양가족 수 (본인 포함)
  disabledCount: number;          // 장애인 공제 인원
  seniorCount: number;            // 경로우대자 공제 인원 (70세 이상)
  singleParent: boolean;          // 한부모 공제
  creditCardTotal: number;        // 신용카드 등 사용액 합계
  medicalExpense: number;         // 의료비
  educationExpense: number;       // 교육비
  donationExpense: number;        // 기부금
  pensionSaving: number;          // 연금저축 납입액
  housingFund: number;            // 주택청약저축 납입액
}

export interface YearEndResult {
  annualGrossSalary: number;      // 연간 총급여
  laborIncomeDeduction: number;   // 근로소득공제
  laborIncome: number;            // 근로소득금액
  personalDeduction: number;      // 인적공제 합계
  specialDeduction: number;       // 특별소득공제 (건강·고용보험 등)
  otherDeduction: number;         // 기타공제 합계
  taxableIncome: number;          // 종합소득 과세표준
  calculatedTax: number;          // 산출세액
  taxCredit: number;              // 세액공제 합계
  finalTax: number;               // 결정세액
  totalPaidTax: number;           // 기납부세액
  refundOrPay: number;            // 환급(+) 또는 추가납부(-) 예상액
}

// 근로소득공제 (2025년)
function calcLaborIncomeDeduction(gross: number): number {
  if (gross <= 5_000_000)    return Math.floor(gross * 0.7);
  if (gross <= 15_000_000)   return 3_500_000 + Math.floor((gross - 5_000_000) * 0.4);
  if (gross <= 45_000_000)   return 7_500_000 + Math.floor((gross - 15_000_000) * 0.15);
  if (gross <= 100_000_000)  return 12_000_000 + Math.floor((gross - 45_000_000) * 0.05);
  return Math.min(14_750_000 + Math.floor((gross - 100_000_000) * 0.02), 20_000_000);
}

// 종합소득세 산출 (누진세율)
function calcProgressiveTax(taxableIncome: number): number {
  if (taxableIncome <= 14_000_000)  return Math.floor(taxableIncome * 0.06);
  if (taxableIncome <= 50_000_000)  return 840_000 + Math.floor((taxableIncome - 14_000_000) * 0.15);
  if (taxableIncome <= 88_000_000)  return 6_240_000 + Math.floor((taxableIncome - 50_000_000) * 0.24);
  if (taxableIncome <= 150_000_000) return 15_360_000 + Math.floor((taxableIncome - 88_000_000) * 0.35);
  if (taxableIncome <= 300_000_000) return 37_060_000 + Math.floor((taxableIncome - 150_000_000) * 0.38);
  if (taxableIncome <= 500_000_000) return 94_060_000 + Math.floor((taxableIncome - 300_000_000) * 0.40);
  if (taxableIncome <= 1_000_000_000) return 174_060_000 + Math.floor((taxableIncome - 500_000_000) * 0.42);
  return 384_060_000 + Math.floor((taxableIncome - 1_000_000_000) * 0.45);
}

export function calcYearEnd(input: YearEndInput): YearEndResult {
  const {
    monthlyNetSalaries, monthlyTaxPaid, dependents,
    disabledCount, seniorCount, singleParent,
    creditCardTotal, medicalExpense, educationExpense,
    donationExpense, pensionSaving, housingFund,
  } = input;

  // 연간 총급여 (실수령 + 공제액 역산이 아닌, 총급여 직접 입력 방식으로 단순화)
  // 여기서는 월별 납부세액 합산으로 연간 납부세액 계산
  const totalPaidTax = monthlyTaxPaid.reduce((s, v) => s + v, 0);
  // 연간 총급여 추정 (총급여 입력 없으면 실수령 합산으로 근사)
  const annualGrossSalary = monthlyNetSalaries.reduce((s, v) => s + v, 0);

  // 근로소득공제
  const laborIncomeDeduction = calcLaborIncomeDeduction(annualGrossSalary);
  const laborIncome = Math.max(annualGrossSalary - laborIncomeDeduction, 0);

  // 인적공제
  const basicDeduction = Math.max(dependents, 1) * 1_500_000;  // 1인당 150만
  const disabledDeduction = disabledCount * 2_000_000;          // 장애인 200만
  const seniorDeduction = seniorCount * 1_000_000;              // 경로 100만
  const singleParentDeduction = singleParent ? 1_000_000 : 0;  // 한부모 100만
  const personalDeduction = basicDeduction + disabledDeduction + seniorDeduction + singleParentDeduction;

  // 특별소득공제 (건강·고용보험 등) — 총급여의 약 4.44% 추정
  const specialDeduction = Math.floor(annualGrossSalary * 0.0444);

  // 기타 공제
  const pensionSavingCredit = Math.min(pensionSaving, 6_000_000); // 연금저축 한도 600만
  const housingFundDeduction = Math.min(housingFund, 4_000_000); // 주택청약 한도 400만

  // 신용카드 등 소득공제
  const creditCardMinSpend = annualGrossSalary * 0.25; // 총급여 25% 초과분
  const creditCardBase = Math.max(creditCardTotal - creditCardMinSpend, 0);
  const creditCardDeduction = Math.min(
    Math.floor(creditCardBase * 0.15), // 신용카드 15%
    Math.min(annualGrossSalary <= 70_000_000 ? 3_000_000 : 2_500_000, 3_000_000),
  );

  const otherDeduction = housingFundDeduction + creditCardDeduction;

  // 과세표준
  const taxableIncome = Math.max(
    laborIncome - personalDeduction - specialDeduction - otherDeduction,
    0,
  );

  // 산출세액
  const calculatedTax = calcProgressiveTax(taxableIncome);

  // 세액공제
  // 근로소득 세액공제 (산출세액 구간별)
  let laborTaxCredit = 0;
  if (calculatedTax <= 1_300_000) {
    laborTaxCredit = Math.floor(calculatedTax * 0.55);
  } else {
    laborTaxCredit = 715_000 + Math.floor((calculatedTax - 1_300_000) * 0.3);
  }
  // 한도: 총급여 3300만 이하 74만, 7000만 이하 66만, 초과 50만
  const laborCreditLimit =
    annualGrossSalary <= 33_000_000 ? 740_000 :
    annualGrossSalary <= 70_000_000 ? 660_000 : 500_000;
  laborTaxCredit = Math.min(laborTaxCredit, laborCreditLimit);

  // 의료비 세액공제: (의료비 - 총급여 3%) × 15%
  const medicalBase = Math.max(medicalExpense - annualGrossSalary * 0.03, 0);
  const medicalCredit = Math.floor(medicalBase * 0.15);

  // 교육비 세액공제: 15%
  const educationCredit = Math.floor(educationExpense * 0.15);

  // 기부금 세액공제: 1000만 이하 15%, 초과 30%
  const donationCredit =
    donationExpense <= 10_000_000
      ? Math.floor(donationExpense * 0.15)
      : 1_500_000 + Math.floor((donationExpense - 10_000_000) * 0.3);

  // 연금저축 세액공제: 12% (총급여 5500만 이하 15%)
  const pensionRate = annualGrossSalary <= 55_000_000 ? 0.15 : 0.12;
  const pensionCredit = Math.floor(pensionSavingCredit * pensionRate);

  const taxCredit = laborTaxCredit + medicalCredit + educationCredit + donationCredit + pensionCredit;

  // 결정세액 (지방소득세 포함)
  const incomeTax = Math.max(calculatedTax - taxCredit, 0);
  const finalTax = Math.floor(incomeTax * 1.1); // 지방소득세 10% 포함

  // 환급/추납
  const refundOrPay = totalPaidTax - finalTax;

  return {
    annualGrossSalary,
    laborIncomeDeduction,
    laborIncome,
    personalDeduction,
    specialDeduction,
    otherDeduction,
    taxableIncome,
    calculatedTax,
    taxCredit,
    finalTax,
    totalPaidTax,
    refundOrPay,
  };
}
