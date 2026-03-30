import React from 'react';
import { Team } from '../utils/types';
import { Atom } from 'lucide-react';
import { useReverseGeocoding } from './useReverseGeocoding';
import TeamMapPicker from './TeamMapPicker';
import TeamRow from './TeamRow';
import { useTeamActions } from './useTeamActions';

interface EditableTeamsProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  setShowPresetModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRivalry: React.Dispatch<React.SetStateAction<boolean>>;
  mapPickerTeamId: string | null;
  setMapPickerTeamId: React.Dispatch<React.SetStateAction<string | null>>;
}

const TeamView: React.FC<EditableTeamsProps> = ({
  teams,
  setTeams,
  setShowPresetModal,
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
            onClick={() => setShowPresetModal(true)}
            className="text-sm px-2 bg-white rounded border border-black flex items-center gap-1"
          >
            <Atom className="w-4 h-4" />
            Use a Preset
          </button>
        </div>
        <button
          onClick={() => setShowRivalry(true)}
          className="text-sm px-2 bg-white rounded border border-black flex items-center gap-1 float-right"
        >
          <Atom className="w-4 h-4" />
          {'Open Rivalries'}
        </button>
      </div>
      <table className="table-fixed max-w-full w-full transition-all duration-300">
        <colgroup>
          <col className="w-[20%]" />
          <col className="w-[55%]" />
          <col className="w-[20%]" />
          <col className="w-[5%]" />
        </colgroup>
        <thead>
          <tr>
            <th className="text-lg text-left font-medium p-2 w-1/2">Team Name</th>
            <th className="text-lg text-left font-medium p-2">Location</th>
            <th className="text-lg text-left font-medium p-2 w-1/6">Coordinates</th>
            <th className=""></th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => (
            <React.Fragment key={team.id}>
              <TeamRow
                team={team}
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
          ))}
        </tbody>
      </table>
      <button onClick={handleAddTeam} className="w-full mt-4 bg-green-500 text-white px-4 py-2 rounded">
        <span className="text-xl font-bold">+</span> Add Team
      </button>
    </div>
  );
};

export default TeamView;
