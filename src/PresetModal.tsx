import React from 'react';
import { presets } from './data/presets';
import { Team } from './data/teams';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (teams: Team[]) => void;
}

const PresetModal: React.FC<PresetModalProps> = ({ isOpen, onClose, onSelectPreset }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">Select a preset</h2>
        <ul>
          {Object.entries(presets).map(([name, teamList]) => (
            <li key={name} className="mb-2">
              <button
                className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  onSelectPreset(teamList);
                  onClose();
                }}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
        <button className="mt-4 px-4 py-2 text-sm text-gray-600 hover:underline" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PresetModal;
