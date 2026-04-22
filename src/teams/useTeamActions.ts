import { useCallback, useEffect, useRef } from 'react';
import { createDefaultTeam } from '../data/constants';
import { fetchCoordinates, normalizeCoordinate } from '../utils/geocoding';
import { Team } from '../utils/types';

interface UseTeamActionsParams {
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  setMapPickerTeamId: React.Dispatch<string | null>;
}

export function useAbortableLatest() {
  const latestRequestController = useRef<AbortController | null>(null);
  useEffect(() => () => latestRequestController.current?.abort(), []);

  return useCallback(() => {
    latestRequestController.current?.abort();
    const currentController = new AbortController();
    latestRequestController.current = currentController;
    return currentController.signal;
  }, []);
}

export function useTeamActions({ setTeams, setMapPickerTeamId }: UseTeamActionsParams) {
  const latestControllerSignal = useAbortableLatest();

  const handleTeamNameChange = useCallback(
    (teamId: string, value: string) => {
      setTeams(prevTeams => prevTeams.map(team => (team.id === teamId ? { ...team, name: value } : team)));
    },
    [setTeams]
  );

  const handleLocationSelect = useCallback(
    (teamId: string, location: string, latitude: number, longitude: number) => {
      setTeams(prevTeams =>
        prevTeams.map(currentTeam =>
          currentTeam.id === teamId ? { ...currentTeam, location, latitude, longitude } : currentTeam
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

      const signal = latestControllerSignal();
      const results = await fetchCoordinates(normalizeCoordinate(lat), normalizeCoordinate(lng), signal);
      if (signal.aborted) return;

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
