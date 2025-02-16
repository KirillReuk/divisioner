import { API_KEY } from '../config';

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
    const data = (await response.json()) as GeocodingResponse;

    if (data.results) {
      return data.results;
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
  }
  return null;
};

export const fetchLocations = async (searchQuery: string): Promise<GeocodingResult[] | null> => {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchQuery)}&key=${API_KEY}`;
  return fetchGeocodingData(url);
};

export const fetchCoordinates = async (lat: number, lng: number): Promise<GeocodingResult[] | null> => {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(`${lat} ${lng}`)}&key=${API_KEY}`;
  return fetchGeocodingData(url);
};
