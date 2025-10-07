/**
 * 報酬計算ユーティリティ
 *
 * 敵撃破時のXP、ゴールド、アイテムドロップなどの計算を行う純粋関数群
 */

/**
 * 敵撃破時のXP報酬を計算
 *
 * ステージNを2周（10体撃破）でレベルN→N+1にレベルアップする設計
 */
export function calculateXpReward(params: {
  enemyXpValue: number;
  stageIndex: number;
  xpMultiplier: number;
}): number {
  const { enemyXpValue, stageIndex, xpMultiplier } = params;

  // ステージの目標レベル = ステージ番号 + 1
  const targetLevel = stageIndex + 1;

  // そのレベルに必要なXPを計算
  let requiredXPForTargetLevel = 50; // 初期値
  for (let i = 1; i < targetLevel; i++) {
    requiredXPForTargetLevel = Math.floor(requiredXPForTargetLevel * xpMultiplier);
  }

  // 10体で達成できるように敵1体のXPを設定（敵の基礎xpValueを掛ける）
  const baseXpPerEnemy = Math.floor(requiredXPForTargetLevel / 10);
  const xpGained = Math.floor(baseXpPerEnemy * (enemyXpValue / 20)); // xpValue平均20で正規化

  return xpGained;
}

/**
 * 通常敵からのゴールド報酬を計算
 */
export function calculateGoldReward(params: {
  enemyGoldValue: number;
  luckValue: number;
}): number {
  const { enemyGoldValue, luckValue } = params;

  const baseGoldFromEnemy = enemyGoldValue * (0.8 + Math.random() * 0.4);
  const luckBonusMultiplier = 1 + (luckValue * 0.00833); // 運気300で3.5倍
  const goldDropped = Math.floor(baseGoldFromEnemy * luckBonusMultiplier);

  return goldDropped;
}

/**
 * ゴールドスライムからのゴールド報酬を計算
 */
export function calculateGoldSlimeReward(stageIndex: number): number {
  return (stageIndex + 1) * 100;
}

/**
 * アイテムドロップ率を計算
 */
export function calculateDropChance(params: {
  luckValue: number;
  baseDropChance: number;
  luckMultiplier: number;
}): number {
  const { luckValue, baseDropChance, luckMultiplier } = params;
  return baseDropChance + luckValue * luckMultiplier;
}

/**
 * ジェムスライムからのジェムドロップを生成
 *
 * @returns 各ステータスのジェム数
 */
export function generateGemDrops(): Partial<Record<'strength' | 'stamina' | 'intelligence' | 'speedAgility' | 'luck', number>> {
  const numberOfGems = Math.floor(Math.random() * 3) + 3; // 3〜5個
  const allStats: ('strength' | 'stamina' | 'intelligence' | 'speedAgility' | 'luck')[] = [
    'strength',
    'stamina',
    'intelligence',
    'speedAgility',
    'luck'
  ];
  const droppedGemsCount: Partial<Record<'strength' | 'stamina' | 'intelligence' | 'speedAgility' | 'luck', number>> = {};

  for (let i = 0; i < numberOfGems; i++) {
    const randomStat = allStats[Math.floor(Math.random() * allStats.length)];
    droppedGemsCount[randomStat] = (droppedGemsCount[randomStat] || 0) + 1;
  }

  return droppedGemsCount;
}
