import { GEOCODING_API_URL } from '../data/constants';

type GeocodingResult = {
  formatted: string;
  geometry: { lat: number; lng: number };
};

type GeocodingResponse = {
  results: GeocodingResult[];
};

const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;
let hasWarnedAboutMissingApiKey = false;

const getApiKey = (): string | null => {
  if (OPENCAGE_API_KEY) {
    return OPENCAGE_API_KEY;
  }

  if (!hasWarnedAboutMissingApiKey) {
    console.warn(
      'Geocoding is disabled because VITE_OPENCAGE_API_KEY is not configured. Add it to your environment to enable location search.'
    );
    hasWarnedAboutMissingApiKey = true;
  }

  return null;
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
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  const url = `${GEOCODING_API_URL}?q=${encodeURIComponent(searchQuery)}&key=${apiKey}`;
  return fetchGeocodingData(url);
};

export const fetchCoordinates = async (lat: number, lng: number): Promise<GeocodingResult[] | null> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  const url = `${GEOCODING_API_URL}?q=${encodeURIComponent(`${lat} ${lng}`)}&key=${apiKey}`;
  return fetchGeocodingData(url);
};

export const normalizeCoordinate = (coordinate: number) => {
  return parseFloat((((((coordinate + 180) % 360) + 360) % 360) - 180).toFixed(3));
};