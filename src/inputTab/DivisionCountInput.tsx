import React from 'react';
import { Team, Division } from '../data/teams';
import Partitioning, { splitIntoConferences } from '../utils/partitioning';

interface EditableTeamsProps {
  teams: Team[];
  divisionsCount: number;
  setDivisions: React.Dispatch<React.SetStateAction<Division[]>>;
  setConferences: React.Dispatch<React.SetStateAction<Division[][]>>;
  setDivisionsCount: React.Dispatch<React.SetStateAction<number>>;
  setActiveTab: React.Dispatch<React.SetStateAction<'teams' | 'divisions'>>;
}

const DivisionCountInput: React.FC<EditableTeamsProps> = ({
  teams,
  divisionsCount,
  setDivisions,
  setConferences,
  setDivisionsCount,
  setActiveTab,
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
    <>
      <div className="flex items-center p-4 bg-gray-100 mb-4">
        <label htmlFor="divisions" className="flex-none text-lg font-medium mr-8">
          How many divisions?
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
          onClick={() => {
            generateConferences(teams, divisionsCount);
            setActiveTab('divisions');
          }}
          className="flex-1 bg-blue-500 text-white rounded h-8"
        >
          Generate Divisions
        </button>
      </div>
    </>
  );
};

export default DivisionCountInput;
