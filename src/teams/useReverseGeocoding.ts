import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { CoordinateField, Team } from '../utils/types';
import { fetchCoordinates } from '../utils/geocoding';

type PendingCoords = { teamId: string; latitude: number; longitude: number } | null;

export function useReverseGeocoding(teams: Team[], setTeams: React.Dispatch<React.SetStateAction<Team[]>>) {
  const [pendingCoords, setPendingCoords] = useState<PendingCoords>(null);

  useEffect(() => {
    if (!pendingCoords) return;

    const debouncedFetch = debounce(() => {
      void updateCoordinatesResults(pendingCoords.teamId, pendingCoords.latitude, pendingCoords.longitude);
    }, 500);

    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [pendingCoords]);

  const updateCoordinatesResults = async (teamId: string, latitude: number, longitude: number) => {
    const results = await fetchCoordinates(latitude, longitude);
    if (results && results.length > 0) {
      setTeams(prevTeams => {
        return prevTeams.map(team => (team.id === teamId ? { ...team, location: results[0].formatted } : team));
      });
    }
  };

  const handleCoordinatesChange = (teamId: string, field: CoordinateField, value: number) => {
    const currentTeam = teams.find(team => team.id === teamId);
    if (!currentTeam) return;

    setTeams(prevTeams => prevTeams.map(team => (team.id === teamId ? { ...team, [field]: value } : team)));

    setPendingCoords(prev => ({
      teamId,
      latitude: field === 'latitude' ? value : (prev?.latitude ?? currentTeam.latitude),
      longitude: field === 'longitude' ? value : (prev?.longitude ?? currentTeam.longitude),
    }));
  };

  return { handleCoordinatesChange };
}
