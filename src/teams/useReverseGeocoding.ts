import { useCallback, useEffect, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';
import { CoordinateField, Team } from '../utils/types';
import { fetchCoordinates, normalizeCoordinate } from '../utils/geocoding';
import { hasValidCoords } from './useTeamValidation';
import { LOCATION_SEARCH_DEBOUNCE_MS } from '../data/constants';

type PendingCoords = { teamId: string; latitude: number | null; longitude: number | null };

export function useReverseGeocoding(teams: Team[], setTeams: React.Dispatch<React.SetStateAction<Team[]>>) {
  const pendingRef = useRef<PendingCoords | null>(null);
  const teamsRef = useRef(teams);
  teamsRef.current = teams;
  const setTeamsRef = useRef(setTeams);
  setTeamsRef.current = setTeams;

  const debouncedFetch = useMemo(
    () =>
      debounce(async () => {
        const coords = pendingRef.current;
        if (!coords || !hasValidCoords(coords)) return;

        const results = await fetchCoordinates(
          normalizeCoordinate(coords.latitude),
          normalizeCoordinate(coords.longitude)
        );
        if (results && results.length > 0) {
          setTeamsRef.current(prevTeams =>
            prevTeams.map(team => (team.id === coords.teamId ? { ...team, location: results[0].formatted } : team))
          );
        }
      }, LOCATION_SEARCH_DEBOUNCE_MS),
    []
  );

  useEffect(() => {
    return () => debouncedFetch.cancel();
  }, []);

  const handleCoordinatesChange = useCallback(
    (teamId: string, field: CoordinateField, value: number | null) => {
      const currentTeam = teamsRef.current.find(team => team.id === teamId);
      if (!currentTeam) return;

      setTeamsRef.current(prevTeams =>
        prevTeams.map(team => (team.id === teamId ? { ...team, [field]: value } : team))
      );

      const prev = pendingRef.current;

      if (prev && prev.teamId !== teamId) {
        debouncedFetch.flush();
      }

      pendingRef.current = {
        teamId,
        latitude: field === 'latitude' ? value : prev?.teamId === teamId ? prev.latitude : currentTeam.latitude,
        longitude: field === 'longitude' ? value : prev?.teamId === teamId ? prev.longitude : currentTeam.longitude,
      };

      debouncedFetch();
    },
    [debouncedFetch]
  );

  return { handleCoordinatesChange };
}
