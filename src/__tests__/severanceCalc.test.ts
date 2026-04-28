import { calcSeverance } from '../utils/severanceCalc';

describe('severanceCalc', () => {
  test('1년 정확히 근무', () => {
    const result = calcSeverance({
      joinDate: '2024-01-01',
      leaveDate: '2025-01-01',
      lastThreeMonthSalary: 9_000_000,
      lastThreeMonthDays: 89,
    });
    // 평균임금 = 9,000,000 / 89 ≈ 101,123
    // 퇴직금 = 101,123 × 30 × (365/365) = 3,033,708
    expect(result.workingDays).toBe(366); // 2024년 윤년 포함
    expect(result.severancePay).toBeGreaterThan(0);
  });

  test('1년 미만 — 퇴직금 0', () => {
    const result = calcSeverance({
      joinDate: '2024-01-01',
      leaveDate: '2024-06-01',
      lastThreeMonthSalary: 9_000_000,
      lastThreeMonthDays: 89,
    });
    expect(result.severancePay).toBe(0);
  });

  test('5년 근무', () => {
    const result = calcSeverance({
      joinDate: '2020-01-01',
      leaveDate: '2025-01-01',
      lastThreeMonthSalary: 12_000_000,
      lastThreeMonthDays: 92,
    });
    expect(result.workingDays).toBeGreaterThan(1800);
    expect(result.severancePay).toBeGreaterThan(10_000_000);
  });

  test('날짜 비어있으면 퇴직금 0', () => {
    const result = calcSeverance({
      joinDate: '',
      leaveDate: '',
      lastThreeMonthSalary: 9_000_000,
      lastThreeMonthDays: 89,
    });
    expect(result.severancePay).toBe(0);
  });
});
