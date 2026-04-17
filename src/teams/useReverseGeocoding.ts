import { useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import { CoordinateField, Team } from '../utils/types';
import { fetchCoordinates } from '../utils/geocoding';
import { isValidCoords } from './useTeamValidation';

type PendingCoords = { teamId: string; latitude: number; longitude: number };

export function useReverseGeocoding(teams: Team[], setTeams: React.Dispatch<React.SetStateAction<Team[]>>) {
  const pendingRef = useRef<PendingCoords | null>(null);
  const setTeamsRef = useRef(setTeams);
  setTeamsRef.current = setTeams;

  const debouncedFetch = useRef(
    debounce(async () => {
      const coords = pendingRef.current;
      if (!coords || !isValidCoords(coords.latitude, coords.longitude)) return;

      const results = await fetchCoordinates(coords.latitude, coords.longitude);
      if (results && results.length > 0) {
        setTeamsRef.current(prevTeams =>
          prevTeams.map(team => (team.id === coords.teamId ? { ...team, location: results[0].formatted } : team))
        );
      }
    }, 500)
  ).current;

  useEffect(() => {
    return () => debouncedFetch.cancel();
  }, []);

  const handleCoordinatesChange = (teamId: string, field: CoordinateField, value: number) => {
    const currentTeam = teams.find(team => team.id === teamId);
    if (!currentTeam) return;

    setTeams(prevTeams => prevTeams.map(team => (team.id === teamId ? { ...team, [field]: value } : team)));

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
  };

  return { handleCoordinatesChange };
}
