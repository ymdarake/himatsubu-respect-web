import React from 'react';
import { Structure } from '../types';

interface HouseProps {
  structure: Structure;
}

const House: React.FC<HouseProps> = ({ structure }) => {
  return (
    <div className="absolute bottom-8" style={{ left: `${structure.x}px`, zIndex: 10 }}>
      {/* Main container for house parts */}
      <div className="relative w-[120px] h-[120px]">
        {/* Base - positioned at the bottom, centered horizontally */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-20 bg-yellow-700 border-2 border-black">
          {/* Door */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-12 bg-yellow-900 border-t-2 border-l-2 border-r-2 border-black" />
        </div>
        {/* Roof - positioned on top of the base, centered horizontally */}
        <div
          className="w-0 h-0 absolute left-1/2 -translate-x-1/2"
          style={{
            borderLeft: '60px solid transparent',
            borderRight: '60px solid transparent',
            borderBottom: '40px solid #dc2626', // red-600
            bottom: '78px', // Adjust for base border to prevent floating
          }}
        />
      </div>
    </div>
  );
};

export default House;