import React, { useEffect, useState } from 'react';
import { Team } from '../utils/types';
import LocationSearchInput from '../LocationSearchInput';
import { fetchCoordinates } from '../utils/geocoding';
import debounce from 'lodash.debounce';
import { createDefaultTeam, MAX_LATITUDE, MAX_LONGITUDE, MIN_LATITUDE, MIN_LONGITUDE } from '../data/constants';
import { Atom, X } from 'lucide-react';
import clsx from 'clsx';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { useTeamValidation } from './useTeamValidation';

interface EditableTeamsProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  setShowPresetModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRivalry: React.Dispatch<React.SetStateAction<boolean>>;
  mapPickerTeamId: string | null;
  setMapPickerTeamId: React.Dispatch<React.SetStateAction<string | null>>;
}

const MapClickHandler: React.FC<{
  onClick: (lat: number, lng: number) => void;
}> = ({ onClick }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onClick(lat, lng);
    },
  });
  return null;
};

const TeamView: React.FC<EditableTeamsProps> = ({
  teams,
  setTeams,
  setShowPresetModal,
  setShowRivalry,
  mapPickerTeamId,
  setMapPickerTeamId,
}) => {
  const { errorsById, validateLatLng, ariaPropsForField } = useTeamValidation(teams);
  const [pendingCoords, setPendingCoords] = useState<{ teamId: string; latitude: number; longitude: number } | null>(
    null
  );

  useEffect(() => {
    if (!pendingCoords) return;

    const debouncedFetch = debounce(() => {
      updateCoordinatesResults(pendingCoords.teamId, pendingCoords.latitude, pendingCoords.longitude);
    }, 500);

    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [pendingCoords]);

  const handleTeamNameChange = (teamId: string, value: string) =>
    setTeams(prevTeams => prevTeams.map(team => (team.id === teamId ? { ...team, name: value } : team)));

  const handleCoordinatesChange = (teamId: string, field: 'latitude' | 'longitude', value: number) => {
    const currentTeam = teams.find(team => team.id === teamId);
    if (!currentTeam) return;

    setTeams(prevTeams => {
      return prevTeams.map(team => (team.id === teamId ? { ...team, [field]: value } : team));
    });

    setPendingCoords(prev => ({
      teamId,
      latitude: field === 'latitude' ? value : (prev?.latitude ?? currentTeam.latitude),
      longitude: field === 'longitude' ? value : (prev?.longitude ?? currentTeam.longitude),
    }));
  };

  const updateCoordinatesResults = async (teamId: string, latitude: number, longitude: number) => {
    try {
      const results = await fetchCoordinates(latitude, longitude);
      if (results && results.length > 0) {
        setTeams(prevTeams => {
          return prevTeams.map(team => (team.id === teamId ? { ...team, location: results[0].formatted } : team));
        });
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const handleMapPick = async (teamId: string, lat: number, lng: number) => {
    const results = await fetchCoordinates(lat, lng);
    if (results) {
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
              <tr className="border-b border-t border-300 border-black last:border-b-0">
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
                        {...ariaPropsForField(team.id, 'latitude')}
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
                        {...ariaPropsForField(team.id, 'longitude')}
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
                <tr>
                  <td colSpan={4}>
                    <div className="relative h-96 w-full rounded border mt-2 overflow-hidden">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setMapPickerTeamId(null);
                        }}
                        className="absolute right-2 top-2 z-[1000] inline-flex items-center justify-center rounded bg-white/90 p-1 text-gray-800 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                        aria-label="Close map"
                        title="Close map"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <MapContainer
                        center={[team.latitude, team.longitude]}
                        zoom={4}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapClickHandler
                          onClick={(lat, lng) =>
                            handleMapPick(team.id, parseFloat(lat.toFixed(3)), parseFloat(lng.toFixed(3)))
                          }
                        />
                        <Marker position={[team.latitude, team.longitude]} />
                      </MapContainer>
                    </div>
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
