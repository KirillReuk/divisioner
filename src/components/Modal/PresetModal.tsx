import React from 'react';
import { presets } from '../../data/presets';
import { Team } from '../../utils/types';
import Modal from './Modal';

interface PresetModalProps {
  isOpen: boolean;
  variant?: 'welcome' | 'plain';
  onClose: () => void;
  onSelectPreset: (payload: { teams: Team[]; divisionsCount?: number }) => void;
}

const PresetModal: React.FC<PresetModalProps> = ({ isOpen, variant = 'plain', onClose, onSelectPreset }) => {
  const isWelcome = variant === 'welcome';

  const presetList = (
    <ul className={isWelcome ? 'mb-4' : undefined}>
      {Object.entries(presets).map(([name, { teams: teamList, divisionsCount }]) => (
        <li key={name} className="mb-2">
          <button
            type="button"
            className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              onSelectPreset({
                teams: teamList.map(team => ({ ...team, id: crypto.randomUUID() })),
                divisionsCount,
              });
              onClose();
            }}
          >
            {name}
          </button>
        </li>
      ))}
    </ul>
  );

  if (isWelcome) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Get started"
        description="Pick a league below to load teams and divisions — most people start here. You can also close this window or use the button below to enter your own teams on the Teams tab."
        panelClassName="bg-white p-6 rounded-lg shadow-md max-w-md w-full"
      >
        {presetList}
        <button
          type="button"
          className="w-full px-4 py-2 rounded border border-gray-300 text-gray-800 hover:bg-gray-50"
          onClick={onClose}
        >
          Enter teams manually
        </button>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select a preset">
      {presetList}
    </Modal>
  );
};

export default PresetModal;
