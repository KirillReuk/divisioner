import { Division, Rivalry, Team, TeamWithPseudo } from './types';
import { haversineDistance } from '../utils/distance';
import chroma from 'chroma-js';

type PotentialSwap = {
  i: number;
  j: number;
  team1: Team;
  team2: Team;
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
    divisionsWithCentroids.slice(0, half).map(d => d.division),
    divisionsWithCentroids.slice(half).map(d => d.division),
  ];

  return result;
};

class Partitioning {
  teams: TeamWithPseudo[];
  divisionCount: number;
  maxDivisionSize: number;
  distanceMatrix: number[][];
  components: TeamWithPseudo[][];

  constructor(teams: Team[], divisionCount: number, rivalries: Rivalry[]) {
    const pseudoTeamsFromRivalries = rivalries.map(rivalry => ({
      name: 'Rivalry: ' + rivalry.teams.map(team => team.name).join(' vs. '),
      location: 'Anywhere!',
      latitude: rivalry.teams.reduce((acc, team) => acc + team.latitude, 0) / rivalry.teams.length,
      longitude: rivalry.teams.reduce((acc, team) => acc + team.longitude, 0) / rivalry.teams.length,
      teamsIncluded: rivalry.teams,
      weight: rivalry.teams.length,
    })) as TeamWithPseudo[];
    const nonRivaledTeams = teams.filter(
      team => !rivalries.some(rivalry => rivalry.teams.some(rivalTeam => rivalTeam.name === team.name))
    );

    const teamsWithIndex = pseudoTeamsFromRivalries.concat(nonRivaledTeams).map((team, index) => ({
      ...team,
      index,
    }));
    this.teams = teamsWithIndex;
    this.divisionCount = divisionCount;
    this.maxDivisionSize = Math.ceil(teams.length / divisionCount);
    this.distanceMatrix = this.precomputeDistances();

    this.components = this.generateInitialComponents(teamsWithIndex);
  }

  private generateInitialComponents = (teams: Team[]): Team[][] => {
    const result: Team[][] = [];
    teams.forEach(team => {
      result.push([team]);
    });

    return result;
  };

  private distanceBetweenTeams = (team1: Team, team2: Team): number => {
    const getTeamIndex = (teamToFind: Team): number => this.teams.findIndex(team => team.name === teamToFind.name);

    return this.distanceMatrix[getTeamIndex(team1)][getTeamIndex(team2)];
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

  private calculateComponentDistance = (component: Team[]): number => {
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

  private calculateComponentWeight = (component: Team[]): number => {
    return component.reduce((total, team) => total + (team.weight || 1), 0);
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
    while (true) {
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
        comp1.reduce((acc, team) => acc + (team.weight || 1), 0) +
          comp2.reduce((acc, team) => acc + (team.weight || 1), 0) <=
        this.maxDivisionSize
      ) {
        this.components[index1] = comp1.concat(comp2);
        this.components.splice(index2, 1);

        return true;
      }
    }
    return false;
  }

  private findClosestComponent(singleTeam: Team): { index: number; distance: number } | null {
    let closestComponentIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < this.components.length; i++) {
      if (this.components[i].length < this.maxDivisionSize) {
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
    const smallestComponentIndex = this.components.reduce(
      (minIndex, component, index) => (component.length < this.components[minIndex].length ? index : minIndex),
      0
    );
    const smallestComponent = this.components[smallestComponentIndex];
    this.components.splice(smallestComponentIndex, 1);

    const singleTeamComponents = smallestComponent.map(team => [team]);

    singleTeamComponents.forEach(singleTeam => {
      const closestComponent = this.findClosestComponent(singleTeam[0]);

      if (closestComponent) {
        this.components[closestComponent.index].push(singleTeam[0]);
      } else {
        this.components.push(singleTeam);
      }
    });
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
