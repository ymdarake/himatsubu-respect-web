/**
 * 戦闘計算ユーティリティ
 *
 * プレイヤーと敵のダメージ計算、クリティカル判定などを行う純粋関数群
 */

/**
 * プレイヤーの物理ダメージ計算結果
 */
export interface PhysicalDamageResult {
  damage: number;
  isCritical: boolean;
}

/**
 * クリティカルヒット判定結果
 */
export interface CriticalHitResult {
  isCritical: boolean;
  criticalChance: number;
}

/**
 * プレイヤーの物理ダメージを計算
 */
export function calculatePlayerPhysicalDamage(params: {
  physicalAttack: number;
  enemyPhysicalDefense: number;
  luckValue?: number;
}): PhysicalDamageResult {
  const { physicalAttack, enemyPhysicalDefense, luckValue = 0 } = params;

  const totalStat = physicalAttack + enemyPhysicalDefense;
  const damageMultiplier = totalStat > 0 ? physicalAttack / totalStat : 1;
  let rawPhysicalDamage = physicalAttack * damageMultiplier * (0.9 + Math.random() * 0.2);

  // クリティカル判定
  const { isCritical } = calculateCriticalHit(luckValue);
  if (isCritical) {
    rawPhysicalDamage *= 1.5;
  }

  const finalPhysicalDamage = Math.max(1, Math.floor(rawPhysicalDamage));

  return {
    damage: finalPhysicalDamage,
    isCritical,
  };
}

/**
 * プレイヤーの魔法ダメージを計算
 */
export function calculatePlayerMagicalDamage(params: {
  magicalAttack: number;
  elementalPower: number;
  affinityMultiplier: number;
  enemyMagicalDefense: number;
}): number {
  const { magicalAttack, elementalPower, affinityMultiplier, enemyMagicalDefense } = params;

  const baseMagicalDamage = (magicalAttack * 1.5) * (1 + elementalPower / 100);
  const rawMagicalDamage = Math.floor(baseMagicalDamage * (0.9 + Math.random() * 0.2));
  const effectiveMagicalDamage = rawMagicalDamage * affinityMultiplier;
  const finalMagicalDamage = Math.max(1, Math.floor(effectiveMagicalDamage) - enemyMagicalDefense);

  return finalMagicalDamage;
}

/**
 * クリティカルヒット判定
 */
export function calculateCriticalHit(luckValue: number): CriticalHitResult {
  const criticalChance = Math.min(0.75, luckValue / 400);
  const isCritical = Math.random() < criticalChance;

  return {
    isCritical,
    criticalChance,
  };
}
