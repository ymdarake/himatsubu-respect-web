import React, { useMemo } from 'react';
import { Player, PlayStats } from '../types';
import { STAGE_LENGTH } from '../constants/game';
import { AREAS } from '../data/areas';

interface TeleporterModalProps {
  player: Player;
  playStats: PlayStats;
  currentStageIndex: number;
  onTeleport: (targetStageIndex: number) => void;
  onClose: () => void;
}

const TeleporterModal: React.FC<TeleporterModalProps> = ({ player, playStats, currentStageIndex, onTeleport, onClose }) => {
  const maxStage = useMemo(() => {
    return Math.floor(playStats.farthestDistance / STAGE_LENGTH);
  }, [playStats.farthestDistance]);

  const stages = useMemo(() => {
    const stageList = [];
    for (let i = 0; i <= maxStage; i++) {
      const areaIndex = Math.floor(i / 10);
      const area = AREAS[Math.min(areaIndex, AREAS.length - 1)];
      const stageInArea = (i % 10) + 1;
      const cost = Math.abs(i - currentStageIndex) * 7;
      stageList.push({
        stageIndex: i,
        name: `${area.name} ${stageInArea}`,
        cost,
      });
    }
    return stageList;
  }, [maxStage, currentStageIndex]);

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-2 sm:p-4 font-mono">
      <div className="w-full max-w-2xl h-[95vh] sm:h-[90vh] bg-indigo-900 border-4 border-indigo-700 rounded-lg p-3 sm:p-6 text-white shadow-lg flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl sm:text-3xl text-center text-purple-300 border-b-2 border-indigo-800 pb-2 flex-grow">転送屋</h2>
          <button onClick={onClose} className="ml-4 text-3xl font-bold text-red-400 hover:text-red-200">&times;</button>
        </div>

        <div className="flex-grow overflow-hidden min-h-0 bg-black bg-opacity-30 p-2 sm:p-3 rounded-lg border border-indigo-800">
          <div className="h-full overflow-y-auto">
            <div className="space-y-2">
              {stages.map(({ stageIndex, name, cost }) => {
                const canAfford = player.gold >= cost;
                const isCurrent = stageIndex === currentStageIndex;
                const disabled = !canAfford || isCurrent;
                
                return (
                  <div key={stageIndex} className={`grid grid-cols-12 gap-2 items-center p-2 rounded text-sm ${!canAfford && !isCurrent ? 'bg-red-900/50' : 'bg-black/40'}`}>
                    <div className="col-span-6 sm:col-span-5 font-bold truncate">{name}</div>
                    <div className="col-span-6 sm:col-span-4 text-right">
                        {isCurrent ? (
                             <span className="font-bold text-gray-500">現在地</span>
                        ) : (
                             <span className={`font-bold ${!canAfford ? 'text-red-400' : 'text-yellow-400'}`}>{cost} G</span>
                        )}
                    </div>
                    <div className="col-span-12 sm:col-span-3 text-right">
                      <button
                        onClick={() => onTeleport(stageIndex)}
                        disabled={disabled}
                        className="w-full sm:w-auto px-3 py-1 bg-purple-600 font-bold rounded text-xs hover:bg-purple-500 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        転送
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 text-right border-t-2 border-indigo-800 pt-3 flex justify-between items-center flex-shrink-0">
          <button onClick={onClose} className="px-6 py-2 bg-blue-700 font-bold rounded hover:bg-blue-600 transition-colors">
            やめる
          </button>
          <p className="text-base sm:text-lg">所持G: <span className="font-bold text-yellow-400">{player.gold}</span></p>
        </div>
      </div>
    </div>
  );
};

export default TeleporterModal;