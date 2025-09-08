import React from 'react';

interface PlayerProps {
  isAttacking: boolean;
  isHit: boolean;
  isWalking: boolean;
  isDead: boolean;
  x: number;
}

const Player: React.FC<PlayerProps> = ({ isAttacking, isHit, isWalking, isDead, x }) => {
  const animationClasses = isDead
    ? 'animate-dead'
    : isAttacking
    ? 'animate-attack-player'
    : isHit
    ? 'animate-hit'
    : isWalking
    ? 'animate-walk'
    : '';
    
  return (
    <>
      <style>{`
        @keyframes attack-player {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(20px); }
        }
        .animate-attack-player { animation: attack-player 0.3s ease-in-out; }

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
      <div className={`absolute bottom-8 w-16 h-24 bg-blue-500 border-2 border-blue-300 rounded-t-lg ${animationClasses}`} style={{left: `${x}px`, zIndex: 15}}>
        {/* Player "face" */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-8 bg-blue-200 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full mr-2"></div>
            <div className="w-2 h-2 bg-black rounded-full"></div>
        </div>
      </div>
    </>
  );
};

export default Player;