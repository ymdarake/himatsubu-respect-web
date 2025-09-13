import React from 'react';

interface PlayerProps {
  isAttacking: boolean;
  isHit: boolean;
  isWalking: boolean;
  isDead: boolean;
  x: number;
  attackDirection: 'left' | 'right';
}

const Player: React.FC<PlayerProps> = ({ isAttacking, isHit, isWalking, isDead, x, attackDirection }) => {
  const animationClasses = isDead
    ? 'animate-dead'
    : isAttacking
    ? (attackDirection === 'right' ? 'animate-attack-player-right' : 'animate-attack-player-left')
    : isHit
    ? 'animate-hit'
    : isWalking
    ? 'animate-walk'
    : '';

  return (
    <>
      <style>{`
        @keyframes attack-player-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(20px); }
        }
        .animate-attack-player-right { animation: attack-player-right 0.3s ease-in-out; }
        
        @keyframes attack-player-left {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-20px); }
        }
        .animate-attack-player-left { animation: attack-player-left 0.3s ease-in-out; }

        @keyframes hit {
          0%, 100% { transform: translateX(0); opacity: 1; }
          25% { transform: translateX(-5px); opacity: 0.5; }
          50% { transform: translateX(5px); opacity: 1; }
          75% { transform: translateX(-5px); opacity: 0.5; }
        }
        .animate-hit { animation: hit 0.3s ease-in-out; }

        @keyframes walk {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-5px) rotate(1deg); }
        }
        .animate-walk { animation: walk 0.6s ease-in-out infinite; }
        
        @keyframes dead {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(60px) rotate(90deg); opacity: 0; }
        }
        .animate-dead { 
          animation: dead 1.5s ease-in forwards; 
        }
      `}</style>
      <div
        className={`absolute bottom-8 w-16 h-24 ${animationClasses}`}
        style={{ left: `${x}px`, zIndex: 15, imageRendering: 'pixelated' }}
        aria-label="Player Character"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 16 24"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
        >
          {/* Main Body */}
          <g>
            {/* Hair */}
            <rect x="5" y="2" width="6" height="4" fill="#503820" />
            <rect x="4" y="3" width="1" height="2" fill="#503820" />
            <rect x="11" y="3" width="1" height="2" fill="#503820" />
            
            {/* Head/Face */}
            <rect x="5" y="5" width="6" height="4" fill="#f0c8a0" />
            
            {/* Eyes */}
            <rect x="6" y="6" width="1" height="1" fill="#000000" />
            <rect x="9" y="6" width="1" height="1" fill="#000000" />
            
            {/* Body/Shirt */}
            <rect x="4" y="9" width="8" height="6" fill="#4878a8" />
            
            {/* Arms - one behind, one in front */}
            <rect x="12" y="9" width="2" height="5" fill="#d0a880" /> {/* Back arm - slightly darker */}
            <rect x="2" y="9" width="2" height="5" fill="#f0c8a0" />

            {/* Pants */}
            <rect x="4" y="15" width="3" height="5" fill="#806040" />
            <rect x="9" y="15" width="3" height="5" fill="#806040" />
            
            {/* Boots */}
            <rect x="4" y="20" width="3" height="2" fill="#302010" />
            <rect x="9" y="20" width="3" height="2" fill="#302010" />
          </g>

          {/* Sword for attack animation */}
          {isAttacking && (
            <g transform={attackDirection === 'right' ? 'translate(13 4) rotate(45 0 8)' : 'translate(3 4) rotate(-45 0 8)'}>
              {/* Hilt */}
              <rect x="-2" y="7" width="4" height="1" fill="#806040" />
              <rect x="-1" y="6" width="2" height="3" fill="#806040" />
              {/* Blade */}
              <rect x="-0.5" y="-4" width="1" height="10" fill="#c0c0c0" />
            </g>
          )}
        </svg>
      </div>
    </>
  );
};

export default Player;