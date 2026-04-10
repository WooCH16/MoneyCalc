// 2025년 기준 4대보험 요율 (근로자 부담분)
export const INSURANCE_RATES = {
  nationalPension: 0.045,        // 국민연금 4.5%
  healthInsurance: 0.03545,      // 건강보험 3.545%
  longTermCareRate: 0.1295,      // 장기요양 = 건강보험료 × 12.95%
  employmentInsurance: 0.009,    // 고용보험 0.9%
} as const;

// 국민연금 상·하한 기준 소득월액 (2025년)
export const PENSION_INCOME_LIMIT = {
  min: 390_000,   // 하한: 39만 원
  max: 6_170_000, // 상한: 617만 원
} as const;

// 건강보험 상한 (월)
export const HEALTH_INSURANCE_LIMIT = {
  max: 8_218_710, // 보험료 상한
} as const;
