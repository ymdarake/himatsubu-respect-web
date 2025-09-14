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
   const preparingClass = isPreparing ? 'animate-prepare-attack' : '';
   
   const attackDirection = playerX < enemy.x ? 'left' : 'right';
   const attackingClass = isAttacking ? `animate-attack-enemy-${attackDirection}` : '';

   const renderEnemySprite = (name: string) => {
     const svgProps = {
        viewBox: "0 0 20 20",
        xmlns: "http://www.w3.org/2000/svg",
        className: "w-full h-full",
        shapeRendering: "crispEdges" as const
     }
     switch (name) {
        case 'スライム':
            return (
                <svg {...svgProps}>
                  <rect x="6" y="16" width="8" height="1" fill="#16a34a" /> {/* Shadow */}
                  <rect x="5" y="15" width="10" height="1" fill="#22c55e" />
                  <rect x="4" y="12" width="12" height="3" fill="#22c55e" />
                  <rect x="5" y="9" width="10" height="3" fill="#22c55e" />
                  <rect x="6" y="7" width="8" height="2" fill="#22c55e" />
                  <rect x="7" y="6" width="6" height="1" fill="#22c55e" />
                  <rect x="5" y="10" width="1" height="1" fill="#4ade80" /> {/* Highlight */}
                  <rect x="6" y="8" width="2" height="1" fill="#4ade80" /> {/* Highlight */}
                  <rect x="7" y="13" width="1" height="1" fill="#fff" /> {/* Eye */}
                  <rect x="12" y="13" width="1" height="1" fill="#fff" /> {/* Eye */}
                </svg>
            );
        case 'ゴブリン':
            return (
                <svg {...svgProps}>
                    <rect x="8" y="5" width="4" height="1" fill="#15803d" /> {/* Head top */}
                    <rect x="7" y="6" width="6" height="3" fill="#15803d" /> {/* Head main */}
                    <rect x="6" y="7" width="1" height="1" fill="#15803d" /> {/* Left ear */}
                    <rect x="13" y="7" width="1" height="1" fill="#15803d" /> {/* Right ear */}
                    <rect x="8" y="7" width="1" height="1" fill="#facc15" /> {/* Left eye */}
                    <rect x="11" y="7" width="1" height="1" fill="#facc15" /> {/* Right eye */}
                    <rect x="7" y="9" width="6" height="5" fill="#a16207" /> {/* Body/Tunic */}
                    <rect x="6" y="9" width="1" height="3" fill="#15803d" /> {/* Left arm */}
                    <rect x="13" y="9" width="1" height="3" fill="#15803d" /> {/* Right arm */}
                    <rect x="7" y="14" width="2" height="3" fill="#15803d" /> {/* Left leg */}
                    <rect x="11" y="14" width="2" height="3" fill="#15803d" /> {/* Right leg */}
                    <rect x="7" y="17" width="2" height="1" fill="#422006" /> {/* Left foot */}
                    <rect x="11" y="17" width="2" height="1" fill="#422006" /> {/* Right foot */}
                </svg>
            );
        case 'ウルフ':
            return (
                <svg {...svgProps}>
                    <rect x="13" y="16" width="2" height="2" fill="#4b5563" /> {/* Back leg */}
                    <rect x="6" y="16" width="2" height="2" fill="#4b5563" /> {/* Front leg */}
                    <rect x="5" y="10" width="10" height="6" fill="#6b7280" /> {/* Body */}
                    <rect x="4" y="9" width="3" height="3" fill="#6b7280" /> {/* Head */}
                    <rect x="3" y="11" width="2" height="1" fill="#6b7280" /> {/* Snout */}
                    <rect x="4" y="10" width="1" height="1" fill="#ef4444" /> {/* Eye */}
                    <rect x="3" y="12" width="1" height="1" fill="#fff" /> {/* Fang */}
                    <rect x="15" y="9" width="2" height="3" fill="#6b7280" /> {/* Tail */}
                    <rect x="14" y="8" width="1" height="1" fill="#6b7280" />
                    <rect x="5" y="8" width="1" height="1" fill="#6b7280" /> {/* Left ear */}
                    <rect x="7" y="8" width="1" height="1" fill="#6b7280" /> {/* Right ear */}
                </svg>
            );
        case 'バット':
            return (
                <svg {...svgProps}>
                    <rect x="9" y="8" width="2" height="4" fill="#4b5563" /> {/* Body */}
                    <rect x="8" y="7" width="1" height="1" fill="#4b5563" /> {/* Ear */}
                    <rect x="11" y="7" width="1" height="1" fill="#4b5563" /> {/* Ear */}
                    <rect x="9" y="9" width="1" height="1" fill="#ef4444" /> {/* Eye */}
                    <rect x="4" y="7" width="5" height="2" fill="#374151" /> {/* Left wing top */}
                    <rect x="11" y="7" width="5" height="2" fill="#374151" /> {/* Right wing top */}
                    <rect x="2" y="9" width="7" height="2" fill="#374151" /> {/* Left wing mid */}
                    <rect x="11" y="9" width="7" height="2" fill="#374151" /> {/* Right wing mid */}
                    <rect x="3" y="11" width="6" height="1" fill="#374151" /> {/* Left wing bot */}
                    <rect x="11" y="11" width="6" height="1" fill="#374151" /> {/* Right wing bot */}
                </svg>
            );
        case 'スケルトン':
            return (
                <svg {...svgProps}>
                    <rect x="8" y="4" width="4" height="3" fill="#e2e8f0" /> {/* Skull */}
                    <rect x="9" y="5" width="1" height="1" fill="#ef4444" /> {/* Eye */}
                    <rect x="11" y="5" width="1" height="1" fill="#ef4444" /> {/* Eye */}
                    <rect x="7" y="7" width="6" height="1" fill="#e2e8f0" /> {/* Jaw */}
                    <rect x="9" y="8" width="2" height="1" fill="#e2e8f0" /> {/* Neck */}
                    <rect x="7" y="9" width="6" height="4" fill="#e2e8f0" /> {/* Ribs */}
                    <rect x="8" y="9" width="1" height="4" fill="#cbd5e1" />
                    <rect x="11" y="9" width="1" height="4" fill="#cbd5e1" />
                    <rect x="5" y="9" width="2" height="4" fill="#e2e8f0" /> {/* Left Arm */}
                    <rect x="13" y="9" width="2" height="4" fill="#e2e8f0" /> {/* Right Arm */}
                    <rect x="7" y="13" width="2" height="4" fill="#e2e8f0" /> {/* Left Leg */}
                    <rect x="11" y="13" width="2" height="4" fill="#e2e8f0" /> {/* Right Leg */}
                    <rect x="15" y="7" width="1" height="8" fill="#94a3b8" /> {/* Sword */}
                    <rect x="14" y="10" width="3" height="1" fill="#64748b" /> {/* Hilt */}
                </svg>
            );
        case 'トレント':
            return (
                <svg {...svgProps}>
                    <rect x="7" y="10" width="6" height="8" fill="#78350f" />
                    <rect x="6" y="12" width="1" height="5" fill="#78350f" />
                    <rect x="13" y="12" width="1" height="5" fill="#78350f" />
                    <rect x="8" y="12" width="1" height="1" fill="#ef4444" />
                    <rect x="11" y="12" width="1" height="1" fill="#ef4444" />
                    <rect x="4" y="4" width="12" height="6" fill="#166534" />
                    <rect x="6" y="2" width="8" height="2" fill="#166534" />
                    <rect x="2" y="6" width="2" height="3" fill="#16a34a" />
                    <rect x="16" y="6" width="2" height="3" fill="#16a34a" />
                </svg>
            );
        case 'オーク':
            return (
                <svg {...svgProps}>
                    <rect x="6" y="4" width="8" height="5" fill="#556b2f" />
                    <rect x="7" y="9" width="1" height="1" fill="#ffffff" /> {/* Left tusk */}
                    <rect x="12" y="9" width="1" height="1" fill="#ffffff" /> {/* Right tusk */}
                    <rect x="7" y="6" width="2" height="1" fill="#fca5a5" /> {/* Left eye */}
                    <rect x="11" y="6" width="2" height="1" fill="#fca5a5" /> {/* Right eye */}
                    <rect x="5" y="9" width="10" height="6" fill="#556b2f" />
                    <rect x="4" y="9" width="1" height="4" fill="#556b2f" /> {/* Left arm */}
                    <rect x="15" y="9" width="1" height="4" fill="#556b2f" /> {/* Right arm */}
                    <rect x="6" y="15" width="3" height="3" fill="#556b2f" />
                    <rect x="11" y="15" width="3" height="3" fill="#556b2f" />
                </svg>
            );
        case 'リザードマン':
             return (
                 <svg {...svgProps}>
                    <rect x="8" y="5" width="4" height="4" fill="#0d9488" /> {/* Head */}
                    <rect x="7" y="7" width="1" height="1" fill="#0d9488" /> {/* Snout */}
                    <rect x="9" y="6" width="1" height="1" fill="#fef08a" /> {/* Eye */}
                    <rect x="7" y="9" width="6" height="6" fill="#0f766e" /> {/* Body */}
                    <rect x="5" y="9" width="2" height="4" fill="#0d9488" /> {/* Left arm */}
                    <rect x="13" y="9" width="2" height="4" fill="#0d9488" /> {/* Right arm */}
                    <rect x="7" y="15" width="2" height="3" fill="#0d9488" /> {/* Left leg */}
                    <rect x="11" y="15" width="2" height="3" fill="#0d9488" /> {/* Right leg */}
                    <rect x="15" y="3" width="1" height="13" fill="#a16207" /> {/* Spear Shaft */}
                    <rect x="14" y="2" width="3" height="1" fill="#94a3b8" /> {/* Spear Head */}
                 </svg>
             );
        case 'ロック・スパイダー':
            return (
                <svg {...svgProps}>
                    <rect x="7" y="7" width="6" height="6" fill="#44403c" />
                    <rect x="9" y="6" width="2" height="1" fill="#44403c" /> {/* Head */}
                    <rect x="8" y="7" width="1" height="1" fill="#dc2626" />
                    <rect x="11" y="7" width="1" height="1" fill="#dc2626" />
                    <rect x="9" y="8" width="1" height="1" fill="#dc2626" />
                    <rect x="10" y="8" width="1" height="1" fill="#dc2626" />
                    <rect x="4" y="6" width="3" height="1" fill="#57534e" />
                    <rect x="13" y="6" width="3" height="1" fill="#57534e" />
                    <rect x="3" y="8" width="4" height="1" fill="#57534e" />
                    <rect x="13" y="8" width="4" height="1" fill="#57534e" />
                    <rect x="3" y="11" width="4" height="1" fill="#57534e" />
                    <rect x="13" y="11" width="4" height="1" fill="#57534e" />
                    <rect x="4" y="13" width="3" height="1" fill="#57534e" />
                    <rect x="13" y="13" width="3" height="1" fill="#57534e" />
                </svg>
            );
        case 'ゴーレム':
            return (
                <svg {...svgProps}>
                    <rect x="6" y="3" width="8" height="4" fill="#a8a29e" />
                    <rect x="8" y="5" width="1" height="1" fill="#f59e0b" /> {/* Eye */}
                    <rect x="11" y="5" width="1" height="1" fill="#f59e0b" /> {/* Eye */}
                    <rect x="4" y="7" width="12" height="7" fill="#78716c" />
                    <rect x="2" y="8" width="2" height="5" fill="#78716c" />
                    <rect x="16" y="8" width="2" height="5" fill="#78716c" />
                    <rect x="5" y="14" width="4" height="4" fill="#a8a29e" />
                    <rect x="11" y="14" width="4" height="4" fill="#a8a29e" />
                </svg>
            );
        case 'ガーゴイル':
            return (
                <svg {...svgProps}>
                    <rect x="8" y="6" width="4" height="3" fill="#52525b" /> {/* Head */}
                    <rect x="7" y="5" width="1" height="1" fill="#52525b" /> {/* Horn */}
                    <rect x="12" y="5" width="1" height="1" fill="#52525b" /> {/* Horn */}
                    <rect x="9" y="7" width="1" height="1" fill="#ef4444" /> {/* Eye */}
                    <rect x="7" y="9" width="6" height="5" fill="#71717a" /> {/* Body */}
                    <rect x="5" y="14" width="3" height="3" fill="#71717a" /> {/* Left Leg */}
                    <rect x="12" y="14" width="3" height="3" fill="#71717a" /> {/* Right Leg */}
                    <rect x="3" y="7" width="4" height="2" fill="#52525b" /> {/* Left Wing */}
                    <rect x="13" y="7" width="4" height="2" fill="#52525b" /> {/* Right Wing */}
                    <rect x="2" y="9" width="5" height="1" fill="#52525b" />
                    <rect x="13" y="9" width="5" height="1" fill="#52525b" />
                </svg>
            );
        case 'ファイア・エレメンタル':
            return (
                <svg {...svgProps}>
                    <rect x="7" y="15" width="6" height="2" fill="#ea580c" />
                    <rect x="6" y="12" width="8" height="3" fill="#f97316" />
                    <rect x="5" y="10" width="10" height="2" fill="#f97316" />
                    <rect x="7" y="8" width="6" height="2" fill="#f97316" />
                    <rect x="8" y="6" width="4" height="2" fill="#f97316" />
                    <rect x="9" y="4" width="2" height="2" fill="#f97316" />
                    <rect x="8" y="13" width="4" height="2" fill="#fef08a" />
                    <rect x="7" y="11" width="6" height="2" fill="#fcd34d" />
                    <rect x="9" y="9" width="2" height="2" fill="#fef08a" />
                    <rect x="8" y="10" width="1" height="1" fill="#fff" />
                    <rect x="11" y="10" width="1" height="1" fill="#fff" />
                </svg>
            );
        case 'ハーピー':
            return (
                <svg {...svgProps}>
                    <rect x="8" y="5" width="4" height="3" fill="#f0c8a0" /> {/* Head */}
                    <rect x="7" y="8" width="6" height="4" fill="#f0c8a0" /> {/* Body */}
                    <rect x="9" y="6" width="1" height="1" fill="#000" /> {/* Eye */}
                    <rect x="2" y="6" width="5" height="2" fill="#a16207" /> {/* Left Wing */}
                    <rect x="13" y="6" width="5" height="2" fill="#a16207" /> {/* Right Wing */}
                    <rect x="1" y="8" width="6" height="2" fill="#a16207" />
                    <rect x="13" y="8" width="6" height="2" fill="#a16207" />
                    <rect x="7" y="12" width="2" height="3" fill="#ca8a04" /> {/* Left Leg */}
                    <rect x="11" y="12" width="2" height="3" fill="#ca8a04" /> {/* Right Leg */}
                </svg>
            );
        case 'ウィザード':
            return (
                <svg {...svgProps}>
                    <rect x="7" y="2" width="6" height="2" fill="#581c87" /> {/* Hat Top */}
                    <rect x="5" y="4" width="10" height="2" fill="#581c87" /> {/* Hat Brim */}
                    <rect x="7" y="6" width="6" height="3" fill="#f0c8a0" /> {/* Face */}
                    <rect x="8" y="7" width="1" height="1" fill="#fff" /> {/* Eye */}
                    <rect x="11" y="7" width="1" height="1" fill="#fff" /> {/* Eye */}
                    <rect x="6" y="9" width="8" height="8" fill="#6b21a8" /> {/* Robe */}
                    <rect x="3" y="8" width="2" height="4" fill="#581c87" /> {/* Left Arm */}
                    <rect x="15" y="8" width="2" height="4" fill="#581c87" /> {/* Right Arm */}
                    <rect x="1" y="6" width="2" height="8" fill="#a16207" /> {/* Staff */}
                    <rect x="0" y="5" width="4" height="1" fill="#fde047" /> {/* Staff Orb */}
                </svg>
            );
        case 'ミノタウロス':
            return (
                <svg {...svgProps}>
                    <rect x="7" y="2" width="6" height="4" fill="#b45309" /> {/* Head */}
                    <rect x="5" y="3" width="2" height="1" fill="#fef08a" /> {/* Left Horn */}
                    <rect x="13" y="3" width="2" height="1" fill="#fef08a" /> {/* Right Horn */}
                    <rect x="8" y="4" width="1" height="1" fill="#ef4444" /> {/* Eye */}
                    <rect x="11" y="4" width="1" height="1" fill="#ef4444" /> {/* Eye */}
                    <rect x="4" y="6" width="12" height="8" fill="#ca8a04" /> {/* Body */}
                    <rect x="2" y="7" width="2" height="5" fill="#b45309" /> {/* Left Arm */}
                    <rect x="16" y="7" width="2" height="5" fill="#b45309" /> {/* Right Arm */}
                    <rect x="5" y="14" width="4" height="4" fill="#b45309" /> {/* Left Leg */}
                    <rect x="11" y="14" width="4" height="4" fill="#b45309" /> {/* Right Leg */}
                    <rect x="1" y="2" width="1" height="10" fill="#71717a" /> {/* Axe Handle */}
                    <rect x="0" y="1" width="3" height="3" fill="#9ca3af" /> {/* Axe Head */}
                </svg>
            );
        case 'ドラゴン':
            return (
                <svg {...svgProps}>
                    <rect x="8" y="10" width="8" height="6" fill="#450a0a" />
                    <rect x="10" y="8" width="4" height="2" fill="#450a0a" />
                    <rect x="9" y="16" width="2" height="2" fill="#7f1d1d" /> {/* Leg */}
                    <rect x="13" y="16" width="2" height="2" fill="#7f1d1d" /> {/* Leg */}
                    <rect x="6" y="6" width="4" height="4" fill="#450a0a" />
                    <rect x="4" y="8" width="2" height="1" fill="#450a0a" /> {/* Snout */}
                    <rect x="7" y="7" width="1" height="1" fill="#facc15" /> {/* Eye */}
                    <rect x="11" y="5" width="2" height="5" fill="#7f1d1d" />
                    <rect x="13" y="6" width="3" height="3" fill="#7f1d1d" />
                    <rect x="16" y="12" width="3" height="2" fill="#450a0a" />
                    <rect x="18" y="11" width="1" height="1" fill="#450a0a" />
                </svg>
            );
        case 'キマイラ':
            return (
                <svg {...svgProps}>
                    <rect x="6" y="10" width="10" height="6" fill="#b45309" /> {/* Body */}
                    <rect x="16" y="9" width="3" height="1" fill="#15803d" /> {/* Snake Tail */}
                    <rect x="18" y="8" width="1" height="1" fill="#15803d" />
                    <rect x="4" y="6" width="4" height="4" fill="#dc2626" /> {/* Red Head */}
                    <rect x="5" y="7" width="1" height="1" fill="#fff" />
                    <rect x="12" y="6" width="4" height="4" fill="#059669" /> {/* Green Head */}
                    <rect x="13" y="7" width="1" height="1" fill="#fff" />
                    <rect x="2" y="8" width="4" height="4" fill="#7f1d1d" /> {/* Wing */}
                    <rect x="7" y="16" width="3" height="2" fill="#a16207" />
                    <rect x="12" y="16" width="3" height="2" fill="#a16207" />
                </svg>
            );
        case 'ジェムスライム':
            return (
                <svg {...svgProps}>
                  <rect x="6" y="16" width="8" height="1" fill="#a21caf" /> {/* Shadow */}
                  <rect x="5" y="15" width="10" height="1" fill="#d946ef" />
                  <rect x="4" y="12" width="12" height="3" fill="#d946ef" />
                  <rect x="5" y="9" width="10" height="3" fill="#d946ef" />
                  <rect x="6" y="7" width="8" height="2" fill="#d946ef" />
                  <rect x="7" y="6" width="6" height="1" fill="#d946ef" />
                  <rect x="5" y="10" width="1" height="1" fill="#f0abfc" /> {/* Highlight */}
                  <rect x="6" y="8" width="2" height="1" fill="#f0abfc" /> {/* Highlight */}
                  <rect x="7" y="13" width="1" height="1" fill="#fff" /> {/* Eye */}
                  <rect x="12" y="13" width="1" height="1" fill="#fff" /> {/* Eye */}
                  <rect x="9" y="8" width="2" height="1" fill="#3b82f6" />
                  <rect x="8" y="9" width="4" height="1" fill="#60a5fa" />
                  <rect x="9" y="10" width="2" height="1" fill="#3b82f6" />
                </svg>
            );
        default:
            return <div className="w-full h-full bg-pink-500 rounded-lg" />;
     }
   }


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
          <div className="absolute -top-6 w-32">
            <HealthBar current={enemy.currentHp} max={enemy.maxHp} barColor="bg-red-500" />
          </div>
      )}

      <div 
        className={`relative w-32 h-32 ${hitAnimationClass} ${preparingClass} ${attackingClass} ${!isAttacking ? 'animate-float' : ''}`}
        style={{ imageRendering: 'pixelated' }}
      >
         {renderEnemySprite(enemy.name)}
      </div>
    </div>
  );
};

export default EnemyComponent;