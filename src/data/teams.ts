export interface Team {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
}

export type Division = {
  teams: Team[];
  color: string;
};

export const defaultDivisionCount = 8;

export const defaultTeams: Team[] = [
  { name: 'Atlanta Hawks', location: 'Atlanta, Georgia, USA', latitude: 33.749, longitude: -84.388 },
  { name: 'Boston Celtics', location: 'Boston, Massachusetts, USA', latitude: 42.36, longitude: -71.059 },
  { name: 'Brooklyn Nets', location: 'Brooklyn, New York, USA', latitude: 40.678, longitude: -73.944 },
  { name: 'Charlotte Hornets', location: 'Charlotte, North Carolina, USA', latitude: 35.227, longitude: -80.843 },
  { name: 'Chicago Bulls', location: 'Chicago, Illinois, USA', latitude: 41.878, longitude: -87.63 },
  { name: 'Cleveland Cavaliers', location: 'Cleveland, Ohio, USA', latitude: 41.5, longitude: -81.694 },
  { name: 'Dallas Mavericks', location: 'Dallas, Texas, USA', latitude: 32.777, longitude: -96.797 },
  { name: 'Denver Nuggets', location: 'Denver, Colorado, USA', latitude: 39.739, longitude: -104.99 },
  { name: 'Detroit Pistons', location: 'Detroit, Michigan, USA', latitude: 42.331, longitude: -83.046 },
  {
    name: 'Golden State Warriors',
    location: 'San Francisco, California, USA',
    latitude: 37.775,
    longitude: -122.419,
  },
  { name: 'Houston Rockets', location: 'Houston, Texas, USA', latitude: 29.76, longitude: -95.37 },
  { name: 'Indiana Pacers', location: 'Indianapolis, Indiana, USA', latitude: 39.768, longitude: -86.158 },
  { name: 'Los Angeles Clippers', location: 'Los Angeles, California, USA', latitude: 34.052, longitude: -118.244 },
  { name: 'Los Angeles Lakers', location: 'Los Angeles, California, USA', latitude: 34.052, longitude: -118.244 },
  { name: 'Memphis Grizzlies', location: 'Memphis, Tennessee, USA', latitude: 35.15, longitude: -90.049 },
  { name: 'Miami Heat', location: 'Miami, Florida, USA', latitude: 25.762, longitude: -80.192 },
  { name: 'Milwaukee Bucks', location: 'Milwaukee, Wisconsin, USA', latitude: 43.039, longitude: -87.907 },
  { name: 'Minnesota Timberwolves', location: 'Minneapolis, Minnesota, USA', latitude: 44.978, longitude: -93.265 },
  { name: 'New Orleans Pelicans', location: 'New Orleans, Louisiana, USA', latitude: 29.951, longitude: -90.072 },
  { name: 'New York Knicks', location: 'New York City, New York, USA', latitude: 40.713, longitude: -74.006 },
  { name: 'Oklahoma City Thunder', location: 'Oklahoma City, Oklahoma, USA', latitude: 35.468, longitude: -97.516 },
  { name: 'Orlando Magic', location: 'Orlando, Florida, USA', latitude: 28.538, longitude: -81.379 },
  { name: 'Philadelphia 76ers', location: 'Philadelphia, Pennsylvania, USA', latitude: 39.953, longitude: -75.165 },
  { name: 'Phoenix Suns', location: 'Phoenix, Arizona, USA', latitude: 33.448, longitude: -112.074 },
  { name: 'Portland Trail Blazers', location: 'Portland, Oregon, USA', latitude: 45.505, longitude: -122.675 },
  { name: 'Sacramento Kings', location: 'Sacramento, California, USA', latitude: 38.582, longitude: -121.494 },
  { name: 'San Antonio Spurs', location: 'San Antonio, Texas, USA', latitude: 29.424, longitude: -98.494 },
  { name: 'Toronto Raptors', location: 'Toronto, Ontario, Canada', latitude: 43.651, longitude: -79.347 },
  { name: 'Utah Jazz', location: 'Salt Lake City, Utah, USA', latitude: 40.761, longitude: -111.891 },
  { name: 'Washington Wizards', location: 'Washington, D.C., USA', latitude: 38.907, longitude: -77.037 },
  { name: 'Seattle Supersonics', location: 'Seattle, Washington, USA', latitude: 47.604, longitude: -122.33 },
  { name: 'Vegas Vipers', location: 'Las Vegas, Nevada, USA', latitude: 36.167, longitude: -115.149 },
  // { name: 'Mexico City Aztecs', latitude: 19.432, longitude: -99.133 },
  // { name: 'Montreal Voyageurs', location: '', latitude: 45.498, longitude: -73.569 },
  // { name: 'Vancouver Orcas', location: '', latitude: 49.285, longitude: -123.117 },
  // { name: 'Anchoridge Anchors', location: '', latitude: 61.183, longitude: -149.88 },
];
