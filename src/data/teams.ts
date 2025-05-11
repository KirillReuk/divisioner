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