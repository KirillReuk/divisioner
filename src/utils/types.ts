export interface Team {
  id: string;
  name: string;
  shortName?: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
}
export interface TeamWithPseudo extends Omit<Team, 'latitude' | 'longitude'> {
  latitude: number;
  longitude: number;
  teamsIncluded?: Team[];
}

export type Division = {
  teams: Team[];
  color: string;
};

export type Tab = 'teams' | 'divisions';

export type Rivalry = {
  teamIds: string[];
};

export type CoordinateField = 'latitude' | 'longitude';
