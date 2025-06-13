import React from 'react';
import { Info } from 'lucide-react';

interface IntroModalProps {
  onClose: () => void;
}

const IntroModal: React.FC<IntroModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
        <div className="flex items-center gap-2 mb-4  justify-center">
          <Info className="text-blue-500" />  
          <h2 className="text-xl font-bold">How this works</h2>
        </div>
        <p className="mb-4 text-gray-700 text-left">
          Add your own teams or use presets like the&nbsp;NBA. The app will auto-generate divisions and show them on&nbsp;a&nbsp;map.
          You can tweak team lists or regenerate groups as&nbsp;needed.
        </p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={onClose}>
          Got it!
        </button>
      </div>
    </div>
  );
};

export default IntroModal;
