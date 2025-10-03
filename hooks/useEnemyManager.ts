import { useState, useRef, useCallback, useMemo } from 'react';
import { Enemy } from '../types';

/**
 * 敵キャラクターの状態管理を担当するカスタムフック
 *
 * 責務:
 * - 敵の配列state管理
 * - 敵の生成・更新・削除
 * - エンゲージ中の敵、表示中の敵の管理
 * - 敵のヒット状態管理
 */
export const useEnemyManager = () => {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [engagedEnemyId, setEngagedEnemyId] = useState<number | null>(null);
  const [displayedEnemyId, setDisplayedEnemyId] = useState<number | null>(null);
  const [enemyHits, setEnemyHits] = useState<Record<number, boolean>>({});

  const nextEnemyId = useRef(0);
  const enemyAttackTimers = useRef<Record<number, number>>({});

  /**
   * 敵をリセット（ゲーム開始時やステージ遷移時）
   */
  const resetEnemies = useCallback(() => {
    setEnemies([]);
    setEngagedEnemyId(null);
    setDisplayedEnemyId(null);
    setEnemyHits({});
    enemyAttackTimers.current = {};
  }, []);

  /**
   * 敵IDカウンターをリセット（ゲーム全体のリセット時）
   */
  const resetEnemyIdCounter = useCallback(() => {
    nextEnemyId.current = 0;
  }, []);

  /**
   * エンゲージ中の敵を取得
   */
  const engagedEnemy = useMemo(
    () => enemies.find(e => e.id === engagedEnemyId && e.currentHp > 0),
    [enemies, engagedEnemyId]
  );

  /**
   * 表示中の敵を取得
   */
  const displayedEnemy = useMemo(
    () => enemies.find(e => e.id === displayedEnemyId),
    [enemies, displayedEnemyId]
  );

  /**
   * 生存している敵のリストを取得
   */
  const activeEnemies = useMemo(
    () => enemies.filter(e => e.currentHp > 0),
    [enemies]
  );

  return {
    // State
    enemies,
    engagedEnemyId,
    displayedEnemyId,
    enemyHits,

    // Refs
    nextEnemyId,
    enemyAttackTimers,

    // Setters
    setEnemies,
    setEngagedEnemyId,
    setDisplayedEnemyId,
    setEnemyHits,

    // Computed values
    engagedEnemy,
    displayedEnemy,
    activeEnemies,

    // Actions
    resetEnemies,
    resetEnemyIdCounter,
  };
};
