import React from 'react';
import { Equipment, ShopType, DERIVED_STAT_NAMES, Player, Element, EquipmentType } from '../types';
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

const StatDisplay: React.FC<{ item: Equipment }> = ({ item }) => (
  <div className="text-sm">
    {item.elementalDamages && Object.entries(item.elementalDamages).map(([el, pow]) => (
      <p key={el} className={`font-bold ${ELEMENT_COLORS[el as Element]}`}>{el} {pow}</p>
    ))}
    {Object.entries(item.stats).map(([stat, value]) => (
      <p key={stat} className="text-green-300">
        + {value} {DERIVED_STAT_NAMES[stat as keyof typeof DERIVED_STAT_NAMES]}
      </p>
    ))}
  </div>
);


const Shop: React.FC<ShopProps> = ({ shopData, player, onBuy, onClose, onEquip, onUnequip }) => {
  const allOwnedItemIds = new Set([
      ...Object.values(player.equipment).filter(Boolean).map(e => e!.id),
      ...player.inventory.map(i => i.id)
  ]);

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-30 p-4 font-mono">
      <div className="w-full max-w-5xl h-[90vh] bg-yellow-900 border-4 border-yellow-700 rounded-lg p-6 text-white shadow-lg flex flex-col">
        <button onClick={onClose} className="absolute top-2 right-2 text-3xl font-bold text-red-400 hover:text-red-200 z-10">&times;</button>
        <h2 className="text-3xl text-center text-yellow-300 mb-6 border-b-2 border-yellow-800 pb-2">{shopTitles[shopData.type]}</h2>
        
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">

          {/* Left Side: Shop Inventory */}
          <div className="flex flex-col gap-4 overflow-hidden">
            <h3 className="text-xl font-bold text-center">商品</h3>
            <div className="flex-grow bg-black bg-opacity-30 p-4 rounded-lg border border-yellow-800 overflow-y-auto space-y-3">
              {shopData.items.map(item => (
                 <div key={item.id} className="grid grid-cols-3 gap-4 items-center bg-black bg-opacity-40 p-3 rounded">
                    <div className="col-span-1">
                      <p className="font-bold text-lg">{item.name}</p>
                      <p className="text-yellow-400 text-xl">{item.price} G</p>
                    </div>
                    <div className="col-span-1">
                        <StatDisplay item={item} />
                    </div>
                    <div className="col-span-1 text-right">
                      {allOwnedItemIds.has(item.id) ? (
                        <span className="px-4 py-2 bg-gray-700 text-gray-400 font-bold rounded">購入済み</span>
                      ) : (
                        <button
                          onClick={() => onBuy(item)}
                          disabled={player.gold < item.price}
                          className="px-4 py-2 bg-green-600 font-bold rounded hover:bg-green-500 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          買う
                        </button>
                      )}
                    </div>
                 </div>
              ))}
            </div>
          </div>
          
          {/* Right Side: Player Equipment & Inventory */}
          <div className="flex flex-col gap-4 overflow-hidden">
             {/* Equipped Items */}
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-center">現在の装備</h3>
                {(['weapon', 'armor', 'accessory'] as EquipmentType[]).map(type => {
                  const item = player.equipment[type];
                  return (
                    <div key={type} className="bg-black bg-opacity-30 p-3 rounded-lg border border-yellow-800">
                      <h4 className="capitalize text-base text-gray-400 mb-1">{type}</h4>
                      {item ? (
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-base">{item.name}</p>
                            <StatDisplay item={item} />
                          </div>
                          <button onClick={() => onUnequip(item)} className="px-3 py-1 bg-red-600 font-bold rounded hover:bg-red-500 transition-colors text-sm">外す</button>
                        </div>
                      ) : ( <p className="text-gray-500 text-sm">-- なし --</p> )}
                    </div>
                  );
                })}
            </div>
            {/* Inventory */}
            <div className="flex flex-col gap-4 overflow-hidden flex-grow">
                <h3 className="text-xl font-bold text-center mt-2">持ち物</h3>
                <div className="flex-grow bg-black bg-opacity-30 p-4 rounded-lg border border-yellow-800 overflow-y-auto space-y-3">
                  {player.inventory.length > 0 ? (
                    player.inventory.map(item => (
                      <div key={item.id} className="bg-black bg-opacity-40 p-3 rounded flex justify-between items-center">
                        <div>
                          <p className="font-bold text-base">{item.name} <span className="text-xs text-gray-400">({item.type})</span></p>
                          <StatDisplay item={item} />
                        </div>
                        <button onClick={() => onEquip(item)} className="px-3 py-1 bg-green-600 font-bold rounded hover:bg-green-500 transition-colors text-sm">装備</button>
                      </div>
                    ))
                  ) : ( <p className="text-gray-500 text-center pt-4">持ち物はありません</p> )}
                </div>
            </div>
          </div>

        </div>
        <div className="mt-4 text-right border-t-2 border-yellow-800 pt-2 flex justify-between items-center">
            <button onClick={onClose} className="px-6 py-2 bg-blue-600 font-bold rounded hover:bg-blue-500 transition-colors">
                店を出る
            </button>
            <p className="text-lg">所持ゴールド: <span className="font-bold text-yellow-400">{player.gold} G</span></p>
        </div>
      </div>
    </div>
  );
};

export default Shop;
