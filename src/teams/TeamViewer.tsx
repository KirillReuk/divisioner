import React from 'react';
import { Rivalry, Team } from '../utils/types';
import { RIVALRY_ROW_TINTS } from '../utils/spectralColors';
import { Atom } from 'lucide-react';
import { useReverseGeocoding } from './useReverseGeocoding';
import TeamMapPicker from './TeamMapPicker';
import TeamRow from './TeamRow';
import { useTeamActions } from './useTeamActions';

interface EditableTeamsProps {
  teams: Team[];
  rivalries: Rivalry[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  onOpenPresetModal: () => void;
  setShowRivalry: React.Dispatch<React.SetStateAction<boolean>>;
  mapPickerTeamId: string | null;
  setMapPickerTeamId: React.Dispatch<React.SetStateAction<string | null>>;
}

const TeamView: React.FC<EditableTeamsProps> = ({
  teams,
  rivalries,
  setTeams,
  onOpenPresetModal,
  setShowRivalry,
  mapPickerTeamId,
  setMapPickerTeamId,
}) => {
  const { handleCoordinatesChange } = useReverseGeocoding(teams, setTeams);
  const {
    handleTeamNameChange,
    handleLocationSelect,
    handleLocationFocus,
    handleRemoveTeam,
    handleAddTeam,
    handleCloseMapPicker,
    createMapPickHandler,
  } = useTeamActions({ setTeams, setMapPickerTeamId });
  const canOpenRivalries = teams.length >= 2;
  const teamIdToRivalryIndex = React.useMemo(() => {
    const map = new Map<string, number>();
    rivalries.forEach((rivalry, rivalryIndex) => {
      for (const teamId of rivalry.teamIds) {
        map.set(teamId, rivalryIndex);
      }
    });
    return map;
  }, [rivalries]);
  const parentRowRef = React.useRef<HTMLTableRowElement | null>(null);
  const mapRowRef = React.useRef<HTMLTableRowElement | null>(null);

  React.useEffect(() => {
    if (!mapPickerTeamId) return;

    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const clickedInsideParentRow = Boolean(parentRowRef.current?.contains(target));
      const clickedInsideMapRow = Boolean(mapRowRef.current?.contains(target));
      if (!clickedInsideParentRow && !clickedInsideMapRow) {
        setMapPickerTeamId(null);
      }
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () => document.removeEventListener('mousedown', handleDocumentMouseDown);
  }, [mapPickerTeamId, setMapPickerTeamId]);

  return (
    <div className="p-4 bg-gray-100 shadow-md">
      <div className="relative mb-4">
        <h2 className="text-2xl font-bold">Teams</h2>
        <h5 className="absolute left-0 top-0 text-gray-400 text-right">{teams.length} teams in total</h5>{' '}
      </div>
      <div className="flex justify-between items-center">
        <div className="float-left">
          <button
            onClick={onOpenPresetModal}
            className="text-sm px-2 bg-white rounded border border-black flex items-center gap-1"
          >
            <Atom className="w-4 h-4" />
            Use a Preset
          </button>
        </div>
        <button
          type="button"
          disabled={!canOpenRivalries}
          onClick={() => setShowRivalry(true)}
          title={canOpenRivalries ? undefined : 'To create a rivalry you need at least 2 teams'}
          className={`text-sm px-2 rounded border flex items-center gap-1 float-right disabled:opacity-60 disabled:cursor-not-allowed ${
            canOpenRivalries ? 'bg-white border-black' : 'bg-gray-200 border-gray-400 text-gray-500'
          }`}
        >
          <Atom className="w-4 h-4" />
          {'Open Rivalries'}
        </button>
      </div>
      <table className="w-full min-w-[860px] transition-all duration-300">
        <colgroup>
          <col className="w-[20%]" />
          <col className="w-[55%]" />
          <col className="w-[20%]" />
          <col className="min-w-[24px]" />
        </colgroup>
        <thead>
          <tr>
            <th className="text-lg text-left font-medium p-2">Team Name</th>
            <th className="text-lg text-left font-medium p-2">Location</th>
            <th className="text-lg text-left font-medium p-2">Coordinates</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => {
            const rivalryIndex = teamIdToRivalryIndex.get(team.id) ?? null;
            const rivalryRowStyle = rivalryIndex === null ? null : (RIVALRY_ROW_TINTS[rivalryIndex] ?? null);
            return (
              <React.Fragment key={team.id}>
                <TeamRow
                  team={team}
                  rivalryRowStyle={rivalryRowStyle}
                  rowRef={mapPickerTeamId === team.id ? parentRowRef : undefined}
                  onTeamNameChange={handleTeamNameChange}
                  onLocationSelect={handleLocationSelect}
                  onLocationFocus={handleLocationFocus}
                  onCoordinateChange={handleCoordinatesChange}
                  onRemove={handleRemoveTeam}
                />
                {mapPickerTeamId === team.id && (
                  <tr ref={mapPickerTeamId === team.id ? mapRowRef : undefined}>
                    <td colSpan={4}>
                      <TeamMapPicker
                        latitude={team.latitude}
                        longitude={team.longitude}
                        onPick={createMapPickHandler(team.id)}
                        onClose={handleCloseMapPicker}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <button onClick={handleAddTeam} className="w-full mt-4 bg-green-500 text-white px-4 py-2 rounded">
        <span className="text-xl font-bold">+</span> Add Team
      </button>
    </div>
  );
};

export default TeamView;
