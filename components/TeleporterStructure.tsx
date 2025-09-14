import React from 'react';
import { Structure } from '../types';

interface TeleporterStructureProps {
  structure: Structure;
}

const TeleporterStructure: React.FC<TeleporterStructureProps> = ({ structure }) => {
  return (
    <div className="absolute bottom-0" style={{ left: `${structure.x}px`, zIndex: 10 }}>
      <style>{`
        @keyframes rotate-teleporter {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-teleporter {
          0%, 100% { filter: drop-shadow(0 0 5px #a78bfa) brightness(1); }
          50% { filter: drop-shadow(0 0 15px #c4b5fd) brightness(1.5); }
        }
        .animate-rotate-teleporter {
          animation: rotate-teleporter 20s linear infinite;
        }
        .animate-pulse-teleporter {
            animation: pulse-teleporter 3s ease-in-out infinite;
        }
      `}</style>
      <div className="relative w-24 h-24 flex items-center justify-center animate-pulse-teleporter">
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full animate-rotate-teleporter"
        >
          {/* Outer circle */}
          <circle cx="50" cy="50" r="48" fill="none" stroke="#a78bfa" strokeWidth="2" />
          {/* Inner circle */}
          <circle cx="50" cy="50" r="25" fill="none" stroke="#c4b5fd" strokeWidth="1" />
          {/* Triangle */}
          <polygon points="50,15 85,75 15,75" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
          {/* Runes */}
          <text x="47" y="12" fontSize="8" fill="#c4b5fd" transform="rotate(0 50 50)">✧</text>
          <text x="86" y="78" fontSize="8" fill="#c4b5fd" transform="rotate(0 50 50)">⬨</text>
          <text x="8" y="78" fontSize="8" fill="#c4b5fd" transform="rotate(0 50 50)">⬧</text>
        </svg>
      </div>
    </div>
  );
};

export default TeleporterStructure;