import React from 'react';
import { Enemy } from '../types';
import HealthBar from './HealthBar';

interface EnemyProps {
  enemy: Enemy;
  isHit: boolean;
  playerX: number;
}

const EnemyComponent: React.FC<EnemyProps> = ({ enemy, isHit, playerX }) => {
   const isPreparing = enemy.attackState === 'preparing';
   const isAttacking = enemy.attackState === 'attacking';

   const hitAnimationClass = isHit ? 'animate-hit-enemy' : '';
   const shapeClass = enemy.shape === 'circle' ? 'rounded-full' : 'rounded-lg';
   const preparingClass = isPreparing ? 'animate-prepare-attack' : '';
   
   const attackDirection = playerX < enemy.x ? 'left' : 'right';
   const attackingClass = isAttacking ? `animate-attack-enemy-${attackDirection}` : '';


  return (
    <div className="absolute bottom-8" style={{ left: `${enemy.x}px`, zIndex: 20 }}>
      <style>{`
        @keyframes hit-enemy {
            0%, 100% { filter: brightness(1); transform: scale(1); }
            50% { filter: brightness(1.5); transform: scale(1.05); }
        }
        .animate-hit-enemy { animation: hit-enemy 0.3s ease-in-out; }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 2s ease-in-out infinite; }

        @keyframes prepare-attack {
            0%, 100% { filter: brightness(1) drop-shadow(0 0 0 transparent); }
            50% { filter: brightness(1.2) drop-shadow(0 0 8px #fca5a5); } /* red-300 */
        }
        .animate-prepare-attack { animation: prepare-attack ${enemy.attackPrepareTime / 1000}s ease-in-out infinite; }

        @keyframes attack-enemy-left {
            0%, 100% { transform: translateX(0) translateY(0); }
            50% { transform: translateX(-30px) translateY(0); }
        }
        .animate-attack-enemy-left { animation: attack-enemy-left ${enemy.attackAnimationTime / 1000}s ease-in-out; }

        @keyframes attack-enemy-right {
            0%, 100% { transform: translateX(0) translateY(0); }
            50% { transform: translateX(30px) translateY(0); }
        }
        .animate-attack-enemy-right { animation: attack-enemy-right ${enemy.attackAnimationTime / 1000}s ease-in-out; }
      `}</style>
      
      {enemy.currentHp < enemy.maxHp && (
          <div className="absolute -top-6 w-20">
            <HealthBar current={enemy.currentHp} max={enemy.maxHp} barColor="bg-red-500" />
          </div>
      )}

      <div 
        className={`relative w-20 h-20 border-2 border-black ${enemy.color} ${shapeClass} ${hitAnimationClass} ${preparingClass} ${attackingClass} ${!isAttacking ? 'animate-float' : ''}`}
      >
         {/* Enemy "face" */}
         <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-6 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default EnemyComponent;