/** @vitest-environment jsdom */

import { useState } from 'react';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useReverseGeocoding } from './useReverseGeocoding';
import { fetchCoordinates } from '../utils/geocoding';
import type { Team } from '../utils/types';

vi.mock('../utils/geocoding', () => ({
  fetchCoordinates: vi.fn(),
}));

const makeTeam = (id: string, latitude: number, longitude: number, location = ''): Team => ({
  id,
  name: id,
  location,
  latitude,
  longitude,
});

function useTestHarness(initialTeams: Team[]) {
  const [teams, setTeams] = useState(initialTeams);
  const { handleCoordinatesChange } = useReverseGeocoding(teams, setTeams);
  return { teams, handleCoordinatesChange };
}

describe('useReverseGeocoding', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.mocked(fetchCoordinates).mockReset();
  });

  it('does nothing when the team id is not found', () => {
    const initial = [makeTeam('a', 0, 0)];
    const { result } = renderHook(() => useTestHarness(initial));

    act(() => {
      result.current.handleCoordinatesChange('missing', 'latitude', 5);
    });

    expect(result.current.teams).toEqual(initial);
    expect(vi.mocked(fetchCoordinates)).not.toHaveBeenCalled();
  });

  it('updates the team coordinate immediately, and updates location after debounce when handleCoordinatesChange runs', async () => {
    const formattedLocation = 'Paris, France';
    vi.mocked(fetchCoordinates).mockResolvedValue([
      { formatted: formattedLocation, geometry: { lat: 48.8566, lng: 2.3522 } },
    ]);

    const { result } = renderHook(() => useTestHarness([makeTeam('a', 10, 20)]));

    act(() => {
      result.current.handleCoordinatesChange('a', 'latitude', 11);
    });
    expect(result.current.teams[0]).toMatchObject({ id: 'a', latitude: 11, longitude: 20 });

    await act(async () => {
      vi.advanceTimersByTime(500);
      await Promise.resolve();
    });

    expect(result.current.teams[0].location).toBe(formattedLocation);
    expect(vi.mocked(fetchCoordinates)).toHaveBeenCalledWith(11, 20);
  });

  it('does not change location when geocoding returns null or empty results', async () => {
    vi.mocked(fetchCoordinates).mockResolvedValueOnce(null);

    const { result } = renderHook(() => useTestHarness([makeTeam('a', 1, 2, 'Old')]));

    act(() => {
      result.current.handleCoordinatesChange('a', 'longitude', 3);
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.teams[0].location).toBe('Old');

    vi.mocked(fetchCoordinates).mockResolvedValueOnce([]);
    act(() => {
      result.current.handleCoordinatesChange('a', 'longitude', 4);
    });
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.teams[0].location).toBe('Old');
  });

  it('cancels the previous debounced fetch when coordinates change again before the wait elapses', async () => {
    vi.mocked(fetchCoordinates).mockResolvedValue([{ formatted: 'Final', geometry: { lat: 0, lng: 0 } }]);

    const { result } = renderHook(() => useTestHarness([makeTeam('a', 1, 2)]));

    act(() => {
      result.current.handleCoordinatesChange('a', 'latitude', 10);
    });
    act(() => {
      result.current.handleCoordinatesChange('a', 'latitude', 20);
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
      await Promise.resolve();
    });

    expect(result.current.teams[0].location).toBe('Final');
    expect(vi.mocked(fetchCoordinates)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(fetchCoordinates)).toHaveBeenCalledWith(20, 2);
  });
});
