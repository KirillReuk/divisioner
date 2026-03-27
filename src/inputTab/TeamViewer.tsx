import React from 'react';
import { Team } from '../utils/types';
import LocationSearchInput from '../LocationSearchInput';
import { fetchCoordinates } from '../utils/geocoding';
import { createDefaultTeam, MAX_LATITUDE, MAX_LONGITUDE, MIN_LATITUDE, MIN_LONGITUDE } from '../data/constants';
import { Atom, X } from 'lucide-react';
import clsx from 'clsx';
import { useTeamValidation } from './useTeamValidation';
import { useReverseGeocoding } from './useReverseGeocoding';
import TeamMapPicker from './TeamMapPicker';

interface EditableTeamsProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  setShowPresetModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRivalry: React.Dispatch<React.SetStateAction<boolean>>;
  mapPickerTeamId: string | null;
  setMapPickerTeamId: React.Dispatch<React.SetStateAction<string | null>>;
}

const TeamView: React.FC<EditableTeamsProps> = ({
  teams,
  setTeams,
  setShowPresetModal,
  setShowRivalry,
  mapPickerTeamId,
  setMapPickerTeamId,
}) => {
  const { errorsById, validateLatLng, getAriaPropsForField } = useTeamValidation(teams);
  const { handleCoordinatesChange } = useReverseGeocoding(teams, setTeams);
  const parentRowRef = React.useRef<HTMLTableRowElement | null>(null);
  const mapRowRef = React.useRef<HTMLTableRowElement | null>(null);

  React.useEffect(() => {
    if (!mapPickerTeamId) return;

    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const clickedInsideParentRow = Boolean(parentRowRef.current?.contains(target));
      const clickedInsideMapRow = Boolean(mapRowRef.current?.contains(target));
      if (!clickedInsideParentRow && !clickedInsideMapRow) {
        setMapPickerTeamId(null);
      }
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () => document.removeEventListener('mousedown', handleDocumentMouseDown);
  }, [mapPickerTeamId, setMapPickerTeamId]);

  const handleTeamNameChange = (teamId: string, value: string) =>
    setTeams(prevTeams => prevTeams.map(team => (team.id === teamId ? { ...team, name: value } : team)));

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

  return (
    <div className="p-4 bg-gray-100 shadow-md">
      <div className="relative mb-4">
        <h2 className="text-2xl font-bold">Teams</h2>
        <h5 className="absolute left-0 top-0 text-gray-400 text-right">{teams.length} teams in total</h5>{' '}
      </div>
      <div className="flex justify-between items-center">
        <div className="float-left">
          <button
            onClick={() => setShowPresetModal(true)}
            className="text-sm px-2 bg-white rounded border border-black flex items-center gap-1"
          >
            <Atom className="w-4 h-4" />
            Use a Preset
          </button>
        </div>
        <button
          onClick={() => setShowRivalry(true)}
          className="text-sm px-2 bg-white rounded border border-black flex items-center gap-1 float-right"
        >
          <Atom className="w-4 h-4" />
          {'Open Rivalries'}
        </button>
      </div>
      <table className="table-fixed max-w-full w-full transition-all duration-300">
        <colgroup>
          <col className="w-[20%]" />
          <col className="w-[55%]" />
          <col className="w-[20%]" />
          <col className="w-[5%]" />
        </colgroup>
        <thead>
          <tr>
            <th className="text-lg text-left font-medium p-2 w-1/2">Team Name</th>
            <th className="text-lg text-left font-medium p-2">Location</th>
            <th className="text-lg text-left font-medium p-2 w-1/6">Coordinates</th>
            <th className=""></th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => (
            <React.Fragment key={team.id}>
              <tr
                ref={mapPickerTeamId === team.id ? parentRowRef : undefined}
                className="border-b border-t border-300 border-black last:border-b-0"
              >
                <td>
                  <input
                    type="text"
                    name={`team-name-${team.id}`}
                    value={team.name}
                    onChange={e => handleTeamNameChange(team.id, e.target.value)}
                    className="p-2 rounded w-full bg-gray-100 focus:bg-white hover:bg-white duration-300 ease-out"
                    placeholder="Team Name"
                  />
                </td>
                <td>
                  <LocationSearchInput
                    key={`location-search-${team.id}`}
                    teamId={team.id}
                    onSelect={(teamId, location, latitude, longitude) =>
                      setTeams(prevTeams =>
                        prevTeams.map(currentTeam =>
                          currentTeam.id === teamId ? { ...currentTeam, location, latitude, longitude } : currentTeam
                        )
                      )
                    }
                    location={team.location}
                    onFocus={() => setMapPickerTeamId(team.id)}
                  />
                </td>
                <td>
                  <div className="flex flex-col">
                    <div className="flex">
                      <input
                        type="number"
                        name={`latitude-${team.id}`}
                        value={team.latitude}
                        min={MIN_LATITUDE}
                        max={MAX_LATITUDE}
                        step="0.001"
                        onChange={e => {
                          const value = parseFloat(e.target.value);
                          validateLatLng(team.id, 'latitude', value);
                          handleCoordinatesChange(team.id, 'latitude', value);
                        }}
                        {...getAriaPropsForField(team.id, 'latitude')}
                        className={clsx(
                          'rounded w-1/2 p-2 bg-gray-100 focus:bg-white hover:bg-white duration-300 ease-out',
                          { 'border-2 border-red-500': errorsById[team.id]?.latitude }
                        )}
                        placeholder="Latitude"
                      />
                      <input
                        type="number"
                        name={`longitude-${team.id}`}
                        value={team.longitude}
                        min={MIN_LONGITUDE}
                        max={MAX_LONGITUDE}
                        step="0.001"
                        onChange={e => {
                          const value = parseFloat(e.target.value);
                          validateLatLng(team.id, 'longitude', value);
                          handleCoordinatesChange(team.id, 'longitude', value);
                        }}
                        {...getAriaPropsForField(team.id, 'longitude')}
                        className={clsx(
                          'rounded w-1/2 p-2 bg-gray-100 focus:bg-white hover:bg-white duration-300 ease-out',
                          { 'border-2 border-red-500': errorsById[team.id]?.longitude }
                        )}
                        placeholder="Longitude"
                      />
                    </div>
                  </div>
                </td>
                <td className="text-end">
                  <button
                    type="button"
                    onClick={() => {
                      setTeams(prevTeams => prevTeams.filter(currentTeam => currentTeam.id !== team.id));
                      setMapPickerTeamId(null);
                    }}
                    className="inline-flex items-center justify-center rounded p-1 text-gray-800 hover:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    aria-label={`Remove team ${team.name}`}
                    title="Remove team"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </td>
              </tr>
              {mapPickerTeamId === team.id && (
                <tr ref={mapPickerTeamId === team.id ? mapRowRef : undefined}>
                  <td colSpan={4}>
                    <TeamMapPicker
                      latitude={team.latitude}
                      longitude={team.longitude}
                      onPick={(lat, lng) =>
                        handleMapPick(team.id, parseFloat(lat.toFixed(3)), parseFloat(lng.toFixed(3)))
                      }
                      onClose={() => setMapPickerTeamId(null)}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => {
          setTeams(prevTeams => [...prevTeams, createDefaultTeam()]);
          setMapPickerTeamId(null);
        }}
        className="w-full mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        <span className="text-xl font-bold">+</span> Add Team
      </button>
    </div>
  );
};

export default TeamView;
