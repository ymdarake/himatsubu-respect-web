import React, { useMemo, useState } from 'react';
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

  const [selectedStage, setSelectedStage] = useState(currentStageIndex);

  const selectedStageInfo = useMemo(() => {
    const areaIndex = Math.floor(selectedStage / 10);
    const area = AREAS[Math.min(areaIndex, AREAS.length - 1)];
    const stageInArea = (selectedStage % 10) + 1;
    const cost = Math.abs(selectedStage - currentStageIndex) * 7;
    return {
      name: `${area.name} ${stageInArea}`,
      cost,
      canAfford: player.gold >= cost,
      isCurrent: selectedStage === currentStageIndex,
    };
  }, [selectedStage, currentStageIndex, player.gold]);

  const handleTeleport = () => {
    if (!selectedStageInfo.isCurrent && selectedStageInfo.canAfford) {
      onTeleport(selectedStage);
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-2 sm:p-4 font-mono">
      <div className="w-full max-w-2xl bg-indigo-900 border-4 border-indigo-700 rounded-lg p-4 sm:p-6 text-white shadow-lg flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl text-purple-300 border-b-2 border-indigo-800 pb-2 flex-grow">転送屋</h2>
          <button onClick={onClose} className="ml-4 text-3xl font-bold text-red-400 hover:text-red-200">&times;</button>
        </div>

        {/* 転送先選択スライダー */}
        <div className="bg-black bg-opacity-30 p-4 sm:p-6 rounded-lg border border-indigo-800">
          <div className="mb-6">
            <label className="block text-sm sm:text-base mb-3 text-purple-200">転送先を選択</label>
            <input
              type="range"
              min="0"
              max={maxStage}
              value={selectedStage}
              onChange={(e) => setSelectedStage(Number(e.target.value))}
              className="w-full h-3 bg-indigo-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              style={{
                background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(selectedStage / maxStage) * 100}%, #312e81 ${(selectedStage / maxStage) * 100}%, #312e81 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>ステージ 0</span>
              <span>ステージ {maxStage}</span>
            </div>
          </div>

          {/* 選択中のステージ情報 */}
          <div className="bg-indigo-950 p-4 rounded-lg border border-indigo-700">
            <div className="grid grid-cols-2 gap-4 text-base sm:text-lg">
              <div>
                <span className="text-gray-400">転送先:</span>
                <p className="font-bold text-xl sm:text-2xl text-purple-300 mt-1">{selectedStageInfo.name}</p>
              </div>
              <div className="text-right">
                <span className="text-gray-400">費用:</span>
                {selectedStageInfo.isCurrent ? (
                  <p className="font-bold text-xl sm:text-2xl text-gray-500 mt-1">現在地</p>
                ) : (
                  <p className={`font-bold text-xl sm:text-2xl mt-1 ${selectedStageInfo.canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                    {selectedStageInfo.cost} G
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ボタン */}
        <div className="flex justify-between items-center border-t-2 border-indigo-800 pt-4">
          <button onClick={onClose} className="px-6 py-2 bg-blue-700 font-bold rounded hover:bg-blue-600 transition-colors">
            やめる
          </button>
          <div className="flex items-center gap-4">
            <p className="text-base sm:text-lg">所持G: <span className="font-bold text-yellow-400">{player.gold}</span></p>
            <button
              onClick={handleTeleport}
              disabled={selectedStageInfo.isCurrent || !selectedStageInfo.canAfford}
              className="px-6 py-2 bg-purple-600 font-bold rounded hover:bg-purple-500 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              転送する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeleporterModal;