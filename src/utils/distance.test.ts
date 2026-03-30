import { describe, expect, it } from 'vitest';
import { haversineDistance } from './distance';

describe('haversineDistance', () => {
  it('returns 0 for identical points', () => {
    expect(haversineDistance(40.7128, -74.006, 40.7128, -74.006)).toBe(0);
  });

  it('matches great-circle distance along the equator (1° longitude)', () => {
    // ~ (π/180) * R km
    const expected = (Math.PI / 180) * 6371;
    expect(haversineDistance(0, 0, 0, 1)).toBeCloseTo(expected, 5);
  });

  it('is the same when the two points are swapped', () => {
    const a = haversineDistance(51.5074, -0.1278, 48.8566, 2.3522);
    const b = haversineDistance(48.8566, 2.3522, 51.5074, -0.1278);
    expect(a).toBeCloseTo(b, 10);
  });
});
