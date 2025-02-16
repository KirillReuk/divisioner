import { Team, Division } from '../data/teams';
import { haversineDistance } from '../utils/distance';

const generateHue = (index: number, total: number): number => (index / total) * 360;
export const shadeHue = (hue: number, saturation: number, value: number): string =>
  `hsl(${hue}, ${saturation}%, ${value}%)`;
const calculateCentroid = (division: Division): { lat: number; lon: number } => {
  let totalLat = 0;
  let totalLon = 0;
  division.teams.forEach(team => {
    totalLat += team.latitude;
    totalLon += team.longitude;
  });

  const numTeams = division.teams.length;
  return { lat: totalLat / numTeams, lon: totalLon / numTeams };
};

export const splitIntoConferences = (components: Division[]): Division[][] => {
  const divisionsWithCentroids = components.map(division => ({
    division,
    centroid: calculateCentroid(division),
  }));

  divisionsWithCentroids.sort((a, b) => {
    return b.centroid.lon - a.centroid.lon;
  });

  const half = Math.ceil(divisionsWithCentroids.length / 2);
  const firstConference = divisionsWithCentroids.slice(0, half).map(d => d.division);
  const secondConference = divisionsWithCentroids.slice(half).map(d => d.division);

  return [firstConference, secondConference];
};

class Partitioning {
  teams: Team[];
  divisionCount: number;
  maxDivisionSize: number;
  distanceMatrix: number[][];
  components: Team[][];

  constructor(teams: Team[], divisionCount: number) {
    const teamsWithIndex = teams.map((team, index) => ({ ...team, index }));
    this.teams = teamsWithIndex;
    this.divisionCount = divisionCount;
    this.maxDivisionSize = Math.ceil(teams.length / divisionCount);
    this.distanceMatrix = this.precomputeDistances();
    this.components = teamsWithIndex.map(team => [team]);
  }

  private distanceBetweenTeams = (team1: Team, team2: Team): number => {
    const team1Index = team1.index || this.teams.indexOf(team1);
    const team2Index = team2.index || this.teams.indexOf(team2);
    return this.distanceMatrix[team1Index][team2Index];
  };

  private precomputeDistances = (): number[][] => {
    const distances: number[][] = [];

    for (let i = 0; i < this.teams.length; i++) {
      distances[i] = [];
      for (let j = 0; j < this.teams.length; j++) {
        distances[i][j] = haversineDistance(
          this.teams[i].latitude,
          this.teams[i].longitude,
          this.teams[j].latitude,
          this.teams[j].longitude
        );
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

  private optimizeDivisions = () => {
    let improved = true;

    while (improved) {
      improved = false;
      let bestSwap = null;
      let bestDistance = this.calculateTotalDistance();

      for (let i = 0; i < this.components.length; i++) {
        for (let j = i + 1; j < this.components.length; j++) {
          const comp1 = this.components[i];
          const comp2 = this.components[j];

          for (let team1 of comp1) {
            for (let team2 of comp2) {
              // Create hypothetical swap
              const newComp1 = comp1.filter(team => team !== team1).concat(team2);
              const newComp2 = comp2.filter(team => team !== team2).concat(team1);

              const newComponents = [...this.components];
              newComponents[i] = newComp1;
              newComponents[j] = newComp2;

              const newDistance = newComponents.reduce(
                (total, component) => total + this.calculateComponentDistance(component),
                0
              );

              if (newDistance < bestDistance) {
                bestDistance = newDistance;
                bestSwap = { i, j, team1, team2 };
                improved = true;
              }
            }
          }
        }
      }

      if (bestSwap) {
        const { i, j, team1, team2 } = bestSwap;
        this.components[i] = this.components[i].filter(team => team !== team1).concat(team2);
        this.components[j] = this.components[j].filter(team => team !== team2).concat(team1);
      }
    }
  };

  private calculateDistances = () => {
    const distances = [];
    for (let i = 0; i < this.components.length; i++) {
      for (let j = i + 1; j < this.components.length; j++) {
        const minDistance = this.components[i]
          .map(team1 => this.components[j].map(team2 => this.distanceBetweenTeams(team1, team2)))
          .flat()
          .reduce((a, b) => Math.min(a, b), Infinity);

        distances.push({ index1: i, index2: j, distance: minDistance });
      }
    }
    return distances.sort((a, b) => a.distance - b.distance);
  };

  public getDivisions = (): Division[] => {
    const maxDivisionSize = Math.ceil(this.teams.length / this.divisionCount);

    while (this.components.length > this.divisionCount) {
      const distances = this.calculateDistances();

      let merged = false;
      for (const { index1, index2 } of distances) {
        const comp1 = this.components[index1];
        const comp2 = this.components[index2];

        if (comp1.length + comp2.length <= maxDivisionSize) {
          this.components[index1] = comp1.concat(comp2);
          this.components.splice(index2, 1);
          merged = true;
          break;
        }
      }

      if (!merged) {
        const smallestIndex = this.components.reduce(
          (minIndex, component, index) => (component.length < this.components[minIndex].length ? index : minIndex),
          0
        );
        const smallestComponent = this.components[smallestIndex];
        this.components.splice(smallestIndex, 1);

        const singleTeamComponents = smallestComponent.map(team => [team]);

        for (const singleTeam of singleTeamComponents) {
          let closestComponentIndex = -1;
          let minDistance = Infinity;

          for (let i = 0; i < this.components.length; i++) {
            if (this.components[i].length < maxDivisionSize) {
              const distance = this.components[i]
                .map(team => this.distanceBetweenTeams(singleTeam[0], team))
                .reduce((a, b) => Math.min(a, b), Infinity);

              if (distance < minDistance) {
                minDistance = distance;
                closestComponentIndex = i;
              }
            }
          }

          if (closestComponentIndex !== -1) {
            this.components[closestComponentIndex].push(singleTeam[0]);
          } else {
            this.components.push(singleTeam);
          }
        }
      }
    }

    this.optimizeDivisions();

    return this.components.map((division, index) => ({
      teams: division,
      hue: generateHue(index, this.components.length),
    }));
  };
}

export default Partitioning;
