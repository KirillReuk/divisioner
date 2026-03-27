import React from 'react';
import { UserMinus, Trash2 } from 'lucide-react';
import { Rivalry, Team } from '../utils/types';
import Modal from '../components/Modal/Modal';
import { TeamBuilderAction } from '../state/teamBuilderReducer';

interface RivalryModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  rivalries: Rivalry[];
  dispatch: React.Dispatch<TeamBuilderAction>;
}

const RivalryModal: React.FC<RivalryModalProps> = ({ isOpen, onClose, teams, rivalries, dispatch }) => {
  const teamById = new Map(teams.map(team => [team.id, team]));

  const handleTeamChange = (rivalryIndex: number, teamIndex: number, teamId: string) => {
    dispatch({ type: 'UPDATE_RIVALRY_TEAM', payload: { rivalryIndex, teamIndex, teamId } });
  };

  const addTeamToRivalry = (rivalryIndex: number) => {
    const usedTeamIds = new Set(rivalries.flatMap(rivalry => rivalry.teamIds));
    const fallback = teams.find(
      team => !usedTeamIds.has(team.id) && !rivalries[rivalryIndex].teamIds.includes(team.id)
    );
    if (!fallback) return;
    dispatch({ type: 'ADD_TEAM_TO_RIVALRY', payload: { rivalryIndex, teamId: fallback.id } });
  };

  const removeTeamFromRivalry = (rivalryIndex: number, teamIndex: number) => {
    dispatch({ type: 'REMOVE_TEAM_FROM_RIVALRY', payload: { rivalryIndex, teamIndex } });
  };

  const removeRivalry = (rivalryIndex: number) => {
    dispatch({ type: 'REMOVE_RIVALRY', payload: { rivalryIndex } });
  };

  const addRivalry = () => {
    if (teams.length < 2) {
      alert('To create a rivalry you need at least 2 teams');
      return;
    }
    const usedTeamIds = new Set(rivalries.flatMap(rivalry => rivalry.teamIds));
    const availableTeams = teams.filter(team => !usedTeamIds.has(team.id));

    if (availableTeams.length < 2) return;

    const [team1, team2] = availableTeams;
    dispatch({ type: 'ADD_RIVALRY', payload: { rivalry: { teamIds: [team1.id, team2.id] } } });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rivalries">
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
            const usedTeamIds = new Set(rivalries.flatMap((r, index) => (index === rivalryIndex ? [] : r.teamIds)));

            return (
              <tr key={`rivalry-${rivalryIndex}`} className="border-b border-t border-black last:border-b-0">
                <td className="p-2">
                  <div className="flex flex-col gap-2">
                    {rivalry.teamIds.map((teamId, teamIndex) => {
                      const selectedTeam = teamById.get(teamId);
                      if (!selectedTeam) return null;
                      const usedByOtherSlotsInSameRivalry = new Set(
                        rivalry.teamIds.filter((_, currentTeamIndex) => currentTeamIndex !== teamIndex)
                      );
                      const options = teams.filter(
                        t =>
                          t.id === selectedTeam.id ||
                          (!usedTeamIds.has(t.id) && !usedByOtherSlotsInSameRivalry.has(t.id))
                      );

                      return (
                        <div key={teamId} className="flex items-center gap-1 w-full">
                          <select
                            value={selectedTeam.id}
                            onChange={e => {
                              handleTeamChange(rivalryIndex, teamIndex, e.target.value);
                            }}
                            className="p-2 rounded border bg-gray-100 focus:bg-white hover:bg-white duration-300 ease-out flex-1 min-w-0"
                          >
                            {options.map(optionTeam => (
                              <option key={optionTeam.id} value={optionTeam.id}>
                                {optionTeam.name}
                              </option>
                            ))}
                          </select>
                          {rivalry.teamIds.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeTeamFromRivalry(rivalryIndex, teamIndex)}
                              className="inline-flex items-center justify-center rounded p-1 text-gray-800 hover:bg-white focus:outline-none focus:ring-2 focus:ring-black shrink-0"
                              aria-label={`Remove team ${selectedTeam.name} from rivalry ${rivalryIndex + 1}`}
                              title="Remove team from rivalry"
                            >
                              <UserMinus className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {teams.length > rivalry.teamIds.length && (
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
                    className="inline-flex items-center justify-center rounded p-1 text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600"
                    aria-label={`Delete rivalry ${rivalryIndex + 1}`}
                    title="Delete rivalry"
                  >
                    <Trash2 className="h-4 w-4" />
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
