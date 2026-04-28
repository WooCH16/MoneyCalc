import { calcUnemployment } from '../utils/unemploymentCalc';

describe('unemploymentCalc', () => {
  test('상한액 초과 케이스 — 상한 66,000원 적용', () => {
    const result = calcUnemployment({
      avgDailySalary: 200_000, // 일급 20만 → 60% = 12만 > 상한
      age: 30,
      insuredMonths: 24,
    });
    expect(result.dailyBenefit).toBe(66_000);
    expect(result.benefitDays).toBe(150); // 50세 미만, 1~3년
  });

  test('하한액 적용 케이스', () => {
    const result = calcUnemployment({
      avgDailySalary: 50_000, // 일급 5만 → 60% = 3만 < 하한
      age: 30,
      insuredMonths: 6,
    });
    // 하한: 10,030 × 0.8 × 8 = 64,192
    expect(result.dailyBenefit).toBe(64_192);
  });

  test('50세 이상, 10년 이상 — 소정급여일수 270일', () => {
    const result = calcUnemployment({
      avgDailySalary: 100_000,
      age: 55,
      insuredMonths: 130,
    });
    expect(result.benefitDays).toBe(270);
  });

  test('총 수령액 = 일액 × 소정급여일수', () => {
    const result = calcUnemployment({
      avgDailySalary: 100_000,
      age: 40,
      insuredMonths: 48,
    });
    expect(result.totalBenefit).toBe(result.dailyBenefit * result.benefitDays);
  });
});
