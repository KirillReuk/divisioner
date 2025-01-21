import React from 'react';
import { Team } from './data/teams';
import Partitioning, { splitIntoConferences } from './utils/partitioning';

interface EditableTeamsProps {
  teams: Team[];
  conferences: Team[][][];
  divisionsCount: number;
  setDivisions: React.Dispatch<React.SetStateAction<Team[][]>>;
  setConferences: React.Dispatch<React.SetStateAction<Team[][][]>>;
  setDivisionsCount: React.Dispatch<React.SetStateAction<number>>;
}

const DivisionView: React.FC<EditableTeamsProps> = ({
  teams,
  conferences,
  divisionsCount,
  setDivisions,
  setConferences,
  setDivisionsCount,
}) => {
  const generateConferences = (teams: Team[], divisionCount: number) => {
    const partitioning = new Partitioning(teams, divisionCount);
    const divisions = partitioning.getDivisions();
    setDivisions(divisions);
    const conferences = splitIntoConferences(divisions);
    setConferences(conferences);
  };

  const updateDivisionsCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setDivisionsCount(value);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Divisions</h2>
      <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow-md mb-4">
        <label htmlFor="divisions" className="flex-none text-lg font-medium mr-8">
          How many?
        </label>
        <input
          id="divisions"
          type="number"
          min={1}
          value={divisionsCount}
          onChange={updateDivisionsCount}
          className="flex-1 border border-gray-300 rounded-md px-3 max-h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 h-8 mr-2"
        />
        <button
          onClick={() => generateConferences(teams, divisionsCount)}
          className="flex-1 bg-blue-500 text-white rounded h-8"
        >
          Generate Divisions
        </button>
      </div>

      {conferences.length !== 0 && (
        <div className="flex">
          <div className="flex-1">
            <h2 className="font-bold mb-4">Eastern Conference</h2>
            {conferences[0]?.map((division, index) => (
              <div key={`division-${index}`} className="mb-4">
                <h2 className="font-semibold mb-4">Division {index + 1}</h2>
                <ul>
                  {division.map((team, idx) => (
                    <li key={idx}>{team.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex-1">
            <h2 className="font-bold mb-4">Western Conference</h2>
            {conferences[1]?.map((division, index) => (
              <div key={`division-${index}`} className="mb-4">
                <h2 className="font-semibold mb-4">Division {index + 1}</h2>
                <ul>
                  {division.map((team, idx) => (
                    <li key={idx}>{team.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DivisionView;
