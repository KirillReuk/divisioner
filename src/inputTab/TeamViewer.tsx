import React, { useEffect, useState } from 'react';
import { Team } from '../utils/types';
import LocationSearchInput from '../LocationSearchInput';
import { fetchCoordinates } from '../utils/geocoding';
import debounce from 'lodash.debounce';
import { DEFAULT_TEAM, MAX_LATITUDE, MAX_LONGITUDE, MIN_LATITUDE, MIN_LONGITUDE } from '../data/constants';
import { Atom } from 'lucide-react';

interface EditableTeamsProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  setShowPresetModal: React.Dispatch<React.SetStateAction<boolean>>;
}

type FieldsToValidate = 'latitude' | 'longitude';

const TeamView: React.FC<EditableTeamsProps> = ({ teams, setTeams, setShowPresetModal }) => {
  const [errors, setErrors] = useState<Record<FieldsToValidate, boolean>>({
    latitude: false,
    longitude: false,
  });
  const [pendingCoords, setPendingCoords] = useState<{ index: number; latitude: number; longitude: number } | null>(
    null
  );

  useEffect(() => {
    if (!pendingCoords) return;

    const debouncedFetch = debounce(() => {
      updateCoordinatesResults(pendingCoords.index, pendingCoords.latitude, pendingCoords.longitude);
    }, 500);

    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [pendingCoords]);

  const handleTeamNameChange = (index: number, value: string) => {
    const updatedTeams = [...teams];
    updatedTeams[index] = { ...updatedTeams[index], name: value };
    setTeams(updatedTeams);
  };

  const handleCoordinatesChange = (index: number, field: keyof Team, value: number) => {
    setTeams(prevTeams => {
      const updatedTeams = [...prevTeams];
      updatedTeams[index] = { ...updatedTeams[index], [field]: value };
      return updatedTeams;
    });

    setPendingCoords(prev => ({
      index,
      latitude: field === 'latitude' ? value : (prev?.latitude ?? teams[index].latitude),
      longitude: field === 'longitude' ? value : (prev?.longitude ?? teams[index].longitude),
    }));
  };

  const validateLatitude = (value: number) =>
    setErrors({ ...errors, latitude: value < MIN_LATITUDE || value > MAX_LATITUDE });
  const validateLongitude = (value: number) =>
    setErrors({ ...errors, longitude: value < MIN_LONGITUDE || value > MAX_LONGITUDE });

  const updateCoordinatesResults = async (index: number, latitude: number, longitude: number) => {
    try {
      const results = await fetchCoordinates(latitude, longitude);
      if (results && results.length > 0) {
        setTeams(prevTeams => {
          const updatedTeams = [...prevTeams];
          updatedTeams[index] = { ...updatedTeams[index], location: results[0].formatted };
          return updatedTeams;
        });
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 shadow-md">
      <button
        onClick={() => setShowPresetModal(true)}
        className="text-sm px-2 bg-white rounded border border-black float-left flex items-center gap-1"
      >
        <Atom className="w-4 h-4" />
        Use a Preset
      </button>
      <h5 className="text-gray-400 mb-4 text-right float-right">{teams.length} teams in total</h5>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="text-lg text-left font-medium p-2 w-1/5">Team Name</th>
            <th className="text-lg text-left font-medium p-2">Location</th>
            <th className="text-lg text-left font-medium p-2 w-1/6">Coordinates</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr className="border-b border-t border-300 border-black" key={index}>
              <td>
                <input
                  type="text"
                  value={team.name}
                  onChange={e => handleTeamNameChange(index, e.target.value)}
                  className="p-2 rounded w-full bg-gray-100 focus:bg-white"
                  placeholder="Team Name"
                />
              </td>
              <td>
                <LocationSearchInput
                  key={'location-search-' + index}
                  index={index}
                  onSelect={(index, location, latitude, longitude) => {
                    const updatedTeams = [...teams];
                    updatedTeams[index] = { ...updatedTeams[index], location, latitude, longitude };
                    setTeams(updatedTeams);
                  }}
                  location={team.location}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={team.latitude}
                  onChange={e => {
                    handleCoordinatesChange(index, 'latitude', parseFloat(e.target.value));
                    validateLatitude(parseFloat(e.target.value));
                  }}
                  className="rounded w-1/2 p-2 bg-gray-100 focus:bg-white"
                  placeholder="Latitude"
                />
                <input
                  type="number"
                  value={team.longitude}
                  onChange={e => {
                    handleCoordinatesChange(index, 'longitude', parseFloat(e.target.value));
                    validateLongitude(parseFloat(e.target.value));
                  }}
                  className="rounded w-1/2 p-2 bg-gray-100 focus:bg-white"
                  placeholder="Longitude"
                />
              </td>
              <td className="text-end">
                <button
                  onClick={() => setTeams(teams.filter((_, i) => i !== index))}
                  className="px-4 bg-white-500 text-black rounded align-middle"
                  aria-label={`Remove team ${team.name}`}
                >
                  x
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => setTeams([...teams, DEFAULT_TEAM])}
        className="w-full mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        <span className="text-xl font-bold">+</span> Add Team
      </button>
    </div>
  );
};

export default TeamView;
