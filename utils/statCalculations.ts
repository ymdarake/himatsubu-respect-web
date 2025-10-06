import { Player as PlayerType, DerivedStat, BaseStats, Equipment } from '../types';
import { EnemyBaseData } from '../data/enemies';

export const calculateDerivedStats = (player: PlayerType): Record<DerivedStat, number> => {
  const base = player.baseStats;
  const derived: Record<DerivedStat, number> = {
      maxHp: 20 + (base.stamina * 10) + (base.strength * 2) + (player.level - 1) * 10,
      physicalAttack: 5 + (base.strength * 2),
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

  // ギャンブラー装備ボーナス: 運気値を攻撃力・防御力に変換（チート級）
  const hasGamblersWeapon = player.equipment.weapon?.masterId === 'wpn_gamblers_dice';
  const hasGamblersArmor = player.equipment.armor?.masterId === 'arm_gamblers_coat';
  const hasGamblersAccessory = player.equipment.accessory?.masterId === 'acc_lucky_coin';

  if (hasGamblersWeapon) {
    // 運気値の200%を物理攻撃力に追加（腕力1=攻撃+2と同等）
    derived.physicalAttack += Math.floor(derived.luckValue * 2.0);
  }

  if (hasGamblersArmor) {
    // 運気値の100%を物理防御力と魔法防御力に追加
    const defenseBonus = Math.floor(derived.luckValue * 1.0);
    derived.physicalDefense += defenseBonus;
    derived.magicalDefense += defenseBonus;
  }

  // ギャンブラー3点セットボーナス: 移動速度2倍
  if (hasGamblersWeapon && hasGamblersArmor && hasGamblersAccessory) {
    derived.speed *= 2;
  }

  return derived;
};

export const calculateEnemyStats = (enemyData: EnemyBaseData, level: number) => {
    const scaledBaseStats: BaseStats = { ...enemyData.baseStats };
    for (const stat in scaledBaseStats) {
        const key = stat as keyof BaseStats;
        const levelMultiplier = 1 + (level - 1) * 0.18 + Math.pow(level - 1, 2) * 0.006;
        scaledBaseStats[key] = Math.floor(scaledBaseStats[key] * levelMultiplier);
    }

    const derivedStats = {
        maxHp: Math.floor(10 + (scaledBaseStats.stamina * 5) + (scaledBaseStats.strength * 1.5)),
        physicalAttack: Math.floor(2 + (scaledBaseStats.strength * 1.8) + (scaledBaseStats.speedAgility * 0.5)),
        physicalDefense: Math.floor((scaledBaseStats.stamina * 1.0) + (scaledBaseStats.strength * 0.5)),
        magicalAttack: Math.floor((scaledBaseStats.intelligence * 2)),
        magicalDefense: Math.floor((scaledBaseStats.intelligence * 1.5) + (scaledBaseStats.stamina * 1.0)),
        speed: Math.floor(5 + (scaledBaseStats.speedAgility * 1.5)),
        luckValue: Math.floor(1 + (scaledBaseStats.luck * 1)),
    };
    
    return { scaledBaseStats, derivedStats };
}