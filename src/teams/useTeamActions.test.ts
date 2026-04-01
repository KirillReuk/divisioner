import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTeamActions } from './useTeamActions';
import type { Team } from '../utils/types';
import { fetchCoordinates } from '../utils/geocoding';

vi.mock('../utils/geocoding', () => ({
  fetchCoordinates: vi.fn(),
}));

vi.mock('../data/constants', () => ({
  createDefaultTeam: vi.fn(() => ({
    id: 'new-team',
    name: 'New Team',
    location: '',
    latitude: 0,
    longitude: 0,
  })),
}));

const makeTeam = (id: string, overrides: Partial<Team> = {}): Team => ({
  id,
  name: id,
  location: '',
  latitude: 0,
  longitude: 0,
  ...overrides,
});

const flushAsync = async () => new Promise(resolve => setTimeout(resolve, 0));

describe('useTeamActions', () => {
  let teams: Team[];
  let mapPickerTeamId: string | null;
  let actions: ReturnType<typeof useTeamActions>;

  const setTeams: React.Dispatch<React.SetStateAction<Team[]>> = updater => {
    teams = typeof updater === 'function' ? updater(teams) : updater;
  };

  const setMapPickerTeamId: React.Dispatch<React.SetStateAction<string | null>> = updater => {
    mapPickerTeamId = typeof updater === 'function' ? updater(mapPickerTeamId) : updater;
  };

  beforeEach(() => {
    actions = useTeamActions({ setTeams, setMapPickerTeamId });
    teams = [makeTeam('a'), makeTeam('b')];
    mapPickerTeamId = 'a';
    vi.clearAllMocks();
  });

  it('updates a team name', () => {
    actions.handleTeamNameChange('a', 'Alpha');
    expect(teams).toEqual([makeTeam('a', { name: 'Alpha' }), makeTeam('b')]);
  });

  it('updates selected location and coordinates', () => {
    const newPlace = { location: 'Paris, France', latitude: 48.8566, longitude: 2.3522 };
    actions.handleLocationSelect('b', newPlace.location, newPlace.latitude, newPlace.longitude);
    expect(teams).toEqual([makeTeam('a'), makeTeam('b', newPlace)]);
  });

  it('sets map picker focus and can close it', () => {
    actions.handleLocationFocus('b');
    expect(mapPickerTeamId).toBe('b');
    actions.handleCloseMapPicker();
    expect(mapPickerTeamId).toBeNull();
  });

  it('removes a team and clears map picker', () => {
    actions.handleRemoveTeam('a');
    expect(teams).toEqual([makeTeam('b')]);
    expect(mapPickerTeamId).toBeNull();
  });

  it('adds a default team and clears map picker', () => {
    actions.handleAddTeam();
    expect(teams).toEqual([makeTeam('a'), makeTeam('b'), makeTeam('new-team', { name: 'New Team' })]);
    expect(mapPickerTeamId).toBeNull();
  });

  it('map pick rounds to 3 decimals, fetches formatted location, and updates selected team', async () => {
    const coordinates = { latitude: 1.23456, longitude: 2.98765 };
    const roundedCoordinates = {
      latitude: parseFloat(coordinates.latitude.toFixed(3)),
      longitude: parseFloat(coordinates.longitude.toFixed(3)),
    };

    vi.mocked(fetchCoordinates).mockResolvedValueOnce([{ formatted: 'Rounded Place', geometry: { lat: 0, lng: 0 } }]);
    const onPick = actions.createMapPickHandler('a');

    onPick(coordinates.latitude, coordinates.longitude);
    await flushAsync();

    expect(fetchCoordinates).toHaveBeenCalledWith(roundedCoordinates.latitude, roundedCoordinates.longitude);
    expect(teams).toEqual([
      makeTeam('a', {
        latitude: roundedCoordinates.latitude,
        longitude: roundedCoordinates.longitude,
        location: 'Rounded Place',
      }),
      makeTeam('b'),
    ]);
  });

  it('map pick does not update teams when geocoding returns no results', async () => {
    vi.mocked(fetchCoordinates).mockResolvedValueOnce(null);

    actions.createMapPickHandler('a')(10, 20);
    await flushAsync();

    expect(teams).toEqual([makeTeam('a'), makeTeam('b')]);
  });
});
