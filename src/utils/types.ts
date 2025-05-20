export interface Team {
  name: string;
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

export type Tab = 'teams' | 'rivalries' | 'divisions';

export type Rivalry = {
  teams: Team[];
};
