import React, { useState } from 'react';
import { API_KEY } from './config';

interface LocationSearchRowProps {
  index: number;
  onSelect: (index: number, formatted: string, lat: number, lng: number) => void;
}

interface LocationResult {
  formatted: string;
  geometry: { lat: number; lng: number };
}

const LocationSearchRow: React.FC<LocationSearchRowProps> = ({ index, onSelect }) => {
  const [query, setQuery] = useState('');
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);

  const fetchLocations = async (searchQuery: string) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchQuery)}&key=${API_KEY}`;

    if (!searchQuery || searchQuery.length < 3) return;
    try {
      const response = await fetch(url);
      const data = await response.json();

      // const data = {
      //   results: [
      //     { formatted: 'aaab', geometry: { lat: 0, lng: 0 } },
      //     { formatted: 'aaad', geometry: { lat: 1, lng: 1 } },
      //   ],
      // }; // mock response
      if (data.results) {
        setLocationResults(data.results);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    fetchLocations(newQuery);
  };

  const handleOptionSelect = (selectedValue: string) => {
    const selectedLocation = locationResults.find(result => result.formatted === selectedValue);
    if (selectedLocation) {
      setQuery(selectedLocation.formatted);
      onSelect(index, selectedLocation.formatted, selectedLocation.geometry.lat, selectedLocation.geometry.lng);
    }
  };

  return (
    <tr>
      <td>
        <input
          type="search"
          list={`location-results-${index}`}
          value={query}
          onChange={handleInputChange}
          onBlur={e => handleOptionSelect(e.target.value)}
          placeholder="Search location"
          className="border border-gray-300 rounded px-2 py-1"
        />
        <datalist id={`location-results-${index}`}>
          {locationResults.map(result => (
            <option key={`${result.geometry.lat}-${result.geometry.lng}`} value={result.formatted}>
              {result.formatted}
            </option>
          ))}
        </datalist>
      </td>
    </tr>
  );
};

export default LocationSearchRow;
