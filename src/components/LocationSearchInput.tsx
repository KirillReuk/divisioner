import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { fetchLocations } from '../utils/geocoding';
import { MIN_LOCATION_SEARCH_INPUT_LENGTH } from '../data/constants';
import { useAbortableLatest } from '../teams/useTeamActions';

interface LocationSearchInputProps {
  teamId: string;
  onSelect: (teamId: string, formatted: string, lat: number, lng: number) => void;
  location?: string;
  onFocus?: () => void;
}

interface LocationOption {
  label: string;
  value: string;
  lat?: number;
  lng?: number;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({ teamId, onSelect, location, onFocus }) => {
  const [selectedOption, setSelectedOption] = useState<LocationOption | null>(null);
  const latestControllerSignal = useAbortableLatest();

  useEffect(() => {
    if (location !== undefined) {
      setSelectedOption(prevSelectedOption => ({
        ...(prevSelectedOption ?? {}),
        label: location,
        value: location,
      }));
    }
  }, [location]);

  const loadOptions = async (inputValue: string) => {
    if (inputValue.length < MIN_LOCATION_SEARCH_INPUT_LENGTH) return [];

    const signal = latestControllerSignal();
    const results = await fetchLocations(inputValue, signal);
    if (signal.aborted) return new Promise<LocationOption[]>(() => {});

    return (
      results?.map(result => ({
        label: result.formatted,
        value: result.formatted,
        lat: result.geometry.lat,
        lng: result.geometry.lng,
      })) || []
    );
  };

  const handleChange = (option: LocationOption | null) => {
    setSelectedOption(option);
    if (option) {
      onSelect(teamId, option.value, option.lat ?? 0, option.lng ?? 0);
    }
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      onChange={handleChange}
      value={selectedOption}
      placeholder="Search location"
      noOptionsMessage={({ inputValue }) =>
        inputValue.length < MIN_LOCATION_SEARCH_INPUT_LENGTH
          ? `Input at least ${MIN_LOCATION_SEARCH_INPUT_LENGTH} characters`
          : 'No results'
      }
      className="w-full py-2 lg:px-2"
      styles={{
        singleValue: base => ({ ...base, textAlign: 'left' }),
      }}
      onFocus={onFocus}
    />
  );
};

export default LocationSearchInput;
