import React from 'react';
import { PlayStats, Player, AllocatableStat } from '../types';
import { GEM_COLORS } from '../constants/ui';
import { EQUIPMENT_MASTER_DATA } from '../data/equipmentMaster';

interface PlayStatsPanelProps {
  playStats: PlayStats;
  player: Player;
}

const formatPlayTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const PlayStatsPanel: React.FC<PlayStatsPanelProps> = ({ playStats, player }) => {
    const totalEquipment = EQUIPMENT_MASTER_DATA.length;
    const collectionPercentage = totalEquipment > 0 ? ((playStats.collectedEquipment.size / totalEquipment) * 100).toFixed(1) : "0.0";

    return (
        <div className="p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600 h-full flex flex-col justify-between">
            <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>プレイ時間</span><span className="font-bold">{formatPlayTime(playStats.playTime)}</span></div>
                <div className="flex justify-between"><span>倒した魔物の数</span><span className="font-bold">{playStats.enemiesDefeated}</span></div>
                <div className="flex justify-between"><span>最高到達点</span><span className="font-bold">{Math.floor(playStats.farthestDistance)}m</span></div>
                <div className="flex justify-between"><span>所持G</span><span className="font-bold text-yellow-400">{player.gold} G</span></div>
                <div className="flex justify-between"><span>総獲得EXP</span><span className="font-bold">{playStats.totalXpGained}</span></div>
                <div className="flex justify-between"><span>次のレベルまで EXP</span><span className="font-bold">{player.xpToNextLevel - player.xp}</span></div>
                <div className="flex justify-between">
                    <span>装備品収集率</span>
                    <span className="font-bold">{collectionPercentage}%</span>
                </div>
            </div>
            <div>
                 <p className="text-xs text-center text-gray-400 mb-1 border-t border-gray-700 pt-1">ジェム収集</p>
                 <div className="grid grid-cols-5 gap-1">
                     {Object.entries(playStats.gemCollection).map(([stat, count]) => (
                         <div key={stat} className={`rounded-sm p-1 text-center ${GEM_COLORS[stat as AllocatableStat]}`}>
                            <span className="text-xs font-bold text-white mix-blend-difference">
                                {(count as number) > 0 ? count : ''}
                            </span>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    );
};

export default PlayStatsPanel;