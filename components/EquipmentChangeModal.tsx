import React from 'react';
import { Player, Equipment, EquipmentType, DERIVED_STAT_NAMES, Element } from '../types';
import { ELEMENT_COLORS } from '../constants';

interface EquipmentChangeModalProps {
  player: Player;
  onEquip: (item: Equipment) => void;
  onUnequip: (item: Equipment) => void;
  onClose: () => void;
}

const typeNames: Record<EquipmentType, string> = {
    weapon: '武器',
    armor: '防具',
    accessory: 'アクセサリー'
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

const EquipmentChangeModal: React.FC<EquipmentChangeModalProps> = ({ player, onEquip, onUnequip, onClose }) => {

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40 p-4 font-mono">
      <div className="w-full max-w-4xl h-[80vh] bg-gray-800 border-4 border-gray-600 rounded-lg p-6 text-white shadow-lg flex flex-col">
        <button onClick={onClose} className="absolute top-2 right-2 text-3xl font-bold text-red-400 hover:text-red-200 z-10">&times;</button>
        <h2 className="text-3xl text-center text-yellow-300 mb-6 border-b-2 border-gray-700 pb-2">装備変更</h2>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
          {/* Left Side: Equipped Items */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-center">現在の装備</h3>
            {(['weapon', 'armor', 'accessory'] as EquipmentType[]).map(type => {
              const item = player.equipment[type];
              return (
                <div key={type} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <h4 className="text-lg text-gray-400 mb-2">{typeNames[type]}</h4>
                  {item ? (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg">{item.name}</p>
                        <StatDisplay item={item} />
                      </div>
                      <button
                        onClick={() => onUnequip(item)}
                        className="px-3 py-1 bg-red-600 font-bold rounded hover:bg-red-500 transition-colors text-sm"
                      >
                        外す
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500">-- なし --</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Side: Inventory */}
          <div className="flex flex-col gap-4 overflow-hidden">
            <h3 className="text-xl font-bold text-center">持ち物</h3>
            <div className="flex-grow bg-gray-900 p-4 rounded-lg border border-gray-700 overflow-y-auto space-y-3">
              {player.inventory.length > 0 ? (
                player.inventory.map(item => (
                  <div key={item.id} className="bg-black bg-opacity-40 p-3 rounded flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg">{item.name} <span className="text-xs text-gray-400">({typeNames[item.type]})</span></p>
                      <StatDisplay item={item} />
                    </div>
                    <button
                      onClick={() => onEquip(item)}
                      className="px-3 py-1 bg-green-600 font-bold rounded hover:bg-green-500 transition-colors text-sm"
                    >
                      装備
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center pt-10">持ち物はありません</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button onClick={onClose} className="px-8 py-3 bg-blue-600 font-bold rounded hover:bg-blue-500 transition-colors">
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentChangeModal;