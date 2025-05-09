import { API_KEY } from '../config';
import { GEOCODING_API_URL } from '../data/constants';

type GeocodingResult = {
  formatted: string;
  geometry: { lat: number; lng: number };
};

type GeocodingResponse = {
  results: GeocodingResult[];
};

const fetchGeocodingData = async (url: string): Promise<GeocodingResult[] | null> => {
  try {
    const response = await fetch(url);
    const data: GeocodingResponse = await response.json();

    if (data.results) {
      return data.results;
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
  }
  return null;
};

export const fetchLocations = async (searchQuery: string): Promise<GeocodingResult[] | null> => {
  const url = `${GEOCODING_API_URL}?q=${encodeURIComponent(searchQuery)}&key=${API_KEY}`;
  return fetchGeocodingData(url);
};

export const fetchCoordinates = async (lat: number, lng: number): Promise<GeocodingResult[] | null> => {
  const url = `${GEOCODING_API_URL}?q=${encodeURIComponent(`${lat} ${lng}`)}&key=${API_KEY}`;
  return fetchGeocodingData(url);
};
