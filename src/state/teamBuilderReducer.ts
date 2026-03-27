import { DEFAULT_DIVISION_COUNT } from '../data/constants';
import { Division, Rivalry, Team } from '../utils/types';

export type TeamBuilderState = {
  divisions: Division[];
  conferences: Division[][];
  teams: Team[];
  rivalries: Rivalry[];
  divisionsCount: number;
  mapPickerTeamId: string | null;
};

export type TeamBuilderAction =
  | { type: 'SET_TEAMS'; payload: { teams: Team[] } }
  | { type: 'SET_RIVALRIES'; payload: { rivalries: Rivalry[] } }
  | { type: 'SET_DIVISIONS_COUNT'; payload: { count: number } }
  | { type: 'SET_MAP_PICKER_TEAM_ID'; payload: { teamId: string | null } }
  | { type: 'APPLY_PRESET'; payload: { teams: Team[] } }
  | { type: 'ADD_RIVALRY'; payload: { rivalry: Rivalry } }
  | { type: 'REMOVE_RIVALRY'; payload: { rivalryIndex: number } }
  | { type: 'UPDATE_RIVALRY_TEAM'; payload: { rivalryIndex: number; teamIndex: number; teamId: string } }
  | { type: 'ADD_TEAM_TO_RIVALRY'; payload: { rivalryIndex: number; teamId: string } }
  | { type: 'REMOVE_TEAM_FROM_RIVALRY'; payload: { rivalryIndex: number; teamIndex: number } }
  | { type: 'SET_GENERATED_STRUCTURE'; payload: { divisions: Division[]; conferences: Division[][] } };

export const initialTeamBuilderState: TeamBuilderState = {
  divisions: [],
  conferences: [],
  teams: [],
  rivalries: [],
  divisionsCount: DEFAULT_DIVISION_COUNT,
  mapPickerTeamId: null,
};

export const teamBuilderReducer = (state: TeamBuilderState, action: TeamBuilderAction): TeamBuilderState => {
  switch (action.type) {
    case 'SET_TEAMS':
      return {
        ...state,
        teams: action.payload.teams,
        rivalries: state.rivalries
          .map(rivalry => ({
            ...rivalry,
            teamIds: rivalry.teamIds.filter(teamId => action.payload.teams.some(team => team.id === teamId)),
          }))
          .filter(rivalry => rivalry.teamIds.length >= 2),
      };
    case 'SET_RIVALRIES':
      return { ...state, rivalries: action.payload.rivalries };
    case 'SET_DIVISIONS_COUNT':
      return { ...state, divisionsCount: action.payload.count };
    case 'SET_MAP_PICKER_TEAM_ID':
      return { ...state, mapPickerTeamId: action.payload.teamId };
    case 'APPLY_PRESET':
      return {
        ...state,
        teams: action.payload.teams,
        mapPickerTeamId: null,
        rivalries: [],
      };
    case 'ADD_RIVALRY':
      return {
        ...state,
        rivalries: [...state.rivalries, action.payload.rivalry],
      };
    case 'REMOVE_RIVALRY':
      return {
        ...state,
        rivalries: state.rivalries.filter((_, i) => i !== action.payload.rivalryIndex),
      };
    case 'UPDATE_RIVALRY_TEAM':
      return {
        ...state,
        rivalries: state.rivalries.map((rivalry, i) =>
          i === action.payload.rivalryIndex
            ? {
                ...rivalry,
                teamIds: rivalry.teamIds.map((teamId, j) =>
                  j === action.payload.teamIndex ? action.payload.teamId : teamId
                ),
              }
            : rivalry
        ),
      };
    case 'ADD_TEAM_TO_RIVALRY':
      return {
        ...state,
        rivalries: state.rivalries.map((rivalry, i) =>
          i === action.payload.rivalryIndex
            ? { ...rivalry, teamIds: [...rivalry.teamIds, action.payload.teamId] }
            : rivalry
        ),
      };
    case 'REMOVE_TEAM_FROM_RIVALRY':
      return {
        ...state,
        rivalries: state.rivalries.map((rivalry, i) =>
          i === action.payload.rivalryIndex
            ? { ...rivalry, teamIds: rivalry.teamIds.filter((_, j) => j !== action.payload.teamIndex) }
            : rivalry
        ),
      };
    case 'SET_GENERATED_STRUCTURE':
      return {
        ...state,
        divisions: action.payload.divisions,
        conferences: action.payload.conferences,
      };
    default:
      return state;
  }
};
