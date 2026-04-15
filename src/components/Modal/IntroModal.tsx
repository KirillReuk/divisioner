import React from 'react';
import { Info } from 'lucide-react';
import Modal from './Modal';

interface IntroModalProps {
  onClose: () => void;
}

const IntroModal: React.FC<IntroModalProps> = ({ onClose }) => (
  <Modal
    isOpen={true}
    onClose={onClose}
    title={
      <span className="inline-flex items-end gap-2">
        <Info className="inline text-blue-500" />
        <span className="leading-[24px]">How this works</span>
      </span>
    }
  >
    <p className="mb-4 text-gray-700 text-left">
      Add your own teams or use presets like the&nbsp;NBA. The app will auto-generate divisions and show them
      on&nbsp;a&nbsp;map. You can tweak team lists or regenerate groups as&nbsp;needed.
    </p>
    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={onClose}>
      Got it!
    </button>
  </Modal>
);

export default IntroModal;
