import { Team } from '../utils/types';

// General Constants
export const DEFAULT_TEAM: Team = { name: 'New Team', location: '', latitude: 0, longitude: 0 };
export const MAX_LATITUDE = 90;
export const MIN_LATITUDE = -90;
export const MAX_LONGITUDE = 180;
export const MIN_LONGITUDE = -180;

// Division Count
export const DEFAULT_DIVISION_COUNT = 8;

// Division View
export const CONFERENCE_NAMES = ['Eastern Conference', 'Western Conference'];

// Map View
export const TILE_LAYER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const MARKER_ICON_SIZE: [number, number] = [20, 20];
export const MARKER_ICON_ANCHOR: [number, number] = [10, 10];
export const MARKER_POPUP_ANCHOR: [number, number] = [0, -10];

// Partitioning
export const MAX_DIVISION_SIZE = 10; // Example value

// Geocoding
export const GEOCODING_API_URL = 'https://api.opencagedata.com/geocode/v1/json';
