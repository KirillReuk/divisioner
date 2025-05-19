import React from 'react';
import { Rivalry, Team } from '../utils/types';

interface EditableRivalryProps {
  teams: Team[];
  rivalries: Rivalry[];
  setRivalries: React.Dispatch<React.SetStateAction<Rivalry[]>>;
}

const RivalryView: React.FC<EditableRivalryProps> = ({ teams, rivalries, setRivalries }) => {
  const usedTeams = new Set(rivalries.flatMap(rivalry => rivalry.teams.map(team => team.name)));

  const handleTeamChange = (rivalryIndex: number, teamIndex: number, newTeam: Team) => {
    setRivalries(prev =>
      prev.map((rivalry, i) =>
        i === rivalryIndex
          ? { ...rivalry, teams: rivalry.teams.map((team, j) => (j === teamIndex ? newTeam : team)) }
          : rivalry
      )
    );
  };

  const addTeamToRivalry = (rivalryIndex: number) => {
    const availableTeams = teams.filter(
      team => !rivalries.some(rivalry => rivalry.teams.some(rt => rt.name === team.name))
    );
    const fallback = availableTeams.find(team => !rivalries[rivalryIndex].teams.includes(team));
    if (!fallback) return;
    setRivalries(prev =>
      prev.map((rivalry, i) => (i === rivalryIndex ? { ...rivalry, teams: [...rivalry.teams, fallback] } : rivalry))
    );
  };

  const removeTeamFromRivalry = (rivalryIndex: number, teamIndex: number) => {
    setRivalries(prev =>
      prev.map((rivalry, i) =>
        i === rivalryIndex ? { ...rivalry, teams: rivalry.teams.filter((_, j) => j !== teamIndex) } : rivalry
      )
    );
  };

  const removeRivalry = (rivalryIndex: number) => {
    setRivalries(prev => prev.filter((_, i) => i !== rivalryIndex));
  };

  const addRivalry = () => {
    if (teams.length < 2) {
      alert('To create a rivalry you need at least 2 teams');
      return;
    }
    const availableTeams = teams.filter(team => !rivalries.some(rivalry => rivalry.teams.includes(team)));

    if (availableTeams.length < 2) return;

    const [team1, team2] = availableTeams;
    setRivalries([...rivalries, { teams: [team1, team2] }]);
  };

  return (
    <div className="p-4 bg-gray-100 shadow-md">
      <h2 className="text-2xl font-bold">Rivalries</h2>
      <h5 className="text-gray-400 mb-4">({rivalries.length} rivalries in total)</h5>

      <div className="space-y-4">
        {rivalries.map((rivalry, rivalryIndex) => (
          <div key={`rivalry-${rivalryIndex}`} className="bg-white p-4 rounded shadow space-y-2">
            <div className="flex flex-wrap gap-2">
              {rivalry.teams.map((team, teamIndex) => (
                <div key={teamIndex} className="flex items-center gap-1">
                  <select
                    value={team.name}
                    onChange={e => {
                      const selectedTeam = teams.find(team => team.name === e.target.value)!;
                      handleTeamChange(rivalryIndex, teamIndex, selectedTeam);
                    }}
                    className="p-2 rounded border"
                  >
                    {teams
                      .filter(team => team.name === team.name || !usedTeams.has(team.name))
                      .map(team => (
                        <option key={team.name} value={team.name}>
                          {team.name}
                        </option>
                      ))}
                  </select>
                  {rivalry.teams.length > 2 && (
                    <button
                      onClick={() => removeTeamFromRivalry(rivalryIndex, teamIndex)}
                      className="text-red-500 px-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => addTeamToRivalry(rivalryIndex)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                + Add Team
              </button>
              <button onClick={() => removeRivalry(rivalryIndex)} className="bg-red-500 text-white px-3 py-1 rounded">
                Delete Rivalry
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addRivalry} className="w-full mt-6 bg-green-600 text-white px-4 py-2 rounded">
        + Add Rivalry
      </button>
    </div>
  );
};

export default RivalryView;
