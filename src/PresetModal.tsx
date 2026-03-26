import React from 'react';
import { presets } from './data/presets';
import { Team } from './utils/types';
import Modal from './components/Modal/Modal';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (teams: Team[]) => void;
}

const PresetModal: React.FC<PresetModalProps> = ({ isOpen, onClose, onSelectPreset }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select a preset"
      // panelClassName="bg-white p-6 rounded-lg shadow-md max-w-sm w-full"
      // titleClassName="text-lg font-semibold"
      // titleWrapperClassName="mb-4"
    >
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
    </Modal>
  );
};

export default PresetModal;
