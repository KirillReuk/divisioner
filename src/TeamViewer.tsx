import React, { useEffect, useState } from 'react';
import { Team } from './data/teams';
import LocationSearchInput from './LocationSearchInput';
import { fetchCoordinates } from './utils/geocoding';
import debounce from 'lodash.debounce';

interface EditableTeamsProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

type InputMode = 'location' | 'coordinates';
type FieldsToValidate = 'latitude' | 'longitude';

const TeamView: React.FC<EditableTeamsProps> = ({ teams, setTeams }) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [inputMode, setInputMode] = useState<InputMode[]>(Array(teams.length).fill('location'));
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

  const handleModeChange = (index: number) => {
    const updatedMode = [...inputMode];
    updatedMode[index] = updatedMode[index] === 'location' ? 'coordinates' : 'location';
    setInputMode(updatedMode);
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
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold">Teams</h2>
      <h5 className="text-gray-400 mb-4">({teams.length} teams in total)</h5>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="w-1/3 border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="w-full border border-gray-300 px-4 py-2 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <>
                <tr key={index} className="hover:bg-gray-100">
                  <td>
                    <input
                      type="text"
                      value={team.name}
                      onChange={e => handleTeamNameChange(index, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-400"
                      placeholder="Team Name"
                    />
                  </td>
                  <td>
                    {inputMode[index] === 'location' ? (
                      <LocationSearchInput
                        key={'location-search-' + index}
                        index={index}
                        onSelect={(index, _, lat, lng) => {
                          const updatedTeams = [...teams];
                          updatedTeams[index] = { ...updatedTeams[index], latitude: lat, longitude: lng };
                          setTeams(updatedTeams);
                        }}
                        onFocus={() => setFocusedIndex(index)}
                        initialLocation={team.location}
                      />
                    ) : (
                      <div className="flex gap-1">
                        <input
                          type="number"
                          value={team.latitude}
                          onChange={e => {
                            handleCoordinatesChange(index, 'latitude', parseFloat(e.target.value));
                            validateLatitude(parseFloat(e.target.value));
                          }}
                          className={`w-1/2 px-2 py-1 border ${errors.latitude ? 'border-red-600' : 'border-gray-400'}`}
                          placeholder="Latitude"
                        />
                        <input
                          type="number"
                          value={team.longitude}
                          onChange={e => {
                            handleCoordinatesChange(index, 'longitude', parseFloat(e.target.value));
                            validateLongitude(parseFloat(e.target.value));
                          }}
                          className={`w-1/2 px-2 py-1 border ${errors.longitude ? 'border-red-600' : 'border-gray-400'}`}
                          placeholder="Longitude"
                        />
                      </div>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => setTeams(teams.filter((_, i) => i !== index))}
                      className="bg-red-500 text-white px-2 py-1 font-bold text-xl"
                    >
                      -
                    </button>
                  </td>
                </tr>
                {focusedIndex === index && (
                  <tr>
                    <td colSpan={2}>
                      <p className="mb-2 ml-2 text-start">
                        {inputMode[index] === 'location' ? (
                          <>
                            <span className="font-bold">Latitude:</span> {team.latitude.toFixed(4)}{' '}
                            <span className="font-bold">Longitude:</span> {team.longitude.toFixed(4)}
                          </>
                        ) : (
                          <>
                            <span className="font-bold">Location:</span> {team.location}
                          </>
                        )}
                        <span className="float-end">
                          <input
                            type="checkbox"
                            checked={inputMode[index] === 'coordinates'}
                            onChange={() => handleModeChange(index)}
                            className="form-checkbox"
                          />{' '}
                          <span>{inputMode[index] === 'location' ? 'Input Coordinates' : 'Input Locations'}</span>
                        </span>
                      </p>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {
              <tr key="addButton" className="hover:bg-gray-100">
                <td colSpan={4}>
                  <button
                    onClick={() => setTeams([...teams, { name: 'New Team', location: '', latitude: 0, longitude: 0 }])}
                    className="w-full bg-green-500 text-white px-4 py-2"
                  >
                    Add Team
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamView;
