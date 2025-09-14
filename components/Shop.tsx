import React, { useMemo, useState } from 'react';
import { Equipment, ShopType, DERIVED_STAT_NAMES, Player, Element, EquipmentType, DerivedStat } from '../types';
import { ELEMENT_COLORS } from '../constants';

interface ShopProps {
  shopData: {
    type: ShopType;
    items: Equipment[];
  };
  player: Player;
  onBuy: (item: Equipment) => void;
  onClose: () => void;
  onEquip: (item: Equipment) => void;
  onUnequip: (item: Equipment) => void;
}

const shopTitles: Record<ShopType, string> = {
  weapon_shop: '武器屋',
  armor_shop: '防具屋',
  accessory_shop: 'アクセサリー屋',
};

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

const Shop: React.FC<ShopProps> = ({ shopData, player, onBuy, onClose, onEquip, onUnequip }) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'player'>('shop');
  
  const allPlayerItems = useMemo(() => [
    ...player.inventory,
    ...Object.values(player.equipment).filter((e): e is Equipment => e !== null)
  ], [player.inventory, player.equipment]);

  const hasBetterOrEqual = (shopItem: Equipment): boolean => {
    const maxExistingLevel = allPlayerItems
      .filter(i => i.masterId === shopItem.masterId)
      .reduce((max, item) => Math.max(max, item.level), -1);
    return shopItem.level <= maxExistingLevel;
  };

  const playerItemsForDisplay = useMemo(() => {
    const equippedItems = (Object.values(player.equipment) as (Equipment | null)[])
      .filter((item): item is Equipment => item !== null)
      .map(item => ({ ...item, isEquipped: true }));
    
    const equippedInstanceIds = new Set(equippedItems.map(i => i.instanceId));
    
    const inventoryItems = player.inventory
      .filter(item => !equippedInstanceIds.has(item.instanceId))
      .map(item => ({ ...item, isEquipped: false }));

    return [...equippedItems, ...inventoryItems].sort((a,b) => a.price - b.price);
  }, [player.equipment, player.inventory]);

  const ShopItemsPanel = () => (
    <div className="flex flex-col h-full bg-black bg-opacity-30 p-2 sm:p-3 rounded-lg border border-yellow-800">
      <h3 className="text-xl font-bold text-center mb-2 flex-shrink-0">商品</h3>
      <div className="flex-grow overflow-y-auto">
        <div className="space-y-2">
          {shopData.items.map(item => {
            const canAfford = player.gold >= item.price;
            const ownedBetter = hasBetterOrEqual(item);
            return (
              <div key={item.instanceId} className={`grid grid-cols-12 gap-2 items-center p-2 rounded text-sm ${!canAfford && !ownedBetter ? 'bg-red-900/50' : 'bg-black/40'}`}>
                <div className="col-span-12 sm:col-span-4 font-bold truncate" title={item.name}>{item.name}</div>
                <div className="col-span-7 sm:col-span-4"><ItemStats item={item} /></div>
                <div className={`col-span-5 sm:col-span-2 text-right font-bold ${!canAfford && !ownedBetter ? 'text-red-400' : 'text-yellow-400'}`}>{item.price} G</div>
                <div className="col-span-12 sm:col-span-2 text-right">
                  <button
                    onClick={() => onBuy(item)}
                    disabled={!canAfford || ownedBetter}
                    className="w-full sm:w-auto px-3 py-1 bg-green-600 font-bold rounded text-xs hover:bg-green-500 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {ownedBetter ? '所有済' : '買う'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const PlayerItemsPanel = () => (
    <div className="flex flex-col h-full bg-black bg-opacity-30 p-2 sm:p-3 rounded-lg border border-yellow-800">
        <h3 className="text-xl font-bold text-center mb-2 flex-shrink-0">持ち物</h3>
        <div className="flex-grow overflow-y-auto">
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
  
  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-30 p-2 sm:p-4 font-mono">
      <div className="w-full max-w-6xl h-[95vh] sm:h-[90vh] bg-yellow-900 border-4 border-yellow-700 rounded-lg p-3 sm:p-6 text-white shadow-lg flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-2xl sm:text-3xl text-center text-yellow-300 border-b-2 border-yellow-800 pb-2 flex-grow">{shopTitles[shopData.type]}</h2>
            <button onClick={onClose} className="ml-4 text-3xl font-bold text-red-400 hover:text-red-200">&times;</button>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-grow overflow-hidden min-h-0">
          {/* Mobile Tab Layout */}
          <div className="flex flex-col h-full sm:hidden">
            <div className="flex border-b-2 border-yellow-800 mb-2 flex-shrink-0">
              <button 
                onClick={() => setActiveTab('shop')} 
                className={`flex-1 py-2 text-center font-bold ${activeTab === 'shop' ? 'bg-yellow-800 text-yellow-200 rounded-t-lg' : 'text-yellow-500'}`}
              >
                商品
              </button>
              <button 
                onClick={() => setActiveTab('player')}
                className={`flex-1 py-2 text-center font-bold ${activeTab === 'player' ? 'bg-yellow-800 text-yellow-200 rounded-t-lg' : 'text-yellow-500'}`}
              >
                持ち物
              </button>
            </div>
            <div className="flex-grow overflow-hidden min-h-0">
                {activeTab === 'shop' && <ShopItemsPanel />}
                {activeTab === 'player' && <PlayerItemsPanel />}
            </div>
          </div>
          
          {/* Desktop Grid Layout */}
          <div className="hidden sm:grid grid-cols-2 gap-6 h-full">
             <ShopItemsPanel />
             <PlayerItemsPanel />
          </div>
        </div>

        <div className="mt-4 text-right border-t-2 border-yellow-800 pt-3 flex justify-between items-center flex-shrink-0">
            <button onClick={onClose} className="px-6 py-2 bg-blue-700 font-bold rounded hover:bg-blue-600 transition-colors">
                店を出る
            </button>
            <p className="text-base sm:text-lg">所持G: <span className="font-bold text-yellow-400">{player.gold}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Shop;
