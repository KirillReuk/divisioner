import React from 'react';
import { Team } from '../data/teams';

interface EditableRivalryProps {
  teams: Team[];
  rivalries: Rivalry[];
  setRivalries: React.Dispatch<React.SetStateAction<Rivalry[]>>;
}

export type Rivalry = {
  team1: Team;
  team2: Team;
};

const RivalryView: React.FC<EditableRivalryProps> = ({ teams, rivalries, setRivalries }) => {
  const handleRivalryTeamChange = (index: number, team1: Team, team2: Team) => {
    const updatedRivalries = [...rivalries];
    updatedRivalries[index] = { team1, team2 };
    setRivalries(updatedRivalries);
  };

  return (
    <div className="p-4 bg-gray-100 shadow-md">
      <h2 className="text-2xl font-bold">Rivalries</h2>
      <h5 className="text-gray-400 mb-4">({rivalries.length} rivalries in total)</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {rivalries.map((rivalry, index) => (
          <div key={index} className="p-2 bg-white shadow rounded-lg">
            <div className="flex gap-4">
              <select
                name="team1"
                id="team1-select"
                onChange={e =>
                  handleRivalryTeamChange(index, teams.find(team => team.name === e.target.value)!, rivalry.team2)
                }
                className="flex-1 p-2 rounded"
                value={rivalry.team1.name}
              >
                {teams.map((team, i) => (
                  <option key={i} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
              <select
                name="team2"
                id="team2-select"
                onChange={e =>
                  handleRivalryTeamChange(index, rivalry.team1, teams.find(team => team.name === e.target.value)!)
                }
                className="flex-1 p-2 rounded"
                value={rivalry.team2.name}
              >
                {teams.map((team, i) => (
                  <option key={i} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setRivalries(rivalries.filter((_, i) => i !== index))}
                className="px-3 bg-white-500 text-black rounded w-sm"
              >
                x
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setRivalries([...rivalries, { team1: teams[0], team2: teams[1] }])}
        className="w-full mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Add Rivalry
      </button>
    </div>
  );
};

export default RivalryView;
