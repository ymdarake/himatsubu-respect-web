import React from 'react';
import { SceneryObject } from '../types';

interface SceneryProps {
  scenery: SceneryObject;
}

const Scenery: React.FC<SceneryProps> = ({ scenery }) => {
  const { type, x, variant } = scenery;

  const renderScenery = () => {
    switch (type) {
      case 'tree':
        return (
          <div className="relative w-20 h-40" style={{ transform: `scale(${variant.scale})` }}>
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-20 ${variant.trunkColor}`}></div>
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-20 h-24 ${variant.color} rounded-full`}></div>
          </div>
        );
      case 'bush':
        return (
          <div 
            className={`w-16 h-10 ${variant.color} rounded-t-full`} 
            style={{ transform: `scale(${variant.scale})` }}
          />
        );
      case 'rock':
        return (
           <div 
            className={`w-12 h-8 ${variant.color} rounded-lg transform -skew-x-12`} 
            style={{ transform: `scale(${variant.scale})` }}
          />
        );
      case 'stalagmite':
        return (
          <div 
            className="w-0 h-0" 
            style={{ 
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderBottom: `60px solid ${variant.color.replace('bg-', '')}`, // a bit of a hack for tailwind colors
                transform: `scale(${variant.scale})`
            }}
          />
        );
      case 'crystal':
        return (
           <div 
            className={`w-8 h-12 ${variant.color} transform rotate-45 border-2 border-white/30`} 
            style={{ transform: `scale(${variant.scale}) rotate(45deg)` }}
          />
        );
      case 'pillar':
        return (
            <div className={`w-12 h-48 ${variant.color} border-x-4 border-black/20`} style={{ transform: `scale(${variant.scale})` }}>
                 <div className="w-full h-4 bg-black/10"></div>
                 <div className="w-16 h-4 bg-black/10 -ml-2 mt-40"></div>
            </div>
        )
      default:
        return null;
    }
  };

  return (
    <div className="absolute bottom-8" style={{ left: `${x}px`, zIndex: 5 }}>
      {renderScenery()}
    </div>
  );
};

export default Scenery;
