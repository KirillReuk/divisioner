import React from 'react';
import { Info } from 'lucide-react';
import Modal from './components/Modal/Modal';

interface IntroModalProps {
  onClose: () => void;
}

const IntroModal: React.FC<IntroModalProps> = ({ onClose }) => {
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={
        <>
          <Info className="text-blue-500" />
          <span>How this works</span>
        </>
      }
      // panelClassName="bg-white p-6 rounded-lg shadow-md max-w-sm w-full"
      titleClassName="text-xl font-bold flex items-center gap-2 justify-center"
      titleWrapperClassName="mb-4"
    >
      <p className="mb-4 text-gray-700 text-left">
          Add your own teams or use presets like the&nbsp;NBA. The app will auto-generate divisions and show them on&nbsp;a&nbsp;map.
          You can tweak team lists or regenerate groups as&nbsp;needed.
      </p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={onClose}>
        Got it!
      </button>
    </Modal>
  );
};

export default IntroModal;
