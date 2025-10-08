
import React from 'react';
import { Player, AllocatableStat, DerivedStat, Element } from '../types';
import { DERIVED_STAT_NAMES } from '../types';
import { ELEMENT_COLORS } from '../constants/ui';

const baseStatNames: Record<AllocatableStat, string> = {
    strength: '腕力',
    stamina: '体力',
    intelligence: '知力',
    speedAgility: '敏捷',
    luck: '幸運',
};

interface BaseStatsPanelProps {
    player: Player;
    toggleStatAllocationLock: () => void;
    className?: string;
    variant?: 'mobile' | 'desktop';
}

export const BaseStatsPanel: React.FC<BaseStatsPanelProps> = ({ player, toggleStatAllocationLock, className = '', variant = 'desktop' }) => {
    const textSize = variant === 'mobile' ? 'text-xs' : 'text-sm';
    const levelTextSize = variant === 'mobile' ? 'text-base' : 'text-lg';

    return (
        <div className={`p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600 flex flex-col ${className}`}>
            <div className="mb-2 border-b border-gray-700 pb-1 flex items-center justify-between sm:justify-center">
                <span className={`font-bold ${levelTextSize}`}>レベル {player.level}</span>
                {variant === 'mobile' && (
                    <button
                        type="button"
                        role="switch"
                        aria-label="ステ振り固定"
                        aria-checked={player.isStatAllocationLocked}
                        onClick={toggleStatAllocationLock}
                        disabled={!player.lastStatAllocation}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${player.isStatAllocationLocked ? 'bg-yellow-500' : 'bg-gray-600'} ${!player.lastStatAllocation ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        title={!player.lastStatAllocation ? "一度レベルアップしてステータスを割り振ると有効になります" : "ステータス割り振りを固定する"}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${player.isStatAllocationLocked ? 'translate-x-5' : 'translate-x-1'}`}
                        />
                    </button>
                )}
            </div>
            <div className={`space-y-1 flex-grow ${textSize}`}>
                {Object.entries(player.baseStats).map(([stat, value]) => (
                    <div key={stat} className="flex justify-between">
                        <span>{baseStatNames[stat as keyof typeof baseStatNames]}</span>
                        <span className="font-bold">{value}</span>
                    </div>
                ))}
            </div>
            {variant !== 'mobile' && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                    <label className={`flex items-center space-x-2 cursor-pointer select-none ${textSize}`} title={!player.lastStatAllocation ? "一度レベルアップしてステータスを割り振ると有効になります" : "ステータス割り振りを固定する"}>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={player.isStatAllocationLocked}
                            onClick={toggleStatAllocationLock}
                            disabled={!player.lastStatAllocation}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${player.isStatAllocationLocked ? 'bg-yellow-500' : 'bg-gray-600'} ${!player.lastStatAllocation ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${player.isStatAllocationLocked ? 'translate-x-5' : 'translate-x-1'}`}
                            />
                        </button>
                        <span className={player.lastStatAllocation ? '' : 'text-gray-500'}>ステ振り固定</span>
                    </label>
                </div>
            )}
        </div>
    );
};


interface DerivedStatsPanelProps {
    calculatedStats: Record<DerivedStat, number>;
    totalElementalDamages: Partial<Record<Element, number>>;
    className?: string;
    variant?: 'mobile' | 'desktop';
}

export const DerivedStatsPanel: React.FC<DerivedStatsPanelProps> = ({ calculatedStats, totalElementalDamages, className = '', variant = 'desktop' }) => {
    const textSize = variant === 'mobile' ? 'text-xs' : 'text-sm';

    return (
        <div className={`p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600 ${className}`}>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 ${textSize}`}>
                {Object.entries(calculatedStats).map(([stat, value]) => (
                    <div key={stat} className="flex justify-between">
                        <span>{DERIVED_STAT_NAMES[stat as keyof typeof DERIVED_STAT_NAMES]}</span>
                        <span className="font-bold">{Math.floor(value as number)}</span>
                    </div>
                ))}
                {Object.entries(totalElementalDamages).map(([element, value]) => (
                    (value as number) > 0 && (
                        <div key={element} className="flex justify-between">
                            <span className={`${ELEMENT_COLORS[element as Element]}`}>{element}属性</span>
                            <span className={`font-bold ${ELEMENT_COLORS[element as Element]}`}>+{value}</span>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};
