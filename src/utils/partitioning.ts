import { Division, Rivalry, TeamWithPseudo, Team } from './types';
import { haversineDistance } from '../utils/distance';
import chroma from 'chroma-js';

type PotentialSwap = {
  i: number;
  j: number;
  team1: TeamWithPseudo;
  team2: TeamWithPseudo;
} | null;

const calculateCentroid = (division: Division): { lat: number; lon: number } => {
  const { totalLat, totalLon } = division.teams.reduce(
    (acc, team) => ({
      totalLat: acc.totalLat + team.latitude,
      totalLon: acc.totalLon + team.longitude,
    }),
    { totalLat: 0, totalLon: 0 }
  );

  const numTeams = division.teams.length || 1;
  return { lat: totalLat / numTeams, lon: totalLon / numTeams };
};

export const splitIntoConferences = (components: Division[]): Division[][] => {
  const divisionsWithCentroids = [...components]
    .map(division => ({
      division,
      centroid: calculateCentroid(division),
    }))
    .sort((a, b) => b.centroid.lon - a.centroid.lon);

  const half = Math.ceil(divisionsWithCentroids.length / 2);
  const result = [
    divisionsWithCentroids.slice(half).map(d => d.division),
    divisionsWithCentroids.slice(0, half).map(d => d.division),
  ];

  return result;
};

class Partitioning {
  teams: TeamWithPseudo[];
  divisionCount: number;
  maxDivisionSize: number;
  distanceMatrix: number[][];
  components: TeamWithPseudo[][];
  private teamIndexMap: Map<string, number>;
  private readonly optimizationTimeBudgetMs = 500;
  private readonly maxOptimizationSwaps = 1000;

  constructor(teams: Team[], divisionCount: number, rivalries: Rivalry[]) {
    this.divisionCount = divisionCount;
    this.maxDivisionSize = Math.ceil(teams.length / divisionCount);

    const teamsById = new Map(teams.map(team => [team.id, team]));
    for (const rivalry of rivalries) {
      const resolvedCount = rivalry.teamIds.filter(id => teamsById.has(id)).length;
      if (resolvedCount > this.maxDivisionSize) {
        throw new Error(
          `Partitioning: a rivalry cannot have more than ${this.maxDivisionSize} teams (max division size); one rivalry has ${resolvedCount}.`
        );
      }
    }

    const seenRivalryTeamIds = new Set<string>();
    for (const rivalry of rivalries) {
      for (const teamId of rivalry.teamIds) {
        if (seenRivalryTeamIds.has(teamId)) {
          throw new Error(
            `Partitioning: team id "${teamId}" appears in more than one rivalry; rivalries must be disjoint.`
          );
        }
        seenRivalryTeamIds.add(teamId);
      }
    }
    const rivalryTeams = rivalries
      .map(rivalry =>
        rivalry.teamIds.map(teamId => teamsById.get(teamId)).filter((team): team is Team => Boolean(team))
      )
      .filter(rivalryTeamsGroup => rivalryTeamsGroup.length >= 2);

    const pseudoTeamsFromRivalries: TeamWithPseudo[] = rivalryTeams.map((rivalryTeamsGroup, index) => ({
      id: `rivalry-pseudo-${index}`,
      name: 'Rivalry: ' + rivalryTeamsGroup.map(team => team.name).join(' vs. '),
      location: 'Anywhere!',
      latitude: rivalryTeamsGroup.reduce((acc, team) => acc + team.latitude, 0) / rivalryTeamsGroup.length,
      longitude: rivalryTeamsGroup.reduce((acc, team) => acc + team.longitude, 0) / rivalryTeamsGroup.length,
      teamsIncluded: rivalryTeamsGroup,
    }));
    const rivalryTeamIds = new Set(rivalries.flatMap(rivalry => rivalry.teamIds));
    const nonRivaledTeams = teams.filter(team => !rivalryTeamIds.has(team.id));

    const teamsWithIndex = pseudoTeamsFromRivalries.concat(nonRivaledTeams).map((team, index) => ({
      ...team,
      index,
    }));
    this.teams = teamsWithIndex;
    this.distanceMatrix = this.precomputeDistances();

    this.components = this.generateInitialComponents(teamsWithIndex);
    this.teamIndexMap = new Map(this.teams.map((team, idx) => [team.id, idx]));
  }

  private generateInitialComponents = (teams: TeamWithPseudo[]): TeamWithPseudo[][] => {
    const result: TeamWithPseudo[][] = [];
    teams.forEach(team => {
      result.push([team]);
    });

    return result;
  };

  private getTeamMatrixIndex(team: TeamWithPseudo): number {
    const idx = this.teamIndexMap.get(team.id);
    if (idx === undefined) {
      throw new Error(
        `Partitioning: unknown team id "${team.id}" for distance matrix (expected a team from this partition run).`
      );
    }
    return idx;
  }

  private distanceBetweenTeams = (team1: TeamWithPseudo, team2: TeamWithPseudo): number => {
    const i = this.getTeamMatrixIndex(team1);
    const j = this.getTeamMatrixIndex(team2);
    return this.distanceMatrix[i][j];
  };

  private precomputeDistances = (): number[][] => {
    const numberOfTeams = this.teams.length;

    const distances: number[][] = Array.from({ length: numberOfTeams }, () => Array(numberOfTeams).fill(0));

    for (let i = 0; i < numberOfTeams; i++) {
      const teamA = this.teams[i];
      for (let j = i; j < numberOfTeams; j++) {
        const teamB = this.teams[j];
        const distance = haversineDistance(teamA.latitude, teamA.longitude, teamB.latitude, teamB.longitude);
        distances[i][j] = distance;
        distances[j][i] = distance;
      }
    }

    return distances;
  };

  private calculateComponentDistance = (component: TeamWithPseudo[]): number => {
    let totalDistance = 0;
    for (let i = 0; i < component.length; i++) {
      for (let j = i + 1; j < component.length; j++) {
        totalDistance += this.distanceBetweenTeams(component[i], component[j]);
      }
    }
    return totalDistance;
  };

  private calculateTotalDistance(): number {
    return this.components.reduce((total, component) => total + this.calculateComponentDistance(component), 0);
  }

  private calculateComponentWeight = (component: TeamWithPseudo[]): number => {
    return component.reduce((total, team) => total + (team.teamsIncluded?.length || 1), 0);
  };

  private findBestSwap(): PotentialSwap | null {
    let bestSwap: PotentialSwap = null;
    let bestDistance = this.calculateTotalDistance();

    for (let i = 0; i < this.components.length; i++) {
      for (let j = i + 1; j < this.components.length; j++) {
        const component1 = this.components[i];
        const component2 = this.components[j];

        component1.forEach(team1 => {
          component2.forEach(team2 => {
            const newComponent1 = component1.filter(team => team !== team1).concat(team2);
            const newComponent2 = component2.filter(team => team !== team2).concat(team1);

            if (
              this.calculateComponentWeight(newComponent1) > this.maxDivisionSize ||
              this.calculateComponentWeight(newComponent2) > this.maxDivisionSize
            ) {
              return;
            }
            const newComponents = [...this.components];
            newComponents[i] = newComponent1;
            newComponents[j] = newComponent2;

            const newDistance = newComponents.reduce(
              (total, component) => total + this.calculateComponentDistance(component),
              0
            );

            if (newDistance < bestDistance) {
              bestDistance = newDistance;
              bestSwap = { i, j, team1, team2 };
            }
          });
        });
      }
    }

    return bestSwap;
  }

  private optimizeDivisions = () => {
    const deadline = Date.now() + this.optimizationTimeBudgetMs;
    for (let swaps = 0; swaps < this.maxOptimizationSwaps && Date.now() < deadline; swaps++) {
      const bestSwap = this.findBestSwap();

      if (!bestSwap) {
        break;
      }

      const { i, j, team1, team2 } = bestSwap;
      this.components[i] = this.components[i].filter(team => team !== team1).concat(team2);
      this.components[j] = this.components[j].filter(team => team !== team2).concat(team1);
    }
  };

  private calculateDistancesBetweenComponents = () => {
    const distances = [];
    for (let i = 0; i < this.components.length; i++) {
      for (let j = i + 1; j < this.components.length; j++) {
        const minDistance = this.components[i]
          .flatMap(team1 => this.components[j].map(team2 => this.distanceBetweenTeams(team1, team2)))
          .reduce((a, b) => Math.min(a, b), Infinity);

        distances.push({ index1: i, index2: j, distance: minDistance });
      }
    }
    return distances.sort((a, b) => a.distance - b.distance);
  };

  private mergeClosestComponents(distances: { index1: number; index2: number; distance: number }[]): boolean {
    for (const { index1, index2 } of distances) {
      const comp1 = this.components[index1];
      const comp2 = this.components[index2];

      if (
        comp1.reduce((acc, team) => acc + (team.teamsIncluded?.length || 1), 0) +
          comp2.reduce((acc, team) => acc + (team.teamsIncluded?.length || 1), 0) <=
        this.maxDivisionSize
      ) {
        this.components[index1] = comp1.concat(comp2);
        this.components.splice(index2, 1);

        return true;
      }
    }
    return false;
  }

  private findClosestComponent(singleTeam: TeamWithPseudo): { index: number; distance: number } | null {
    let closestComponentIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < this.components.length; i++) {
      if (
        this.calculateComponentWeight(this.components[i]) + (singleTeam?.teamsIncluded?.length || 1) <=
        this.maxDivisionSize
      ) {
        const distance = this.components[i]
          .map(team => this.distanceBetweenTeams(singleTeam, team))
          .reduce((a, b) => Math.min(a, b), Infinity);

        if (distance < minDistance) {
          minDistance = distance;
          closestComponentIndex = i;
        }
      }
    }

    return closestComponentIndex !== -1 ? { index: closestComponentIndex, distance: minDistance } : null;
  }

  private tryRecycleSmallestComponent(): void {
    const sortedComponents = this.components
      .map((component, idx) => ({ component, idx }))
      .sort((a, b) => this.calculateComponentWeight(a.component) - this.calculateComponentWeight(b.component));
    const componentsDeepCopy = this.components.map(component => [...component]);

    for (const { component: smallestComponent, idx: originalIdx } of sortedComponents) {
      let recycleSuccess = true;
      this.components = this.components.filter((_, idx) => idx !== originalIdx);

      for (const team of smallestComponent) {
        const closest = this.findClosestComponent(team);
        if (closest && closest.index !== undefined) {
          this.components[closest.index].push(team);
        } else {
          this.components = componentsDeepCopy.map(component => [...component]);
          recycleSuccess = false;
          break;
        }
      }

      if (recycleSuccess) break;
    }
  }

  public getDivisions = (): Division[] => {
    while (this.components.length > this.divisionCount) {
      const distances = this.calculateDistancesBetweenComponents();

      if (!this.mergeClosestComponents(distances)) {
        this.tryRecycleSmallestComponent();
      }
    }

    this.optimizeDivisions();

    return this.components.map((division, index) => ({
      teams: division.flatMap(team => team.teamsIncluded || [team]),
      color: chroma.scale('Spectral').mode('lab').colors(this.components.length)[index],
    }));
  };
}

export default Partitioning;
