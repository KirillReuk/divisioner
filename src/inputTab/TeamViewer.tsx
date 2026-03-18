import React, { useEffect, useState } from 'react';
import { Team } from '../utils/types';
import LocationSearchInput from '../LocationSearchInput';
import { fetchCoordinates } from '../utils/geocoding';
import debounce from 'lodash.debounce';
import { DEFAULT_TEAM, MAX_LATITUDE, MAX_LONGITUDE, MIN_LATITUDE, MIN_LONGITUDE } from '../data/constants';
import { Atom, X } from 'lucide-react';
import clsx from 'clsx';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

interface EditableTeamsProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  setShowPresetModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRivalry: React.Dispatch<React.SetStateAction<boolean>>;
  showRivalry?: boolean;
  mapPickerIndex: number | null;
  setMapPickerIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

type FieldsToValidate = 'latitude' | 'longitude';

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
  showRivalry,
  mapPickerIndex,
  setMapPickerIndex,
}) => {
  const [errors, setErrors] = useState<Record<number, Record<FieldsToValidate, boolean>>>({});
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

  const validateLatitude = (index: number, value: number) =>
    setErrors(prev => ({
      ...prev,
      [index]: { ...prev[index], latitude: value < MIN_LATITUDE || value > MAX_LATITUDE || isNaN(value) },
    }));
  const validateLongitude = (index: number, value: number) =>
    setErrors(prev => ({
      ...prev,
      [index]: { ...prev[index], longitude: value < MIN_LONGITUDE || value > MAX_LONGITUDE || isNaN(value) },
    }));

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

  const handleMapPick = async (index: number, lat: number, lng: number) => {
    const results = await fetchCoordinates(lat, lng);
    if (results) {
      const updatedTeams = [...teams];
      updatedTeams[index] = {
        ...updatedTeams[index],
        latitude: lat,
        longitude: lng,
        location: results[0].formatted,
      };
      setTeams(updatedTeams);
    }
  };

  return (
    <div className={clsx('p-4 bg-gray-100 shadow-md', { 'w-fit': showRivalry })}>
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
          onClick={() => setShowRivalry(showRivalry => !showRivalry)}
          className="text-sm px-2 bg-white rounded border border-black flex items-center gap-1 float-right"
        >
          <Atom className="w-4 h-4" />
          {`${showRivalry ? 'Close' : 'Open'} Rivalries`}
        </button>
      </div>
      <table
        className={clsx(
          'table-fixed transition-all duration-300',
          !showRivalry ? 'max-w-full w-full' : 'max-w-[34rem]'
        )}
      >
        <colgroup>
          <col className={clsx(showRivalry ? 'w-[50%]' : 'w-[20%]')} />
          <col className={clsx({ hidden: showRivalry }, 'w-[55%]')} />
          <col className={clsx(showRivalry ? 'w-[45%]' : 'w-[20%]')} />
          <col className="w-[5%]" />
        </colgroup>
        <thead>
          <tr>
            <th className={clsx('text-lg text-left font-medium p-2', { 'w-1/5': !showRivalry, 'w-1/2': showRivalry })}>
              Team Name
            </th>
            <th className={clsx('text-lg text-left font-medium p-2', { hidden: showRivalry })}>Location</th>
            <th
              className={clsx('text-lg text-left font-medium p-2', {
                'w-1/6': !showRivalry,
              })}
            >
              Coordinates
            </th>
            <th className=""></th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <React.Fragment key={index}>
              <tr className="border-b border-t border-300 border-black last:border-b-0">
                <td>
                  <input
                    type="text"
                    name={`team-name-${index}`}
                    value={team.name}
                    onChange={e => handleTeamNameChange(index, e.target.value)}
                    className="p-2 rounded w-full bg-gray-100 focus:bg-white hover:bg-white duration-300 ease-out"
                    placeholder="Team Name"
                  />
                </td>
                <td className={clsx({ hidden: showRivalry })}>
                  <LocationSearchInput
                    key={'location-search-' + index}
                    index={index}
                    onSelect={(index, location, latitude, longitude) => {
                      const updatedTeams = [...teams];
                      updatedTeams[index] = { ...updatedTeams[index], location, latitude, longitude };
                      setTeams(updatedTeams);
                    }}
                    location={team.location}
                    onFocus={() => setMapPickerIndex(index)}
                  />
                </td>
                <td>
                  <div className="flex flex-col">
                    <div className="flex">
                      <input
                        type="number"
                        name={`latitude-${index}`}
                        value={team.latitude}
                        min={MIN_LATITUDE}
                        max={MAX_LATITUDE}
                        step="0.001"
                        onChange={e => {
                          const value = parseFloat(e.target.value);
                          validateLatitude(index, value);
                          handleCoordinatesChange(index, 'latitude', value);
                        }}
                        className={clsx(
                          'rounded w-1/2 p-2 bg-gray-100 focus:bg-white hover:bg-white duration-300 ease-out',
                          { 'border-2 border-red-500': errors[index]?.latitude }
                        )}
                        placeholder="Latitude"
                      />
                      <input
                        type="number"
                        name={`longitude-${index}`}
                        value={team.longitude}
                        min={MIN_LONGITUDE}
                        max={MAX_LONGITUDE}
                        step="0.001"
                        onChange={e => {
                          const value = parseFloat(e.target.value);
                          validateLongitude(index, value);
                          handleCoordinatesChange(index, 'longitude', value);
                        }}
                        className={clsx(
                          'rounded w-1/2 p-2 bg-gray-100 focus:bg-white hover:bg-white duration-300 ease-out',
                          { 'border-2 border-red-500': errors[index]?.longitude }
                        )}
                        placeholder="Longitude"
                      />
                    </div>
                  </div>
                </td>
                <td className="text-end">
                  <button
                    type="button"
                    onClick={() => { setTeams(teams.filter((_, i) => i !== index)); setMapPickerIndex(null); }}
                    className="inline-flex items-center justify-center rounded p-1 text-gray-800 hover:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    aria-label={`Remove team ${team.name}`}
                    title="Remove team"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </td>
              </tr>
              {mapPickerIndex === index && (
                <tr>
                  <td colSpan={4}>
                    <div className="relative h-96 w-full rounded border mt-2 overflow-hidden">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setMapPickerIndex(null);
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
                        <MapClickHandler onClick={(lat, lng) => handleMapPick(index, parseFloat(lat.toFixed(3)), parseFloat(lng.toFixed(3)))} />
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
        onClick={() => { setTeams([...teams, DEFAULT_TEAM]); setMapPickerIndex(null); }}
        className="w-full mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        <span className="text-xl font-bold">+</span> Add Team
      </button>
    </div>
  );
};

export default TeamView;
