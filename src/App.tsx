import { useState } from 'react';
import { divisionCount, Team, teams } from './data/teams';
import Partitioning, { splitIntoConferences } from './utils/partitioning';
import MapView from './MapView';
import './App.css';

const App: React.FC = () => {
  const [divisions, setDivisions] = useState<Team[][]>([]);
  const [conferences, setConferences] = useState<Team[][][]>([]);

  const generateConferences = () => {
    const partitioning = new Partitioning(teams, divisionCount);
    const divisions = partitioning.getDivisions();
    setDivisions(divisions);
    const conferences = splitIntoConferences(divisions);
    setConferences(conferences);
  };

  return (
    <>
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
          <button onClick={generateConferences} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
            Generate Divisions
          </button>

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
      </div>

      <div className="h-[600px] w-full">
        <MapView divisions={divisions} />
      </div>
    </>
  );
};

export default App;
