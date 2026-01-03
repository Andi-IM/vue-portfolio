import { describe, it, expect } from 'vitest';
import { useDate } from '../useDate';

describe('useDate', () => {
  const { formatDate } = useDate();

  it('formats a date string correctly', () => {
    const dateStr = '2023-01-01T12:00:00Z';
    // Quasar format defaults to YYYY/MM/DD
    expect(formatDate(dateStr)).toBe('2023/01/01');
  });

  it('formats a date object correctly', () => {
    const d = new Date('2023-12-25T10:30:00');
    expect(formatDate(d)).toBe('2023/12/25');
  });

  it('supports custom formats', () => {
    const dateStr = '2023-05-15';
    expect(formatDate(dateStr, 'DD-MM-YYYY')).toBe('15-05-2023');
    expect(formatDate(dateStr, 'MMM D, YYYY')).toBe('May 15, 2023');
  });
});
