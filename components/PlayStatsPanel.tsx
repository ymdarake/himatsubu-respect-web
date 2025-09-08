import React from 'react';
import { PlayStats, Player, AllocatableStat } from '../types';
import { GEM_COLORS } from '../constants';
import { EQUIPMENT_MASTER_DATA } from '../data/equipmentMaster';

interface PlayStatsPanelProps {
  playStats: PlayStats;
  player: Player;
}

const baseStatNames: Record<AllocatableStat, string> = {
  strength: '腕力',
  stamina: '体力',
  intelligence: '知力',
  speedAgility: '敏捷',
  luck: '幸運',
};

const formatPlayTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const PlayStatsPanel: React.FC<PlayStatsPanelProps> = ({ playStats, player }) => {
    return (
        <div className="p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600 h-full">
            <div className="space-y-1">
                <div className="flex justify-between"><span>プレイ時間</span><span className="font-bold">{formatPlayTime(playStats.playTime)}</span></div>
                <div className="flex justify-between"><span>倒した魔物の数</span><span className="font-bold">{playStats.enemiesDefeated}</span></div>
                <div className="flex justify-between"><span>最高到達点</span><span className="font-bold">{Math.floor(playStats.farthestDistance)}m</span></div>
                <div className="flex justify-between"><span>総移動距離</span><span className="font-bold">{Math.floor(playStats.totalDistanceTraveled)}m</span></div>
                <div className="flex justify-between"><span>総獲得XP</span><span className="font-bold">{playStats.totalXpGained} XP</span></div>
                <div className="flex justify-between"><span>次のレベルまで</span><span className="font-bold">{player.xpToNextLevel - player.xp} XP</span></div>
                <div className="flex justify-between"><span>装備収集率</span><span className="font-bold">{((playStats.collectedEquipment.size / EQUIPMENT_MASTER_DATA.length) * 100).toFixed(1)}%</span></div>
                <div className="flex justify-between"><span>所持ゴールド</span><span className="font-bold text-yellow-400">{player.gold} G</span></div>
                <div className="pt-2 mt-2 border-t border-gray-700">
                    <span className="text-xs text-gray-400">ジェム</span>
                    <div className="flex items-center space-x-2 mt-1">
                        {Object.entries(playStats.gemCollection).map(([stat, count]) => (
                            count > 0 && (
                                <div key={stat} className="flex items-center" title={baseStatNames[stat as AllocatableStat]}>
                                    <div className={`w-3 h-3 rounded-full ${GEM_COLORS[stat as AllocatableStat]} mr-1`}></div>
                                    <span className="font-bold text-xs">{count}</span>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayStatsPanel;