import React from 'react';
import { Equipment, ShopType, DERIVED_STAT_NAMES, Player, Element } from '../types';
import { ELEMENT_COLORS } from '../constants';

interface ShopProps {
  shopData: {
    type: ShopType;
    items: Equipment[];
  };
  playerData: {
    gold: number;
  };
  equipment: Player['equipment'];
  onBuy: (item: Equipment) => void;
  onClose: () => void;
}

const shopTitles: Record<ShopType, string> = {
  weapon_shop: '武器屋',
  armor_shop: '防具屋',
  accessory_shop: 'アクセサリー屋',
};

const Shop: React.FC<ShopProps> = ({ shopData, playerData, equipment, onBuy, onClose }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-30 p-4">
      <div className="w-full max-w-2xl bg-yellow-900 border-4 border-yellow-700 rounded-lg p-6 text-white font-mono shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl font-bold text-red-400 hover:text-red-200">&times;</button>
        <h2 className="text-3xl text-center text-yellow-300 mb-6 border-b-2 border-yellow-800 pb-2">{shopTitles[shopData.type]}</h2>
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {shopData.items.map(item => {
            const currentItem = equipment[item.type];
            const isOwned = currentItem?.name === item.name;
            
            return (
              <div key={item.id} className="grid grid-cols-3 gap-4 items-center bg-black bg-opacity-40 p-3 rounded">
                <div className="col-span-1">
                  <p className="font-bold text-lg">{item.name}</p>
                   {item.elementalDamages && Object.entries(item.elementalDamages).map(([el, pow]) => (
                     <p key={el} className={`font-bold text-sm ${ELEMENT_COLORS[el as Element]}`}>属性: {el} {pow}</p>
                   ))}
                  <p className="text-yellow-400 text-xl">{item.price} G</p>
                </div>
                <div className="col-span-1 text-sm">
                  {Object.entries(item.stats).map(([stat, value]) => (
                    <p key={stat} className="text-green-300">
                      + {value} {DERIVED_STAT_NAMES[stat as keyof typeof DERIVED_STAT_NAMES]}
                    </p>
                  ))}
                </div>
                <div className="col-span-1 text-right">
                  {isOwned ? (
                    <span className="px-4 py-2 bg-gray-700 text-gray-400 font-bold rounded">品切れ</span>
                  ) : (
                    <button
                      onClick={() => onBuy(item)}
                      disabled={playerData.gold < item.price}
                      className="px-4 py-2 bg-green-600 font-bold rounded hover:bg-green-500 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      買う
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
         <div className="mt-4 text-right border-t-2 border-yellow-800 pt-2">
            <p className="text-lg">所持ゴールド: <span className="font-bold text-yellow-400">{playerData.gold} G</span></p>
        </div>
      </div>
    </div>
  );
};

export default Shop;