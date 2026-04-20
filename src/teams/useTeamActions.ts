import { useCallback } from 'react';
import { createDefaultTeam } from '../data/constants';
import { fetchCoordinates, normalizeCoordinate } from '../utils/geocoding';
import { Team } from '../utils/types';

interface UseTeamActionsParams {
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  setMapPickerTeamId: React.Dispatch<string | null>;
}

export function useTeamActions({ setTeams, setMapPickerTeamId }: UseTeamActionsParams) {
  const handleTeamNameChange = useCallback(
    (teamId: string, value: string) => {
      setTeams(prevTeams => prevTeams.map(team => (team.id === teamId ? { ...team, name: value } : team)));
    },
    [setTeams]
  );

  const handleLocationSelect = useCallback(
    (teamId: string, location: string, latitude: number, longitude: number) => {
      const lat = parseFloat(latitude.toFixed(3));
      const lng = parseFloat(longitude.toFixed(3));
      setTeams(prevTeams =>
        prevTeams.map(currentTeam =>
          currentTeam.id === teamId ? { ...currentTeam, location, latitude: lat, longitude: lng } : currentTeam
        )
      );
    },
    [setTeams]
  );

  const handleLocationFocus = useCallback((teamId: string) => setMapPickerTeamId(teamId), [setMapPickerTeamId]);

  const handleRemoveTeam = useCallback(
    (teamId: string) => {
      setTeams(prevTeams => prevTeams.filter(currentTeam => currentTeam.id !== teamId));
      setMapPickerTeamId(null);
    },
    [setMapPickerTeamId, setTeams]
  );

  const handleAddTeam = useCallback(() => {
    setTeams(prevTeams => [...prevTeams, createDefaultTeam()]);
    setMapPickerTeamId(null);
  }, [setMapPickerTeamId, setTeams]);

  const handleCloseMapPicker = useCallback(() => setMapPickerTeamId(null), [setMapPickerTeamId]);

  const createMapPickHandler = useCallback(
    (teamId: string) => async (lat: number, lng: number) => {
      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.id === teamId
            ? {
                ...team,
                latitude: lat,
                longitude: lng,
              }
            : team
        )
      );
      const results = await fetchCoordinates(normalizeCoordinate(lat), normalizeCoordinate(lng));
      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.id === teamId
            ? {
                ...team,
                latitude: lat,
                longitude: lng,
                location: results?.[0]?.formatted || 'Could not fetch location name',
              }
            : team
        )
      );
    },
    [setTeams]
  );

  return {
    handleTeamNameChange,
    handleLocationSelect,
    handleLocationFocus,
    handleRemoveTeam,
    handleAddTeam,
    handleCloseMapPicker,
    createMapPickHandler,
  };
}
