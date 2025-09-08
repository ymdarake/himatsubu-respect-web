import React from 'react';
import { Player, DerivedStat, Element } from '../types';
import { ELEMENT_COLORS } from '../constants';

interface EquipmentPanelProps {
  equipment: Player['equipment'];
}

const STAT_ABBREVIATIONS: Record<DerivedStat, string> = {
    maxHp: 'HP',
    physicalAttack: '物攻',
    physicalDefense: '物防',
    magicalAttack: '魔攻',
    magicalDefense: '魔防',
    speed: '素早',
    luckValue: '運',
};

const abbreviateStat = (stat: keyof typeof STAT_ABBREVIATIONS) => {
    return STAT_ABBREVIATIONS[stat];
}

const EquipmentSlot: React.FC<{
  type: string;
  item: Player['equipment']['weapon'] | Player['equipment']['armor'] | Player['equipment']['accessory'];
}> = ({ type, item }) => {
  return (
    <div className="bg-black bg-opacity-40 p-2 rounded h-20 flex flex-col justify-between">
      <p className="text-xs text-gray-400 uppercase">{type}</p>
      {item ? (
        <div>
          <p className="text-sm font-bold truncate">{item.name}</p>
          <div className="text-xs text-green-400 flex flex-wrap gap-x-2">
            {item.elementalDamages && Object.entries(item.elementalDamages).map(([element, power]) => (
                <span key={element} className={`font-bold ${ELEMENT_COLORS[element as Element]}`}>
                    {element}{power}
                </span>
            ))}
            {Object.entries(item.stats).map(([stat, value]) => (
                <span key={stat}>
                    +{value} {abbreviateStat(stat as keyof typeof STAT_ABBREVIATIONS)}
                </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">-- 無し --</p>
      )}
    </div>
  );
};

const EquipmentPanel: React.FC<EquipmentPanelProps> = ({ equipment }) => {
  return (
    <div className="grid grid-cols-1 gap-1">
      <EquipmentSlot type="武器" item={equipment.weapon} />
      <EquipmentSlot type="防具" item={equipment.armor} />
      <EquipmentSlot type="アクセサリー" item={equipment.accessory} />
    </div>
  );
};

export default EquipmentPanel;