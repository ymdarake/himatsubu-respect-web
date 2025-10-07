/**
 * 戦闘計算ユーティリティ
 *
 * プレイヤーと敵のダメージ計算、クリティカル判定などを行う純粋関数群
 */

import { ATTACK_SPEED_LEVELS } from '../constants/combat';

/**
 * 攻撃速度レベル
 */
export interface AttackSpeedLevel {
  ratio: number;
  cooldown: number;
}

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

/**
 * 敵の物理ダメージを計算
 */
export function calculateEnemyPhysicalDamage(params: {
  enemyPhysicalAttack: number;
  playerPhysicalDefense: number;
}): number {
  const { enemyPhysicalAttack, playerPhysicalDefense } = params;

  const totalStat = enemyPhysicalAttack + playerPhysicalDefense;
  const damageMultiplier = totalStat > 0 ? enemyPhysicalAttack / totalStat : 1;
  const rawPhysicalDamage = enemyPhysicalAttack * damageMultiplier * (0.9 + Math.random() * 0.2);
  const finalPhysicalDamage = Math.max(1, Math.floor(rawPhysicalDamage));

  return finalPhysicalDamage;
}

/**
 * 敵の魔法ダメージを計算（乱数なし、知力依存）
 */
export function calculateEnemyMagicalDamage(params: {
  enemyMagicalAttack: number;
  enemyIntelligence: number;
  playerMagicalDefense: number;
}): number {
  const { enemyMagicalAttack, enemyIntelligence, playerMagicalDefense } = params;

  const baseMagicalDamage = (enemyMagicalAttack * 1.5) * (1 + enemyIntelligence / 100);
  const finalMagicalDamage = Math.max(1, Math.floor(baseMagicalDamage) - playerMagicalDefense);

  return finalMagicalDamage;
}

/**
 * 速度比率から攻撃速度レベルを取得
 */
export function getAttackSpeedLevel(speedRatio: number): AttackSpeedLevel {
  if (speedRatio <= 0) {
    // 速度が0またはマイナスの場合はデフォルト（Normal）
    return ATTACK_SPEED_LEVELS[3];
  }

  return ATTACK_SPEED_LEVELS.find(level => speedRatio <= level.ratio) || ATTACK_SPEED_LEVELS[3];
}

/**
 * プレイヤーの攻撃クールダウンを計算
 */
export function calculatePlayerAttackCooldown(params: {
  playerSpeed: number;
  enemySpeed: number;
}): number {
  const { playerSpeed, enemySpeed } = params;

  const speedRatio = playerSpeed > 0 && enemySpeed > 0 ? playerSpeed / enemySpeed : 1;
  const speedLevel = getAttackSpeedLevel(speedRatio);

  return speedLevel.cooldown;
}

/**
 * エンゲージ中の敵の攻撃クールダウンを計算
 */
export function calculateEnemyAttackCooldown(params: {
  playerSpeed: number;
  enemySpeed: number;
}): number {
  const { playerSpeed, enemySpeed } = params;

  const speedRatio = playerSpeed > 0 && enemySpeed > 0 ? playerSpeed / enemySpeed : 1;
  const speedLevel = getAttackSpeedLevel(speedRatio);
  const engagedEnemyCooldown = Math.max(200, speedLevel.cooldown / speedRatio);

  return engagedEnemyCooldown;
}
