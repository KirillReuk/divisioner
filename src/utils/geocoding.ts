import { API_KEY } from '../config';

//type the return type
export const fetchLocations = async (searchQuery: string): Promise<any> => {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchQuery)}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results) {
      return data.results;
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
  }
};

//type the return type
export const fetchCoordinates = async (lat: number, lng: number): Promise<any> => {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(`${lat} ${lng}`)}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results) {
      return data.results;
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
  }
};
