import React from 'react';
import { DamageInstance } from '../types';

interface DamageTextProps {
  instance: DamageInstance;
}

const DamageTextComponent: React.FC<DamageTextProps> = ({ instance }) => {
  return (
    <>
      <style>{`
        @keyframes float-up-group {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-80px); opacity: 0; }
        }
        .animate-damage-group {
          animation: float-up-group 1.2s ease-out forwards;
        }
      `}</style>
      <div
        className="absolute bottom-[30px] flex flex-col items-center animate-damage-group pointer-events-none"
        style={{
          left: `${instance.x}px`,
          zIndex: 100,
        }}
      >
        {instance.damages.map((damage, index) => (
          <span
            key={index}
            className="font-bold text-2xl"
            style={{
              color: damage.color,
              textShadow: '1px 1px 2px black',
            }}
          >
            {damage.text}
          </span>
        ))}
      </div>
    </>
  );
};

export default DamageTextComponent;
