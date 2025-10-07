import React from 'react';
import { Structure } from '../types';

interface ShopProps {
  structure: Structure;
}

const ShopStructure: React.FC<ShopProps> = ({ structure }) => {
    const getShopIcon = () => {
        switch(structure.type) {
            case 'weapon_shop': return '⚔️'; // Sword
            case 'armor_shop': return '🛡️'; // Shield
            case 'accessory_shop': return '💍'; // Ring
            default: return '💰';
        }
    }
  return (
    <div className="absolute bottom-8" style={{ left: `${structure.x}px`, zIndex: 10 }}>
      <div className="relative w-24 h-28">
        {/* Sign Post */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-24 bg-yellow-800 border-2 border-black" />
        {/* Sign Board */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-20 bg-yellow-600 border-2 border-black rounded-md flex items-center justify-center">
            <span className="text-4xl">{getShopIcon()}</span>
        </div>
      </div>
    </div>
  );
};

export default ShopStructure;
