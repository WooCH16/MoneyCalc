import { calcTax } from '../utils/taxCalc';

describe('taxCalc', () => {
  test('월 300만 원 / 부양가족 1인', () => {
    const result = calcTax(3_000_000, 1);
    // 간이세액표 기준: 183,270원
    expect(result.incomeTax).toBe(183_270);
    expect(result.localIncomeTax).toBe(Math.floor(183_270 * 0.1));
    expect(result.total).toBe(result.incomeTax + result.localIncomeTax);
  });

  test('월 300만 원 / 부양가족 3인', () => {
    const result = calcTax(3_000_000, 3);
    expect(result.incomeTax).toBe(108_020);
  });

  test('과세급여 0원 이하 — 세금 없음', () => {
    const result = calcTax(0, 1);
    expect(result.incomeTax).toBe(0);
    expect(result.total).toBe(0);
  });

  test('부양가족 10인 이상 클램프', () => {
    const r10 = calcTax(3_000_000, 10);
    const r15 = calcTax(3_000_000, 15);
    // 10인 초과는 10인으로 클램프
    expect(r10.incomeTax).toBe(r15.incomeTax);
  });

  test('1,000만 원 초과 구간 계산', () => {
    const result = calcTax(12_000_000, 1);
    // 1000만 기준세액 + 200만 × 35%
    expect(result.incomeTax).toBeGreaterThan(2_518_320);
    expect(result.incomeTax).toBe(Math.floor(2_518_320 + 2_000_000 * 0.35));
  });
});
