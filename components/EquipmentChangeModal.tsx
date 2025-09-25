import React, { useState, useMemo } from 'react';
import { Player, Equipment, EquipmentType, DERIVED_STAT_NAMES, Element, DerivedStat } from '../types';
import { ELEMENT_COLORS } from '../constants/ui';

interface EquipmentChangeModalProps {
  player: Player;
  calculatedStats: Record<DerivedStat, number>;
  onEquip: (item: Equipment) => void;
  onUnequip: (item: Equipment) => void;
  onClose: () => void;
  onHeal: () => void;
}

const typeNames: Record<EquipmentType, string> = {
    weapon: '武器',
    armor: '防具',
    accessory: 'アクセサリー'
};

const STAT_ABBREVIATIONS: Record<DerivedStat, string> = {
    maxHp: 'HP',
    physicalAttack: '物攻',
    physicalDefense: '物防',
    magicalAttack: '魔攻',
    magicalDefense: '魔防',
    speed: '速',
    luckValue: '運',
};

const ItemStats: React.FC<{ item: Equipment }> = React.memo(({ item }) => (
    <div className="flex flex-wrap items-center gap-x-2 text-xs">
        {Object.entries(item.stats).map(([stat, value]) => (
            <span key={stat} className="text-green-300 whitespace-nowrap">
                {STAT_ABBREVIATIONS[stat as DerivedStat]}+{value}
            </span>
        ))}
        {item.elementalDamages && Object.entries(item.elementalDamages).map(([el, pow]) => (
            <span key={el} className={`font-bold whitespace-nowrap ${ELEMENT_COLORS[el as Element]}`}>
                {el}+{pow}
            </span>
        ))}
    </div>
));

const EquipmentChangeModal: React.FC<EquipmentChangeModalProps> = ({ player, calculatedStats, onEquip, onUnequip, onClose, onHeal }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'stats'>('inventory');
  const [itemFilter, setItemFilter] = useState<EquipmentType>('weapon');
  const healCost = player.level * 7;
  const canHeal = player.gold >= healCost;
  const needsHeal = player.currentHp < calculatedStats.maxHp;

  const playerItemsForDisplay = useMemo(() => {
    const equippedItems = (Object.values(player.equipment) as (Equipment | null)[])
      .filter((item): item is Equipment => item !== null)
      .map(item => ({ ...item, isEquipped: true }));
    
    const equippedInstanceIds = new Set(equippedItems.map(i => i.instanceId));
    
    const inventoryItems = player.inventory
      .filter(item => !equippedInstanceIds.has(item.instanceId))
      .map(item => ({ ...item, isEquipped: false }));

    const allItems = [...equippedItems, ...inventoryItems].sort((a,b) => a.price - b.price);
    
    return allItems.filter(item => item.type === itemFilter);
  }, [player.equipment, player.inventory, itemFilter]);

  const PlayerItemsPanel = () => (
    <div className="flex flex-col h-full bg-black bg-opacity-30 p-2 sm:p-3 rounded-lg border border-gray-600 overflow-hidden">
        <h3 className="text-xl font-bold text-center mb-2 flex-shrink-0">持ち物</h3>
        <div className="flex mb-2 flex-shrink-0 border-b border-gray-600">
            {(['weapon', 'armor', 'accessory'] as const).map(type => (
                <button
                    key={type}
                    onClick={() => setItemFilter(type)}
                    className={`flex-1 text-xs sm:text-sm py-1 font-bold rounded-t transition-colors ${itemFilter === type ? 'bg-gray-700 text-yellow-200' : 'text-gray-400 hover:bg-gray-900/50'}`}
                >
                    {typeNames[type]}
                </button>
            ))}
        </div>
        <div className="flex-grow overflow-y-auto min-h-0">
            <div className="space-y-2">
                {playerItemsForDisplay.length > 0 ? (
                    playerItemsForDisplay.map(item => (
                        <div key={item.instanceId} className="grid grid-cols-12 gap-2 items-center p-2 rounded bg-black/40 text-sm">
                            <div className="col-span-12 sm:col-span-5 font-bold truncate flex items-center gap-2" title={item.name}>
                                {item.isEquipped && <span className="text-yellow-400 font-bold text-xs bg-yellow-900 px-1.5 py-0.5 rounded-md flex-shrink-0">E</span>}
                                <span>{item.name}</span>
                            </div>
                            <div className="col-span-7 sm:col-span-5"><ItemStats item={item} /></div>
                             <div className="col-span-5 sm:col-span-2 text-right">
                                {item.isEquipped ? (
                                    <button onClick={() => onUnequip(item)} className="w-full sm:w-auto px-3 py-1 bg-red-600 font-bold rounded hover:bg-red-500 transition-colors text-xs">外す</button>
                                ) : (
                                    <button onClick={() => onEquip(item)} className="w-full sm:w-auto px-3 py-1 bg-blue-600 font-bold rounded hover:bg-blue-500 transition-colors text-xs">装備</button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center pt-10">持ち物はありません</p>
                )}
            </div>
        </div>
    </div>
  );
  
  const PlayerStatusPanel = () => (
    <div className="flex flex-col h-full bg-black bg-opacity-30 p-2 sm:p-3 rounded-lg border border-gray-600 overflow-hidden">
      <h3 className="text-xl font-bold text-center mb-2 flex-shrink-0">ステータス</h3>
      <div className="flex-grow overflow-y-auto min-h-0 p-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {Object.entries(calculatedStats).map(([stat, value]) => (
            <React.Fragment key={stat}>
              <span className="text-gray-400">{DERIVED_STAT_NAMES[stat as DerivedStat]}</span>
              {/* FIX: Explicitly convert value to a Number to prevent potential 'unknown' type errors with Math.floor. */}
              <span className="font-bold text-right">{Math.floor(Number(value))}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40 p-2 sm:p-4 font-mono">
      <div className="w-full max-w-6xl h-[95vh] sm:h-[90vh] bg-gray-800 border-4 border-gray-600 rounded-lg p-3 sm:p-6 text-white shadow-lg flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-2xl sm:text-3xl text-center text-yellow-300 border-b-2 border-gray-700 pb-2 flex-grow">家</h2>
            <button onClick={onClose} className="ml-4 text-3xl font-bold text-red-400 hover:text-red-200">&times;</button>
        </div>
        
        {/* Heal Section */}
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 mb-4 flex flex-col sm:flex-row items-center justify-between flex-shrink-0 gap-2">
            <div className="text-center sm:text-left">
                <h3 className="text-lg text-green-400">HP回復</h3>
                <p className="text-sm text-gray-400">
                    HP: {player.currentHp} / {calculatedStats.maxHp}
                    <span className="ml-4">所持G: <span className="text-yellow-400">{player.gold}</span></span>
                </p>
            </div>
            <button
                onClick={onHeal}
                disabled={!canHeal || !needsHeal}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 font-bold rounded hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                {needsHeal ? `回復する (${healCost} G)` : 'HPは満タン'}
            </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow overflow-hidden min-h-0">
          {/* Mobile Tab Layout */}
          <div className="flex flex-col h-full sm:hidden">
            <div className="flex border-b-2 border-gray-700 mb-2 flex-shrink-0">
              <button 
                onClick={() => setActiveTab('inventory')} 
                className={`flex-1 py-2 text-center font-bold ${activeTab === 'inventory' ? 'bg-gray-700 text-yellow-200 rounded-t-lg' : 'text-gray-400'}`}
              >
                持ち物
              </button>
              <button 
                onClick={() => setActiveTab('stats')}
                className={`flex-1 py-2 text-center font-bold ${activeTab === 'stats' ? 'bg-gray-700 text-yellow-200 rounded-t-lg' : 'text-gray-400'}`}
              >
                ステータス
              </button>
            </div>
            <div className="flex-grow overflow-hidden min-h-0">
                {activeTab === 'inventory' && <PlayerItemsPanel />}
                {activeTab === 'stats' && <PlayerStatusPanel />}
            </div>
          </div>
          
          {/* Desktop Grid Layout */}
          <div className="hidden sm:grid grid-cols-2 gap-6 h-full">
             <PlayerStatusPanel />
             <PlayerItemsPanel />
          </div>
        </div>

        <div className="mt-4 text-right border-t-2 border-gray-700 pt-3 flex-shrink-0">
            <button onClick={onClose} className="px-6 py-2 bg-blue-700 font-bold rounded hover:bg-blue-600 transition-colors">
                外に出る
            </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentChangeModal;