import React from 'react';
import { Rivalry, Tab, Team } from '../utils/types';

interface EditableTeamsProps {
  teams: Team[];
  divisionsCount: number;
  rivalries: Rivalry[];
  generateConferences: (teams: Team[], divisionCount: number, rivalries: Rivalry[]) => void;
  setDivisionsCount: React.Dispatch<React.SetStateAction<number>>;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
}

const DivisionCountInput: React.FC<EditableTeamsProps> = ({
  teams,
  divisionsCount,
  rivalries,
  generateConferences,
  setDivisionsCount,
  setActiveTab,
}) => {
  const updateDivisionsCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setDivisionsCount(value);
    }
  };
  const canGenerateDivisions = teams.length > 0;

  return (
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
        disabled={!canGenerateDivisions}
        onClick={() => {
          generateConferences(teams, Math.min(divisionsCount, teams.length), rivalries);
          setActiveTab('divisions');
        }}
        title={!canGenerateDivisions ? 'To generate divisions you need at least one team' : undefined}
        className="flex-1 bg-blue-500 text-white rounded h-8 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Generate Divisions
      </button>
    </div>
  );
};

export default DivisionCountInput;
