import React, { useEffect, useState } from 'react';
import { Team } from '../data/teams';
import LocationSearchInput from '../LocationSearchInput';
import { fetchCoordinates } from '../utils/geocoding';
import debounce from 'lodash.debounce';

interface EditableTeamsProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

type FieldsToValidate = 'latitude' | 'longitude';

const TeamView: React.FC<EditableTeamsProps> = ({ teams, setTeams }) => {
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

  const validateLatitude = (value: number) => setErrors({ ...errors, latitude: value < -90 || value > 90 });
  const validateLongitude = (value: number) => setErrors({ ...errors, longitude: value < -180 || value > 180 });

  const updateCoordinatesResults = async (index: number, latitude: number, longitude: number) => {
    const results = await fetchCoordinates(latitude, longitude);
    if (results) {
      setTeams(prevTeams => {
        const updatedTeams = [...prevTeams];
        updatedTeams[index] = { ...updatedTeams[index], location: results[0].formatted };
        return updatedTeams;
      });
    }
  };

  return (
    <div className="p-4 bg-gray-100 shadow-md">
      <h2 className="text-2xl font-bold">Teams</h2>
      <h5 className="text-gray-400 mb-4">({teams.length} teams in total)</h5>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="text-lg text-left font-medium p-2">Team Name</th>
            <th className="text-lg text-left font-medium p-2 w-2/5">Location</th>
            <th className="text-lg text-left font-medium p-2">Latitude</th>
            <th className="text-lg text-left font-medium p-2">Longitude</th>
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
                  initialLocation={team.location}
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
                  className="rounded w-full p-2 bg-gray-100 focus:bg-white"
                  placeholder="Latitude"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={team.longitude}
                  onChange={e => {
                    handleCoordinatesChange(index, 'longitude', parseFloat(e.target.value));
                    validateLongitude(parseFloat(e.target.value));
                  }}
                  className="rounded w-full p-2 bg-gray-100 focus:bg-white"
                  placeholder="Longitude"
                />
              </td>
              <td>
                <button
                  onClick={() => setTeams(teams.filter((_, i) => i !== index))}
                  className="px-3 bg-white-500 text-black rounded align-middle"
                >
                  x
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => setTeams([...teams, { name: 'New Team', location: '', latitude: 0, longitude: 0 }])}
        className="w-full mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        <span className="text-xl font-bold">+</span> Add Team
      </button>
    </div>
  );
};

export default TeamView;
