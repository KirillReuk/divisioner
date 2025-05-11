import React, { useEffect, useState } from 'react';
import { fetchLocations } from './utils/geocoding';

interface LocationSearchRowProps {
  index: number;
  onSelect: (index: number, formatted: string, lat: number, lng: number) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  location?: string;
}

interface LocationResult {
  formatted: string;
  geometry: { lat: number; lng: number };
}

const LocationSearchInput: React.FC<LocationSearchRowProps> = ({ index, onSelect, onFocus, onBlur, location }) => {
  const [query, setQuery] = useState(location || '');
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location) {
      handleInputChange(location);
    }
  }, [location]);

  const updateLocationResults = async (searchQuery: string) => {
    setLoading(true);

    if (!searchQuery || searchQuery.length < 3) {
      setLocationResults([]);
      setLoading(false);
      return;
    }

    const results = await fetchLocations(searchQuery);

    if (results) {
      setLocationResults(results);
    }
    setLoading(false);
  };

  const handleInputChange = (query: string) => {
    setQuery(query);
    updateLocationResults(query);
  };

  const handleOptionSelect = (selectedValue: string) => {
    if (selectedValue === 'No results found' || selectedValue === 'Loading...') {
      return;
    }
    const selectedLocation = locationResults.find(result => result.formatted === selectedValue);
    if (selectedLocation) {
      setQuery(selectedLocation.formatted);
      onSelect(index, selectedLocation.formatted, selectedLocation.geometry.lat, selectedLocation.geometry.lng);
    }
  };

  return (
    <>
      <input
        type="search"
        list={`location-results-${index}`}
        value={query}
        onChange={e => {
          handleInputChange(e.target.value);
          handleOptionSelect(e.target.value);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Search location"
        className="p-2 rounded w-full bg-gray-100 focus:bg-white"
      />
      <datalist id={`location-results-${index}`}>
        {loading ? (
          <option value="Loading..." />
        ) : query.length >= 3 && locationResults.length === 0 ? (
          <option value="No results found" />
        ) : (
          locationResults.map(result => (
            <option key={`${result.geometry.lat}-${result.geometry.lng}`} value={result.formatted} />
          ))
        )}
      </datalist>
    </>
  );
};

export default LocationSearchInput;
