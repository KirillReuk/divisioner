import { describe, expect, it } from 'vitest';
import { MAX_RIVALRIES } from '../data/constants';
import {
  initialTeamBuilderState,
  teamBuilderReducer,
  type TeamBuilderState,
} from './teamBuilderReducer';
import type { Division, Team } from '../utils/types';

const team = (id: string, overrides: Partial<Team> = {}): Team => ({
  id,
  name: overrides.name ?? id,
  location: overrides.location ?? '',
  latitude: overrides.latitude ?? 0,
  longitude: overrides.longitude ?? 0,
  ...overrides,
});

const stateWith = (partial: Partial<TeamBuilderState>): TeamBuilderState => ({
  ...initialTeamBuilderState,
  ...partial,
});

describe('teamBuilderReducer', () => {
  it('SET_TEAMS replaces teams and prunes rivalries missing teams or below two ids', () => {
    const s0 = stateWith({
      teams: [team('a'), team('b'), team('c')],
      rivalries: [
        { teamIds: ['a', 'b'] },
        { teamIds: ['c', 'ghost'] },
      ],
    });
    const next = teamBuilderReducer(s0, {
      type: 'SET_TEAMS',
      payload: { teams: [team('a'), team('b')] },
    });
    expect(next.teams).toEqual([team('a'), team('b')]);
    expect(next.rivalries).toEqual([{ teamIds: ['a', 'b'] }]);
  });

  it('SET_RIVALRIES replaces rivalries', () => {
    const rivalries = [{ teamIds: ['x', 'y'] }];
    const next = teamBuilderReducer(initialTeamBuilderState, {
      type: 'SET_RIVALRIES',
      payload: { rivalries },
    });
    expect(next.rivalries).toEqual(rivalries);
  });

  it('SET_DIVISIONS_COUNT updates divisionsCount', () => {
    const next = teamBuilderReducer(initialTeamBuilderState, {
      type: 'SET_DIVISIONS_COUNT',
      payload: { count: 4 },
    });
    expect(next.divisionsCount).toBe(4);
  });

  it('SET_MAP_PICKER_TEAM_ID updates mapPickerTeamId', () => {
    const next = teamBuilderReducer(initialTeamBuilderState, {
      type: 'SET_MAP_PICKER_TEAM_ID',
      payload: { teamId: 'pick-me' },
    });
    expect(next.mapPickerTeamId).toBe('pick-me');
  });

  it('SET_TEAMS clears generated divisions and conferences', () => {
    const divisions: Division[] = [{ teams: [team('a')], color: '#fff' }];
    const s0 = stateWith({
      teams: [team('a')],
      divisions,
      conferences: [[divisions[0]]],
    });
    const next = teamBuilderReducer(s0, {
      type: 'SET_TEAMS',
      payload: { teams: [team('a'), team('b')] },
    });
    expect(next.divisions).toEqual([]);
    expect(next.conferences).toEqual([]);
    expect(next.teams).toHaveLength(2);
  });

  it('APPLY_PRESET sets teams, clears rivalries and map picker, and keeps divisionsCount when omitted', () => {
    const divisions: Division[] = [{ teams: [team('old')], color: '#fff' }];
    const s0 = stateWith({
      teams: [team('old')],
      rivalries: [{ teamIds: ['old', 'x'] }],
      divisionsCount: 6,
      mapPickerTeamId: 'old',
      divisions,
      conferences: [[divisions[0]]],
    });
    const presetTeams = [team('n1'), team('n2')];
    const next = teamBuilderReducer(s0, {
      type: 'APPLY_PRESET',
      payload: { teams: presetTeams },
    });
    expect(next.teams).toEqual(presetTeams);
    expect(next.rivalries).toEqual([]);
    expect(next.mapPickerTeamId).toBeNull();
    expect(next.divisionsCount).toBe(6);
    expect(next.divisions).toEqual([]);
    expect(next.conferences).toEqual([]);
  });

  it('APPLY_PRESET can override divisionsCount', () => {
    const next = teamBuilderReducer(
      stateWith({ divisionsCount: 8 }),
      { type: 'APPLY_PRESET', payload: { teams: [team('a')], divisionsCount: 2 } }
    );
    expect(next.divisionsCount).toBe(2);
  });

  it('ADD_RIVALRY appends a rivalry', () => {
    const r = { teamIds: ['a', 'b'] };
    const next = teamBuilderReducer(initialTeamBuilderState, {
      type: 'ADD_RIVALRY',
      payload: { rivalry: r },
    });
    expect(next.rivalries).toEqual([r]);
  });

  it('ADD_RIVALRY does nothing when already at MAX_RIVALRIES', () => {
    const rivalries = Array.from({ length: MAX_RIVALRIES }, (_, i) => ({
      teamIds: [`t${i}a`, `t${i}b`],
    }));
    const s0 = stateWith({ rivalries });
    const next = teamBuilderReducer(s0, {
      type: 'ADD_RIVALRY',
      payload: { rivalry: { teamIds: ['x', 'y'] } },
    });
    expect(next.rivalries).toEqual(rivalries);
    expect(next.rivalries).toHaveLength(MAX_RIVALRIES);
  });

  it('SET_RIVALRIES keeps at most MAX_RIVALRIES entries', () => {
    const many = Array.from({ length: MAX_RIVALRIES + 5 }, (_, i) => ({
      teamIds: [`a${i}`, `b${i}`],
    }));
    const next = teamBuilderReducer(initialTeamBuilderState, {
      type: 'SET_RIVALRIES',
      payload: { rivalries: many },
    });
    expect(next.rivalries).toHaveLength(MAX_RIVALRIES);
    expect(next.rivalries[0]).toEqual(many[0]);
    expect(next.rivalries[MAX_RIVALRIES - 1]).toEqual(many[MAX_RIVALRIES - 1]);
  });

  it('REMOVE_RIVALRY drops by index', () => {
    const s0 = stateWith({
      rivalries: [{ teamIds: ['a', 'b'] }, { teamIds: ['c', 'd'] }],
    });
    const next = teamBuilderReducer(s0, { type: 'REMOVE_RIVALRY', payload: { rivalryIndex: 0 } });
    expect(next.rivalries).toEqual([{ teamIds: ['c', 'd'] }]);
  });

  it('UPDATE_RIVALRY_TEAM replaces one team id in a rivalry', () => {
    const s0 = stateWith({
      rivalries: [{ teamIds: ['a', 'b'] }],
    });
    const next = teamBuilderReducer(s0, {
      type: 'UPDATE_RIVALRY_TEAM',
      payload: { rivalryIndex: 0, teamIndex: 1, teamId: 'z' },
    });
    expect(next.rivalries[0].teamIds).toEqual(['a', 'z']);
  });

  it('ADD_TEAM_TO_RIVALRY appends a team id', () => {
    const s0 = stateWith({
      rivalries: [{ teamIds: ['a', 'b'] }],
    });
    const next = teamBuilderReducer(s0, {
      type: 'ADD_TEAM_TO_RIVALRY',
      payload: { rivalryIndex: 0, teamId: 'c' },
    });
    expect(next.rivalries[0].teamIds).toEqual(['a', 'b', 'c']);
  });

  it('REMOVE_TEAM_FROM_RIVALRY removes by index', () => {
    const s0 = stateWith({
      rivalries: [{ teamIds: ['a', 'b', 'c'] }],
    });
    const next = teamBuilderReducer(s0, {
      type: 'REMOVE_TEAM_FROM_RIVALRY',
      payload: { rivalryIndex: 0, teamIndex: 1 },
    });
    expect(next.rivalries[0].teamIds).toEqual(['a', 'c']);
  });

  it('SET_GENERATED_STRUCTURE sets divisions and conferences', () => {
    const divisions: Division[] = [
      { teams: [team('a')], color: '#fff' },
    ];
    const conferences: Division[][] = [[divisions[0]]];
    const next = teamBuilderReducer(initialTeamBuilderState, {
      type: 'SET_GENERATED_STRUCTURE',
      payload: { divisions, conferences },
    });
    expect(next.divisions).toEqual(divisions);
    expect(next.conferences).toEqual(conferences);
  });
});
