import { calcInsurance } from '../utils/insuranceCalc';

describe('insuranceCalc', () => {
  // 기본 케이스: 월 급여 3,000,000원
  test('월 300만 원 기준 4대보험', () => {
    const result = calcInsurance(3_000_000);
    // 국민연금: 3,000,000 × 4.5% = 135,000
    expect(result.nationalPension).toBe(135_000);
    // 건강보험: 3,000,000 × 3.545% = 106,350
    expect(result.healthInsurance).toBe(106_350);
    // 장기요양: 106,350 × 12.95% = 13,772.xxx → 10원 단위 절사 → 13,770
    expect(result.longTermCare).toBe(13_770);
    // 고용보험: 3,000,000 × 0.9% = 27,000
    expect(result.employmentInsurance).toBe(27_000);
    // 합계
    expect(result.total).toBe(135_000 + 106_350 + 13_770 + 27_000);
  });

  // 국민연금 상한: 6,170,000 초과
  test('월 700만 원 — 국민연금 상한 적용', () => {
    const result = calcInsurance(7_000_000);
    expect(result.nationalPension).toBe(Math.floor(6_170_000 * 0.045));
  });

  // 국민연금 하한: 390,000 미만
  test('월 20만 원 — 국민연금 하한 적용', () => {
    const result = calcInsurance(200_000);
    expect(result.nationalPension).toBe(Math.floor(390_000 * 0.045));
  });

  // 0원 입력
  test('0원 입력 — 하한 적용', () => {
    const result = calcInsurance(0);
    expect(result.nationalPension).toBe(Math.floor(390_000 * 0.045));
    expect(result.healthInsurance).toBe(0);
    expect(result.employmentInsurance).toBe(0);
  });
});
