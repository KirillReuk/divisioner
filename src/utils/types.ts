export interface Team {
  id: string;
  name: string;
  shortName?: string;
  location: string;
  latitude: number;
  longitude: number;
}
export interface TeamWithPseudo extends Team {
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
