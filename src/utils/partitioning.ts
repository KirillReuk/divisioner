import { divisionCount, Team } from '../data/teams';
import { haversineDistance } from '../utils/distance';

const distanceBetweenTeams = (team1: Team, team2: Team): number => {
  return haversineDistance(team1.latitude, team1.longitude, team2.latitude, team2.longitude);
};

const calculateComponentDistance = (component: Team[]): number => {
  let totalDistance = 0;
  for (let i = 0; i < component.length; i++) {
    for (let j = i + 1; j < component.length; j++) {
      totalDistance += distanceBetweenTeams(component[i], component[j]);
    }
  }
  return totalDistance;
};

const optimizeDivisions = (components: Team[][]) => {
  const calculateTotalDistance = (): number =>
    components.reduce((total, component) => total + calculateComponentDistance(component), 0);

  let improved = true;

  while (improved) {
    improved = false;
    let bestSwap = null;
    let bestDistance = calculateTotalDistance();

    for (let i = 0; i < components.length; i++) {
      for (let j = i + 1; j < components.length; j++) {
        const comp1 = components[i];
        const comp2 = components[j];

        for (let team1 of comp1) {
          for (let team2 of comp2) {
            // Create hypothetical swap
            const newComp1 = comp1.filter(team => team !== team1).concat(team2);
            const newComp2 = comp2.filter(team => team !== team2).concat(team1);

            const newComponents = [...components];
            newComponents[i] = newComp1;
            newComponents[j] = newComp2;

            const newDistance = newComponents.reduce(
              (total, component) => total + calculateComponentDistance(component),
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
      components[i] = components[i].filter(team => team !== team1).concat(team2);
      components[j] = components[j].filter(team => team !== team2).concat(team1);
    }
  }
};

export const getDivisions = (teams: Team[]): Team[][] => {
  const maxDivisionSize = Math.ceil(teams.length / divisionCount);
  const components: Team[][] = teams.map(team => [team]);

  const calculateDistances = () => {
    const distances = [];
    for (let i = 0; i < components.length; i++) {
      for (let j = i + 1; j < components.length; j++) {
        const minDistance = components[i]
          .map(team1 => components[j].map(team2 => distanceBetweenTeams(team1, team2)))
          .flat()
          .reduce((a, b) => Math.min(a, b), Infinity);

        distances.push({ index1: i, index2: j, distance: minDistance });
      }
    }
    return distances.sort((a, b) => a.distance - b.distance);
  };

  while (components.length > divisionCount) {
    const distances = calculateDistances();

    let merged = false;
    for (const { index1, index2 } of distances) {
      const comp1 = components[index1];
      const comp2 = components[index2];

      if (comp1.length + comp2.length <= maxDivisionSize) {
        // Merge the two components
        components[index1] = comp1.concat(comp2);
        components.splice(index2, 1);
        merged = true;
        break;
      }
    }

    if (!merged) {
      // No valid merge was found, so split the smallest component
      const smallestIndex = components.reduce(
        (minIndex, component, index) => (component.length < components[minIndex].length ? index : minIndex),
        0
      );
      const smallestComponent = components[smallestIndex];
      components.splice(smallestIndex, 1);

      const singleTeamComponents = smallestComponent.map(team => [team]);

      for (const singleTeam of singleTeamComponents) {
        let closestComponentIndex = -1;
        let minDistance = Infinity;

        for (let i = 0; i < components.length; i++) {
          if (components[i].length < maxDivisionSize) {
            const distance = components[i]
              .map(team => distanceBetweenTeams(singleTeam[0], team))
              .reduce((a, b) => Math.min(a, b), Infinity);

            if (distance < minDistance) {
              minDistance = distance;
              closestComponentIndex = i;
            }
          }
        }

        if (closestComponentIndex !== -1) {
          components[closestComponentIndex].push(singleTeam[0]);
        } else {
          components.push(singleTeam); // Create a new component if no incomplete components exist
        }
      }
    }
  }

  optimizeDivisions(components);

  return components;
};
