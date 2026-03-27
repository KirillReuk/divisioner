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
    <Modal isOpen={isOpen} onClose={onClose} title="Select a preset">
      <ul>
        {Object.entries(presets).map(([name, teamList]) => (
          <li key={name} className="mb-2">
            <button
              className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => {
                onSelectPreset(teamList.map(team => ({ ...team, id: crypto.randomUUID() })));
                onClose();
              }}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default PresetModal;
