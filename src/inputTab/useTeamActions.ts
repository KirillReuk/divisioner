import { createDefaultTeam } from '../data/constants';
import { fetchCoordinates } from '../utils/geocoding';
import { Team } from '../utils/types';

interface UseTeamActionsParams {
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  setMapPickerTeamId: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useTeamActions({ setTeams, setMapPickerTeamId }: UseTeamActionsParams) {
  const handleTeamNameChange = (teamId: string, value: string) => {
    setTeams(prevTeams => prevTeams.map(team => (team.id === teamId ? { ...team, name: value } : team)));
  };

  const handleLocationSelect = (teamId: string, location: string, latitude: number, longitude: number) => {
    setTeams(prevTeams =>
      prevTeams.map(currentTeam =>
        currentTeam.id === teamId ? { ...currentTeam, location, latitude, longitude } : currentTeam
      )
    );
  };

  const handleLocationFocus = (teamId: string) => setMapPickerTeamId(teamId);

  const handleRemoveTeam = (teamId: string) => {
    setTeams(prevTeams => prevTeams.filter(currentTeam => currentTeam.id !== teamId));
    setMapPickerTeamId(null);
  };

  const handleAddTeam = () => {
    setTeams(prevTeams => [...prevTeams, createDefaultTeam()]);
    setMapPickerTeamId(null);
  };

  const handleCloseMapPicker = () => setMapPickerTeamId(null);

  const handleMapPick = async (teamId: string, lat: number, lng: number) => {
    const results = await fetchCoordinates(lat, lng);
    if (results?.[0]) {
      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.id === teamId ? { ...team, latitude: lat, longitude: lng, location: results[0].formatted } : team
        )
      );
    }
  };

  const createMapPickHandler = (teamId: string) => (lat: number, lng: number) => {
    void handleMapPick(teamId, parseFloat(lat.toFixed(3)), parseFloat(lng.toFixed(3)));
  };

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
