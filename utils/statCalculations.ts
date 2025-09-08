import { Player as PlayerType, DerivedStat, BaseStats, Equipment } from '../types';
import { EnemyBaseData } from '../constants';

export const calculateDerivedStats = (player: PlayerType): Record<DerivedStat, number> => {
  const base = player.baseStats;
  const derived: Record<DerivedStat, number> = {
      maxHp: 20 + (base.stamina * 10) + (base.strength * 2) + (player.level - 1) * 10,
      physicalAttack: 5 + (base.strength * 2) + (base.speedAgility * 1),
      physicalDefense: (base.stamina * 1) + (base.strength * 1),
      magicalAttack: (base.intelligence * 2),
      magicalDefense: (base.intelligence * 2) + (base.stamina * 1),
      speed: 10 + (base.speedAgility * 2),
      luckValue: 5 + (base.luck * 1),
  };

  const equipmentList: (Equipment | null)[] = [player.equipment.weapon, player.equipment.armor, player.equipment.accessory];
  for (const item of equipmentList) {
      if (item) {
          for (const [stat, value] of Object.entries(item.stats)) {
              if (derived.hasOwnProperty(stat) && value) {
                  derived[stat as keyof typeof derived] += value;
              }
          }
      }
  }
  return derived;
};

export const calculateEnemyStats = (enemyData: EnemyBaseData, level: number) => {
    const scaledBaseStats: BaseStats = { ...enemyData.baseStats };
    for (const stat in scaledBaseStats) {
        const key = stat as keyof BaseStats;
        const levelMultiplier = 1 + (level - 1) * 0.15 + Math.pow(level - 1, 2) * 0.005;
        scaledBaseStats[key] = Math.floor(scaledBaseStats[key] * levelMultiplier);
    }

    const derivedStats = {
        maxHp: Math.floor(10 + (scaledBaseStats.stamina * 5) + (scaledBaseStats.strength * 1.5)),
        physicalAttack: Math.floor(2 + (scaledBaseStats.strength * 1.8) + (scaledBaseStats.speedAgility * 0.5)),
        physicalDefense: Math.floor((scaledBaseStats.stamina * 0.8) + (scaledBaseStats.strength * 0.4)),
        magicalAttack: Math.floor((scaledBaseStats.intelligence * 2)),
        magicalDefense: Math.floor((scaledBaseStats.intelligence * 1.5) + (scaledBaseStats.stamina * 1)),
        speed: Math.floor(5 + (scaledBaseStats.speedAgility * 1.5)),
        luckValue: Math.floor(1 + (scaledBaseStats.luck * 1)),
    };
    
    return { scaledBaseStats, derivedStats };
}