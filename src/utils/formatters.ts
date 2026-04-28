/**
 * 금액을 한국식 콤마 포맷으로 변환
 * 예) 3000000 → "3,000,000"
 */
export function formatCurrency(amount: number): string {
  return Math.floor(amount).toLocaleString('ko-KR');
}

/**
 * 시간 문자열 변환 (HH:mm)
 * @param time    "HH:mm" 형식
 * @param use24h  true: 24시간제, false: 12시간제
 */
export function formatTime(time: string, use24h: boolean): string {
  if (!time || !time.includes(':')) return time;

  const [hourStr, minute] = time.split(':');
  const hour = parseInt(hourStr, 10);

  if (use24h) {
    return `${String(hour).padStart(2, '0')}:${minute}`;
  }

  const period = hour < 12 ? '오전' : '오후';
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${period} ${h12}:${minute}`;
}

/**
 * 분 → "N시간 M분" 형식
 */
export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

/**
 * YYYY-MM-DD → "YYYY년 MM월 DD일"
 */
export function formatDate(date: string): string {
  const [y, m, d] = date.split('-');
  return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일`;
}

/**
 * 퍼센트 포맷
 */
export function formatPercent(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}
