import React, { useState } from 'react';
import { API_KEY } from './config';

interface LocationSearchRowProps {
  index: number;
  onSelect: (index: number, formatted: string, lat: number, lng: number) => void;
  initialLocation?: string;
}

interface LocationResult {
  formatted: string;
  geometry: { lat: number; lng: number };
}

const LocationSearchInput: React.FC<LocationSearchRowProps> = ({ index, onSelect, initialLocation }) => {
  const [query, setQuery] = useState(initialLocation || '');
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLocations = async (searchQuery: string) => {
    setLoading(true);
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchQuery)}&key=${API_KEY}`;

    if (!searchQuery || searchQuery.length < 3) {
      setLocationResults([]);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results) {
        setLocationResults(data.results);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    fetchLocations(newQuery);
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
          handleInputChange(e);
          handleOptionSelect(e.target.value);
        }}
        placeholder="Search location"
        className="w-full border border-gray-300 px-2 py-1"
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
