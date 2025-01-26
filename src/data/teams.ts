export interface Team {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  index?: number;
}

export const defaultDivisionCount = 8;

export const defaultTeams: Team[] = [
    { name: 'Atlanta Hawks', location: '', latitude: 33.7488, longitude: -84.3880 },
    { name: 'Boston Celtics', location: '', latitude: 42.3601, longitude: -71.0589 },
    { name: 'Brooklyn Nets', location: '', latitude: 40.6782, longitude: -73.9442 },
    { name: 'Charlotte Hornets', location: '', latitude: 35.2271, longitude: -80.8431 },
    { name: 'Chicago Bulls', location: '', latitude: 41.8781, longitude: -87.6298 },
    { name: 'Cleveland Cavaliers', location: '', latitude: 41.4993, longitude: -81.6944 },
    { name: 'Dallas Mavericks', location: '', latitude: 32.7767, longitude: -96.7970 },
    { name: 'Denver Nuggets', location: '', latitude: 39.7392, longitude: -104.9903 },
    { name: 'Detroit Pistons', location: '', latitude: 42.3314, longitude: -83.0458 },
    { name: 'Golden State Warriors', location: '', latitude: 37.7749, longitude: -122.4194 },
    { name: 'Houston Rockets', location: '', latitude: 29.7604, longitude: -95.3698 },
    { name: 'Indiana Pacers', location: '', latitude: 39.7684, longitude: -86.1580 },
    { name: 'Los Angeles Clippers', location: '', latitude: 34.0522, longitude: -118.2437 },
    { name: 'Los Angeles Lakers', location: '', latitude: 34.0522, longitude: -118.2437 },
    { name: 'Memphis Grizzlies', location: '', latitude: 35.1495, longitude: -90.0490 },
    { name: 'Miami Heat', location: '', latitude: 25.7617, longitude: -80.1918 },
    { name: 'Milwaukee Bucks', location: '', latitude: 43.0731, longitude: -87.9010 },
    { name: 'Minnesota Timberwolves', location: '', latitude: 44.9778, longitude: -93.2650 },
    { name: 'New Orleans Pelicans', location: '', latitude: 29.9511, longitude: -90.0715 },
    { name: 'New York Knicks', location: '', latitude: 40.7128, longitude: -74.0060 },
    { name: 'Oklahoma City Thunder', location: '', latitude: 35.4676, longitude: -97.5164 },
    { name: 'Orlando Magic', location: '', latitude: 28.5383, longitude: -81.3792 },
    { name: 'Philadelphia 76ers', location: '', latitude: 39.9526, longitude: -75.1652 },
    { name: 'Phoenix Suns', location: '', latitude: 33.4484, longitude: -112.0740 },
    { name: 'Portland Trail Blazers', location: '', latitude: 45.5051, longitude: -122.6750 },
    { name: 'Sacramento Kings', location: '', latitude: 38.5816, longitude: -121.4944 },
    { name: 'San Antonio Spurs', location: '', latitude: 29.4241, longitude: -98.4936 },
    { name: 'Toronto Raptors', location: '', latitude: 43.6532, longitude: -79.3832 },
    { name: 'Utah Jazz', location: '', latitude: 40.7608, longitude: -111.8910 },
    { name: 'Washington Wizards', location: '', latitude: 38.9072, longitude: -77.0369 },
    { name: 'Las Vegas Gamblers', location: '', latitude: 36.1659, longitude: -115.1502 },
    { name: 'Seattle Supersonics', location: '', latitude: 47.6229, longitude: -122.352 },
    // { name: 'Mexico City Aztecs', latitude: 19.4326, longitude: -99.1333 },
    // { name: 'Montreal Voyageurs', location: '', latitude: 45.4983, longitude: -73.5685 },
    // { name: 'Vancouver Orcas', location: '', latitude: 49.2846, longitude: -123.1169 },
    // { name: 'Anchoridge Anchors', location: '', latitude: 61.1832, longitude: -149.8804 },
  ];
  
  