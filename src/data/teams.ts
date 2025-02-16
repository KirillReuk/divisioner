export interface Team {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  index?: number;
}

export type Division = {
  teams: Team[];
  hue: number;
};

export const defaultDivisionCount = 6;

export const defaultTeams: Team[] = [
  { name: 'Atlanta Hawks', location: 'Atlanta, Georgia, USA', latitude: 33.7488, longitude: -84.388 },
  { name: 'Boston Celtics', location: 'Boston, Massachusetts, USA', latitude: 42.3601, longitude: -71.0589 },
  { name: 'Brooklyn Nets', location: 'Brooklyn, New York, USA', latitude: 40.6782, longitude: -73.9442 },
  { name: 'Charlotte Hornets', location: 'Charlotte, North Carolina, USA', latitude: 35.2271, longitude: -80.8431 },
  { name: 'Chicago Bulls', location: 'Chicago, Illinois, USA', latitude: 41.8781, longitude: -87.6298 },
  { name: 'Cleveland Cavaliers', location: 'Cleveland, Ohio, USA', latitude: 41.4993, longitude: -81.6944 },
  { name: 'Dallas Mavericks', location: 'Dallas, Texas, USA', latitude: 32.7767, longitude: -96.797 },
  { name: 'Denver Nuggets', location: 'Denver, Colorado, USA', latitude: 39.7392, longitude: -104.9903 },
  { name: 'Detroit Pistons', location: 'Detroit, Michigan, USA', latitude: 42.3314, longitude: -83.0458 },
  {
    name: 'Golden State Warriors',
    location: 'San Francisco, California, USA',
    latitude: 37.7749,
    longitude: -122.4194,
  },
  { name: 'Houston Rockets', location: 'Houston, Texas, USA', latitude: 29.7604, longitude: -95.3698 },
  { name: 'Indiana Pacers', location: 'Indianapolis, Indiana, USA', latitude: 39.7684, longitude: -86.158 },
  { name: 'Los Angeles Clippers', location: 'Los Angeles, California, USA', latitude: 34.0522, longitude: -118.2437 },
  { name: 'Los Angeles Lakers', location: 'Los Angeles, California, USA', latitude: 34.0522, longitude: -118.2437 },
  { name: 'Memphis Grizzlies', location: 'Memphis, Tennessee, USA', latitude: 35.1495, longitude: -90.049 },
  { name: 'Miami Heat', location: 'Miami, Florida, USA', latitude: 25.7617, longitude: -80.1918 },
  { name: 'Milwaukee Bucks', location: 'Milwaukee, Wisconsin, USA', latitude: 43.0389, longitude: -87.9065 },
  { name: 'Minnesota Timberwolves', location: 'Minneapolis, Minnesota, USA', latitude: 44.9778, longitude: -93.265 },
  { name: 'New Orleans Pelicans', location: 'New Orleans, Louisiana, USA', latitude: 29.9511, longitude: -90.0715 },
  { name: 'New York Knicks', location: 'New York City, New York, USA', latitude: 40.7128, longitude: -74.006 },
  { name: 'Oklahoma City Thunder', location: 'Oklahoma City, Oklahoma, USA', latitude: 35.4676, longitude: -97.5164 },
  { name: 'Orlando Magic', location: 'Orlando, Florida, USA', latitude: 28.5383, longitude: -81.3792 },
  { name: 'Philadelphia 76ers', location: 'Philadelphia, Pennsylvania, USA', latitude: 39.9526, longitude: -75.1652 },
  { name: 'Phoenix Suns', location: 'Phoenix, Arizona, USA', latitude: 33.4484, longitude: -112.074 },
  { name: 'Portland Trail Blazers', location: 'Portland, Oregon, USA', latitude: 45.5051, longitude: -122.675 },
  { name: 'Sacramento Kings', location: 'Sacramento, California, USA', latitude: 38.5816, longitude: -121.4944 },
  { name: 'San Antonio Spurs', location: 'San Antonio, Texas, USA', latitude: 29.4241, longitude: -98.4936 },
  { name: 'Toronto Raptors', location: 'Toronto, Ontario, Canada', latitude: 43.65107, longitude: -79.347015 },
  { name: 'Utah Jazz', location: 'Salt Lake City, Utah, USA', latitude: 40.7608, longitude: -111.891 },
  { name: 'Washington Wizards', location: 'Washington, D.C., USA', latitude: 38.9072, longitude: -77.0369 },
  // { name: 'Mexico City Aztecs', latitude: 19.4326, longitude: -99.1333 },
  // { name: 'Montreal Voyageurs', location: '', latitude: 45.4983, longitude: -73.5685 },
  // { name: 'Vancouver Orcas', location: '', latitude: 49.2846, longitude: -123.1169 },
  // { name: 'Anchoridge Anchors', location: '', latitude: 61.1832, longitude: -149.8804 },
];
