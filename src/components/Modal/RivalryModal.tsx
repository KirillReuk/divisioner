import React from 'react';
import { UserMinus, Trash2 } from 'lucide-react';
import { MAX_RIVALRIES } from '../../data/constants';
import { Rivalry, Team } from '../../utils/types';
import Modal from './Modal';
import { TeamBuilderAction } from '../../app/teamBuilderReducer';

interface RivalryModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  divisionsCount: number;
  rivalries: Rivalry[];
  dispatch: React.Dispatch<TeamBuilderAction>;
}

const RivalryModal: React.FC<RivalryModalProps> = ({ isOpen, onClose, teams, divisionsCount, rivalries, dispatch }) => {
  const teamById = new Map(teams.map(team => [team.id, team]));
  const maxRivalrySize = Math.ceil(teams.length / divisionsCount);

  const handleTeamChange = (rivalryIndex: number, teamIndex: number, teamId: string) => {
    dispatch({ type: 'UPDATE_RIVALRY_TEAM', payload: { rivalryIndex, teamIndex, teamId } });
  };

  const addTeamToRivalry = (rivalryIndex: number) => {
    if (rivalries[rivalryIndex].teamIds.length >= maxRivalrySize) return;
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
    if (rivalries.length >= MAX_RIVALRIES) return;
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
    <Modal isOpen={isOpen} onClose={onClose} title="Rivalries" showCloseButton={false}>
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
              <td colSpan={2} className="p-4 text-sm text-center">
                <div className="flex flex-col gap-2 text-gray-500 max-w-md mx-auto">
                  <p>
                    Rivalries make sure that teams in the same rivalry stay in the same division when divisions are
                    built.
                  </p>
                  <p className="text-gray-500">
                    No rivalries yet. Click &quot;Add Rivalry&quot; to create your first one.
                  </p>
                </div>
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

                    {(teams.length > rivalry.teamIds.length || rivalry.teamIds.length >= maxRivalrySize) && (
                      <div className="flex flex-col gap-1 self-start">
                        <button
                          type="button"
                          onClick={() => addTeamToRivalry(rivalryIndex)}
                          disabled={rivalry.teamIds.length >= maxRivalrySize}
                          aria-describedby={
                            rivalry.teamIds.length >= maxRivalrySize
                              ? `rivalry-${rivalryIndex}-max-size-hint`
                              : undefined
                          }
                          className="text-sm px-2 py-1 bg-white rounded border border-black disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {rivalry.teamIds.length >= maxRivalrySize
                            ? 'Max rivalry size reached'
                            : '+ Add Team to Rivalry'}
                        </button>
                      </div>
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

      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={addRivalry}
          disabled={rivalries.length >= MAX_RIVALRIES}
          title={
            rivalries.length >= MAX_RIVALRIES ? `At most ${MAX_RIVALRIES} rivalries` : undefined
          }
          className="w-full text-sm py-1.5 px-3 bg-green-500 text-white rounded font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="text-base font-bold">+</span> Add Rivalry
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full text-sm py-1.5 px-3 rounded border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
        >
          All done
        </button>
      </div>
    </Modal>
  );
};

export default RivalryModal;
