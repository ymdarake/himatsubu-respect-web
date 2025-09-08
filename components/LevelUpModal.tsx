import React, { useState, useMemo } from 'react';
import { Player, AllocatableStat, BaseStats } from '../types';

interface LevelUpModalProps {
  player: Player;
  onConfirm: (allocatedStats: Record<AllocatableStat, number>) => void;
}

const baseStatNames: Record<AllocatableStat, string> = {
  strength: '腕力',
  stamina: '体力',
  intelligence: '知力',
  speedAgility: '敏捷',
  luck: '幸運',
};

const LevelUpModal: React.FC<LevelUpModalProps> = ({ player, onConfirm }) => {
  const [points, setPoints] = useState(player.statPoints);
  const [allocated, setAllocated] = useState<Record<AllocatableStat, number>>({
    strength: 0,
    stamina: 0,
    intelligence: 0,
    speedAgility: 0,
    luck: 0,
  });

  const canConfirm = points === 0;

  const handleSubmit = () => {
    if (canConfirm) {
      onConfirm(allocated);
    }
  };
  
  const projectedStats = useMemo(() => {
    const newBase: BaseStats = { ...player.baseStats };
    for (const [stat, value] of Object.entries(allocated)) {
        newBase[stat as AllocatableStat] += value;
    }
    
    // Recalculate derived stats based on new base stats
    return {
        maxHp: 20 + (newBase.stamina * 10) + (newBase.strength * 2),
        physicalAttack: 5 + (newBase.strength * 2) + (newBase.speedAgility * 1),
        physicalDefense: (newBase.stamina * 1) + (newBase.strength * 1),
        magicalAttack: (newBase.intelligence * 2),
        magicalDefense: (newBase.intelligence * 2) + (newBase.stamina * 1),
        speed: 10 + (newBase.speedAgility * 2),
        luckValue: 5 + (newBase.luck * 1),
    };
  }, [player.baseStats, allocated]);

  const StatRow: React.FC<{ stat: AllocatableStat }> = ({ stat }) => {
    const currentValue = player.baseStats[stat];
    const statIncrease = allocated[stat];

    const handleIncrease = () => {
      if (points > 0) {
        setPoints(p => p - 1);
        setAllocated(a => ({ ...a, [stat]: a[stat] + 1 }));
      }
    };
  
    const handleDecrease = () => {
      if (allocated[stat] > 0) {
        setPoints(p => p + 1);
        setAllocated(a => ({ ...a, [stat]: a[stat] - 1 }));
      }
    };

    return (
      <div>
        <div className="grid grid-cols-4 items-center gap-4">
          <span className="font-bold col-span-1">{baseStatNames[stat]}</span>
          <span className="text-right">{currentValue}</span>
          <span className="text-green-400 font-bold w-10 text-left">{statIncrease > 0 ? `+${statIncrease}` : ''}</span>
          <div className="flex items-center justify-end space-x-2">
            <button onClick={handleDecrease} disabled={allocated[stat] === 0} className="w-8 h-8 bg-red-600 rounded-full disabled:bg-gray-600 font-bold">-</button>
            <button onClick={handleIncrease} disabled={points === 0} className="w-8 h-8 bg-green-600 rounded-full disabled:bg-gray-600 font-bold">+</button>
          </div>
        </div>
      </div>
    );
  };
  
  const DerivedStatPreview: React.FC = () => {
      const currentHp = 20 + (player.baseStats.stamina * 10) + (player.baseStats.strength * 2);
      const currentMagicalDefense = (player.baseStats.intelligence * 2) + (player.baseStats.stamina * 1);
      return (
        <div className="mt-6 pt-4 border-t-2 border-yellow-700 text-sm text-center">
            <p className="text-gray-400 mb-2">ステータス変化</p>
            <div className="grid grid-cols-3 gap-2">
                <p>HP: {currentHp} <span className="text-green-400 font-bold">→ {projectedStats.maxHp}</span></p>
                <p>物攻: {5 + (player.baseStats.strength * 2) + (player.baseStats.speedAgility * 1)} <span className="text-green-400 font-bold">→ {projectedStats.physicalAttack}</span></p>
                <p>物防: {(player.baseStats.stamina * 1) + (player.baseStats.strength * 1)} <span className="text-green-400 font-bold">→ {projectedStats.physicalDefense}</span></p>
                <p>魔攻: {player.baseStats.intelligence * 2} <span className="text-green-400 font-bold">→ {projectedStats.magicalAttack}</span></p>
                <p>魔防: {currentMagicalDefense} <span className="text-green-400 font-bold">→ {projectedStats.magicalDefense}</span></p>
                <p>素早さ: {10 + (player.baseStats.speedAgility * 2)} <span className="text-green-400 font-bold">→ {projectedStats.speed}</span></p>
                <p>運気: {5 + (player.baseStats.luck * 1)} <span className="text-green-400 font-bold">→ {projectedStats.luckValue}</span></p>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-gray-800 border-4 border-yellow-500 rounded-lg p-6 text-white font-mono shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl text-center text-yellow-300 mb-4 border-b-2 border-yellow-700 pb-2">レベルアップ！</h2>
        <p className="text-center text-xl mb-6">残り <span className="text-green-400 font-bold">{points}</span> ポイント</p>
        <div className="space-y-3">
          <StatRow stat="strength" />
          <StatRow stat="stamina" />
          <StatRow stat="intelligence" />
          <StatRow stat="speedAgility" />
          <StatRow stat="luck" />
        </div>
        <DerivedStatPreview />
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={!canConfirm}
            className="px-8 py-3 bg-blue-600 font-bold rounded hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;