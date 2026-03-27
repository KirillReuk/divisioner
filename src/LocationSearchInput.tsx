import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { fetchLocations } from './utils/geocoding';

interface LocationSearchRowProps {
  teamId: string;
  onSelect: (teamId: string, formatted: string, lat: number, lng: number) => void;
  location?: string;
  onFocus?: () => void;
}

interface LocationOption {
  label: string;
  value: string;
  lat: number;
  lng: number;
}

const LocationSearchInput: React.FC<LocationSearchRowProps> = ({ teamId, onSelect, location, onFocus }) => {
  const [selectedOption, setSelectedOption] = useState<LocationOption | null>(null);

  useEffect(() => {
    const loadInitialLocation = async () => {
      if (location) {
        const option = {
          label: location,
          value: location,
          lat: 0,
          lng: 0,
        };
        setSelectedOption(option);
      }
    };
    loadInitialLocation();
  }, [location]);

  const loadOptions = async (inputValue: string) => {
    if (inputValue.length < 3) return [];
    const results = await fetchLocations(inputValue);
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
      onSelect(teamId, option.value, option.lat, option.lng);
    }
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      onChange={handleChange}
      value={selectedOption}
      placeholder="Search location"
      isClearable
      noOptionsMessage={({ inputValue }) => (inputValue.length < 3 ? 'Input at least 3 characters' : 'No results')}
      styles={{
        container: base => ({ ...base, padding: '0.5rem', width: '100%' }),
        singleValue: base => ({ ...base, textAlign: 'left' }),
      }}
      onFocus={onFocus}
    />
  );
};

export default LocationSearchInput;
