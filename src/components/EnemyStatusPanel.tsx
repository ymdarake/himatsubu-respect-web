import React from 'react';
import { Enemy, DERIVED_STAT_NAMES, Element } from '../types';
import HealthBar from './HealthBar';
import { ELEMENT_COLORS } from '../constants/ui';

interface EnemyStatusPanelProps {
  enemy: Enemy;
}

const EnemyStatusPanel: React.FC<EnemyStatusPanelProps> = ({ enemy }) => {
  if (!enemy) return null;

  return (
    <div className="p-3 bg-red-900 bg-opacity-50 rounded border-2 border-red-500 transition-opacity duration-300 h-full">
      <h3 className="text-lg font-bold text-center text-red-300 mb-2">{enemy.name} <span className="text-base">レベル{enemy.level}</span></h3>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>{DERIVED_STAT_NAMES.maxHp}</span>
            <span>{enemy.currentHp} / {enemy.maxHp}</span>
          </div>
          <HealthBar current={enemy.currentHp} max={enemy.maxHp} barColor="bg-red-500" />
        </div>
        <div className="space-y-1 mt-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">属性</span>
            <span className={`font-bold ${ELEMENT_COLORS[enemy.element]}`}>{enemy.element}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{DERIVED_STAT_NAMES.physicalAttack}</span>
            <span className="font-bold">{enemy.physicalAttack}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{DERIVED_STAT_NAMES.physicalDefense}</span>
            <span className="font-bold">{enemy.physicalDefense}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{DERIVED_STAT_NAMES.magicalAttack}</span>
            <span className="font-bold">{enemy.magicalAttack}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{DERIVED_STAT_NAMES.magicalDefense}</span>
            <span className="font-bold">{enemy.magicalDefense}</span>
          </div>
           <div className="flex justify-between">
            <span className="text-gray-400">{DERIVED_STAT_NAMES.speed}</span>
            <span className="font-bold">{enemy.speed}</span>
          </div>
           <div className="flex justify-between">
            <span className="text-gray-400">{DERIVED_STAT_NAMES.luckValue}</span>
            <span className="font-bold">{enemy.luckValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnemyStatusPanel;