import React, { useState, useEffect } from 'react';
import { CloseIcon } from './Icons';

interface NameWallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export const NameWallModal: React.FC<NameWallModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(''); // Reset name when modal opens
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim());
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white border-4 border-black rounded-lg shadow-brutalist w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">為你的塗鴉牆命名</h2>
          <button onClick={onClose} className="p-1">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：我的酷炫創作"
            className="w-full p-3 border-2 border-black rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full mt-4 bg-yellow-400 text-black font-bold py-3 px-6 text-lg rounded-md border-2 border-black shadow-brutalist-sm shadow-brutalist-sm-hover disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
          >
            建立！
          </button>
        </form>
      </div>
    </div>
  );
};
