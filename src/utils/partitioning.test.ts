import { describe, expect, it } from 'vitest';
import Partitioning, { splitIntoConferences } from './partitioning';
import type { Division, Rivalry, Team } from './types';

const team = (id: string, lat: number, lon: number): Team => ({
  id,
  name: id,
  location: '',
  latitude: lat,
  longitude: lon,
});

const division = (teams: Team[], color = '#000'): Division => ({ teams, color });

describe('splitIntoConferences', () => {
  it('puts higher-longitude divisions in one conference and lower in the other', () => {
    const west = division([team('w', 0, -120)], '#a');
    const east = division([team('e', 0, 80)], '#b');
    const [confA, confB] = splitIntoConferences([west, east]);
    expect(confA).toEqual([west]);
    expect(confB).toEqual([east]);
  });

  it('splits three divisions by descending centroid longitude', () => {
    const dLow = division([team('a', 0, -10)], '#1');
    const dMid = division([team('b', 0, 20)], '#2');
    const dHigh = division([team('c', 0, 50)], '#3');
    const [first, second] = splitIntoConferences([dLow, dMid, dHigh]);
    // Sorted lon desc: dHigh, dMid, dLow → slice(2) is [dLow], slice(0,2) is [dHigh, dMid]
    expect(first).toEqual([dLow]);
    expect(second).toEqual([dHigh, dMid]);
  });
});

describe('Partitioning', () => {
  it('throws when a rivalry has more teams than max division size', () => {
    const teams = Array.from({ length: 8 }, (_, i) => team(`t${i}`, 0, i));
    const rivalry: Rivalry = {
      teamIds: ['t0', 't1', 't2', 't3', 't4'],
    };
    expect(() => new Partitioning(teams, 2, [rivalry])).toThrow(
      /a rivalry cannot have more than 4 teams/
    );
  });

  it('throws when the same team id appears in more than one rivalry', () => {
    const teams = [team('a', 0, 0), team('b', 0, 1), team('c', 0, 2), team('d', 0, 3)];
    expect(
      () =>
        new Partitioning(teams, 2, [
          { teamIds: ['a', 'b'] },
          { teamIds: ['a', 'c'] },
        ])
    ).toThrow(/appears in more than one rivalry/);
  });

  it('getDivisions returns the requested number of divisions and every team exactly once', () => {
    const teams = [
      team('a', 10, 10),
      team('b', 11, 11),
      team('c', 40, -90),
      team('d', 41, -91),
    ];
    const p = new Partitioning(teams, 2, []);
    const divisions = p.getDivisions();
    expect(divisions).toHaveLength(2);
    const ids = divisions.flatMap(d => d.teams.map(t => t.id)).sort();
    expect(ids).toEqual(['a', 'b', 'c', 'd'].sort());
  });

  it('getDivisions keeps rivalry groups in the same division when feasible', () => {
    const teams = [
      team('a', 0, 0),
      team('b', 0.01, 0.01),
      team('c', 60, 60),
      team('d', 60.01, 60.01),
    ];
    const p = new Partitioning(teams, 2, [{ teamIds: ['a', 'b'] }]);
    const divisions = p.getDivisions();
    expect(divisions).toHaveLength(2);
    const withPair = divisions.find(d => d.teams.some(t => t.id === 'a'));
    const idsInPairDivision = new Set(withPair?.teams.map(t => t.id) ?? []);
    expect(idsInPairDivision.has('a')).toBe(true);
    expect(idsInPairDivision.has('b')).toBe(true);
  });
});
