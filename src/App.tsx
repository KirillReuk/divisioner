import { useState } from 'react';
import { Team, teams } from './data/teams';
import { getDivisions } from './utils/partitioning';
import './App.css';

const App: React.FC = () => {
  const [divisions, setDivisions] = useState<Team[][]>([]);

  const generateDivisions = () => {
    const divisions = getDivisions(teams);
    setDivisions(divisions);
  };

  return (
    <div className="flex p-4">
      <div className="flex-1 mr-8">
        <h2 className="text-xl font-bold mb-4">Teams</h2>
        <ul>
          {teams.map((team, index) => (
            <li key={index} className="mb-2">
              <span>{team.name}</span> -{' '}
              <span>
                ({team.latitude}, {team.longitude})
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4">Divisions</h2>
        <button onClick={generateDivisions} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
          Generate Divisions
        </button>

        <>
          {divisions.map((division, index) => (
            <div key={`division-${index}`} className="mb-4">
              <h2 className="font-semibold mb-4">Division {index + 1}</h2>
              <ul>
                {division.map((team, idx) => (
                  <li key={idx}>{team.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </>
      </div>
    </div>
  );
};

export default App;
