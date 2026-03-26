import React from 'react';
import { X } from 'lucide-react';
import { Rivalry, Team } from '../utils/types';
import Modal from '../components/Modal/Modal';

interface RivalryModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  rivalries: Rivalry[];
  setRivalries: React.Dispatch<React.SetStateAction<Rivalry[]>>;
}

const RivalryModal: React.FC<RivalryModalProps> = ({ isOpen, onClose, teams, rivalries, setRivalries }) => {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Rivalries">
      <div className="mb-4">
        <h5 className="text-gray-400 pt-1">{rivalries.length} rivalries in total</h5>
      </div>

      <table className="table-fixed">
        <colgroup>
          <col className="w-[95%]" />
          <col className="w-[5%]" />
        </colgroup>
        <thead>
          <tr>
            <th className="text-lg text-left font-medium p-2"></th>
            <th className="text-lg text-left font-medium p-2"></th>
          </tr>
        </thead>
        <tbody>
          {rivalries.length === 0 && (
            <tr>
              <td colSpan={2} className="p-4 text-sm text-gray-500 text-center">
                No rivalries yet. Click &quot;Add Rivalry&quot; to create your first one.
              </td>
            </tr>
          )}

          {rivalries.map((rivalry, rivalryIndex) => {
            const usedTeams = new Set(rivalries.flatMap(r => r.teams.map(t => t.name)));

            return (
              <tr key={`rivalry-${rivalryIndex}`} className="border-b border-t border-black last:border-b-0">
                <td className="p-2">
                  <div className="flex flex-col gap-2">
                    {rivalry.teams.map((team, teamIndex) => {
                      const options = teams.filter(t => t.name === team.name || !usedTeams.has(t.name));

                      return (
                        <div key={teamIndex} className="flex items-center gap-1">
                          <select
                            value={team.name}
                            onChange={e => {
                              const selectedTeam = teams.find(t => t.name === e.target.value)!;
                              handleTeamChange(rivalryIndex, teamIndex, selectedTeam);
                            }}
                            className="p-2 rounded border bg-gray-100 focus:bg-white hover:bg-white duration-300 ease-out"
                          >
                            {options.map(optionTeam => (
                              <option key={optionTeam.name} value={optionTeam.name}>
                                {optionTeam.name}
                              </option>
                            ))}
                          </select>
                          {rivalry.teams.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeTeamFromRivalry(rivalryIndex, teamIndex)}
                              className="inline-flex items-center justify-center rounded p-1 text-gray-800 hover:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                              aria-label="Remove team from rivalry"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {teams.length > rivalry.teams.length && (
                      <button
                        type="button"
                        onClick={() => addTeamToRivalry(rivalryIndex)}
                        className="self-start text-sm px-2 py-1 bg-white rounded border border-black disabled:opacity-50"
                      >
                        + Add Team to Rivalry
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-2 text-center align-top">
                  <button
                    type="button"
                    onClick={() => removeRivalry(rivalryIndex)}
                    className="inline-flex items-center justify-center rounded p-1 text-gray-800 hover:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    aria-label="Delete rivalry"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button onClick={addRivalry} className="w-full mt-4 bg-green-500 text-white px-4 py-2 rounded">
        <span className="text-xl font-bold">+</span> Add Rivalry
      </button>
    </Modal>
  );
};

export default RivalryModal;
