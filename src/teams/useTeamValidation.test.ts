import { describe, expect, it } from 'vitest';
import { getCoordinateError } from './useTeamValidation';
import { MAX_LATITUDE, MAX_LONGITUDE, MIN_LATITUDE, MIN_LONGITUDE } from '../data/constants';

describe('useTeamValidation', () => {
  it('returns no error for valid values', () => {
    const validLatitude = 0;
    const validLongitude = 0;
    expect(getCoordinateError('latitude', validLatitude)).toBe(false);
    expect(getCoordinateError('longitude', validLongitude)).toBe(false);
  });

  it('returns error for invalid values', () => {
    const invalidLatitude = 400;
    const invalidLongitude = -500;
    expect(getCoordinateError('latitude', invalidLatitude)).toBe(true);
    expect(getCoordinateError('longitude', invalidLongitude)).toBe(true);
  });

  it('returns no error for upper boundary values', () => {
    const boundaryLatitude = MAX_LATITUDE;
    const boundaryLongitude = MAX_LONGITUDE;
    expect(getCoordinateError('latitude', boundaryLatitude)).toBe(false);
    expect(getCoordinateError('longitude', boundaryLongitude)).toBe(false);
  });

  it('returns no error for lower boundary values', () => {
    const boundaryLatitude = MIN_LATITUDE;
    const boundaryLongitude = MIN_LONGITUDE;
    expect(getCoordinateError('latitude', boundaryLatitude)).toBe(false);
    expect(getCoordinateError('longitude', boundaryLongitude)).toBe(false);
  });
});
