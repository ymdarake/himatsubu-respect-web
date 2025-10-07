import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  calculatePlayerPhysicalDamage,
  calculatePlayerMagicalDamage,
  calculateCriticalHit,
  calculateEnemyPhysicalDamage,
  calculateEnemyMagicalDamage,
  getAttackSpeedLevel,
  calculatePlayerAttackCooldown,
  calculateEnemyAttackCooldown,
} from '@/utils/combatCalculations';

describe('combatCalculations', () => {
  beforeEach(() => {
    // Math.randomのモック化
    vi.spyOn(Math, 'random');
  });

  describe('calculatePlayerPhysicalDamage', () => {
    it('基本的な物理ダメージを計算できる', () => {
      vi.mocked(Math.random).mockReturnValue(0.5); // 0.9 + 0.5 * 0.2 = 1.0

      const result = calculatePlayerPhysicalDamage({
        physicalAttack: 100,
        enemyPhysicalDefense: 50,
      });

      // basePhysicalAttack=100, effectiveDefense=50
      // totalStat=150, damageMultiplier=100/150=0.667
      // rawPhysicalDamage=100*0.667*1.0=66.7
      // finalPhysicalDamage=floor(66.7)=66
      expect(result.damage).toBe(66);
      expect(result.isCritical).toBe(false);
    });

    it('クリティカルヒット時にダメージが1.5倍になる', () => {
      // Math.randomを2回呼び出す: 1回目=ダメージ乱数、2回目=クリティカル判定
      vi.mocked(Math.random)
        .mockReturnValueOnce(0.5) // ダメージ乱数: 1.0
        .mockReturnValueOnce(0); // クリティカル判定: 必ず成功

      const result = calculatePlayerPhysicalDamage({
        physicalAttack: 100,
        enemyPhysicalDefense: 50,
        luckValue: 400, // クリティカル率75%
      });

      // 通常ダメージ66 * 1.5 = 99
      expect(result.damage).toBe(99);
      expect(result.isCritical).toBe(true);
    });

    it('最低ダメージは1', () => {
      vi.mocked(Math.random).mockReturnValue(0); // 最小乱数

      const result = calculatePlayerPhysicalDamage({
        physicalAttack: 1,
        enemyPhysicalDefense: 1000,
      });

      expect(result.damage).toBeGreaterThanOrEqual(1);
    });

    it('防御力が0の場合でもエラーにならない', () => {
      vi.mocked(Math.random).mockReturnValue(0.5);

      const result = calculatePlayerPhysicalDamage({
        physicalAttack: 100,
        enemyPhysicalDefense: 0,
      });

      expect(result.damage).toBeGreaterThan(0);
    });
  });

  describe('calculatePlayerMagicalDamage', () => {
    it('基本的な魔法ダメージを計算できる', () => {
      vi.mocked(Math.random).mockReturnValue(0.5); // 0.9 + 0.5 * 0.2 = 1.0

      const result = calculatePlayerMagicalDamage({
        magicalAttack: 100,
        elementalPower: 50,
        affinityMultiplier: 1.5,
        enemyMagicalDefense: 20,
      });

      // baseMagicalDamage = (100 * 1.5) * (1 + 50/100) = 150 * 1.5 = 225
      // rawMagicalDamage = floor(225 * 1.0) = 225
      // effectiveMagicalDamage = 225 * 1.5 = 337.5
      // finalMagicalDamage = max(1, floor(337.5) - 20) = 317
      expect(result).toBe(317);
    });

    it('相性が悪い場合はダメージが減少する', () => {
      vi.mocked(Math.random).mockReturnValue(0.5);

      const result = calculatePlayerMagicalDamage({
        magicalAttack: 100,
        elementalPower: 0,
        affinityMultiplier: 0.5, // 相性が悪い
        enemyMagicalDefense: 0,
      });

      // baseMagicalDamage = (100 * 1.5) * 1 = 150
      // rawMagicalDamage = 150
      // effectiveMagicalDamage = 150 * 0.5 = 75
      expect(result).toBe(75);
    });

    it('最低ダメージは1', () => {
      vi.mocked(Math.random).mockReturnValue(0);

      const result = calculatePlayerMagicalDamage({
        magicalAttack: 1,
        elementalPower: 0,
        affinityMultiplier: 0.1,
        enemyMagicalDefense: 1000,
      });

      expect(result).toBeGreaterThanOrEqual(1);
    });
  });

  describe('calculateCriticalHit', () => {
    it('運気に基づいてクリティカル判定を行う', () => {
      vi.mocked(Math.random).mockReturnValue(0.1);

      const result = calculateCriticalHit(400); // 400/400 = 1.0だが、max 0.75

      expect(result.isCritical).toBe(true);
      expect(result.criticalChance).toBe(0.75);
    });

    it('運気0ではクリティカル率が0%', () => {
      vi.mocked(Math.random).mockReturnValue(0);

      const result = calculateCriticalHit(0);

      expect(result.isCritical).toBe(false); // criticalChance=0なのでfalse
      expect(result.criticalChance).toBe(0);
    });

    it('クリティカル率は最大75%', () => {
      const result = calculateCriticalHit(10000); // 非常に高い運気

      expect(result.criticalChance).toBeLessThanOrEqual(0.75);
    });
  });

  describe('calculateEnemyPhysicalDamage', () => {
    it('基本的な物理ダメージを計算できる', () => {
      vi.mocked(Math.random).mockReturnValue(0.5); // 1.0

      const result = calculateEnemyPhysicalDamage({
        enemyPhysicalAttack: 100,
        playerPhysicalDefense: 50,
      });

      // enemyAttack=100, playerDefense=50
      // totalStat=150, damageMultiplier=100/150=0.667
      // rawPhysicalDamage=100*0.667*1.0=66.7
      // finalPhysicalDamage=floor(66.7)=66
      expect(result).toBe(66);
    });

    it('最低ダメージは1', () => {
      vi.mocked(Math.random).mockReturnValue(0);

      const result = calculateEnemyPhysicalDamage({
        enemyPhysicalAttack: 1,
        playerPhysicalDefense: 1000,
      });

      expect(result).toBeGreaterThanOrEqual(1);
    });

    it('防御力が0の場合でもエラーにならない', () => {
      vi.mocked(Math.random).mockReturnValue(0.5);

      const result = calculateEnemyPhysicalDamage({
        enemyPhysicalAttack: 100,
        playerPhysicalDefense: 0,
      });

      expect(result).toBeGreaterThan(0);
    });
  });

  describe('calculateEnemyMagicalDamage', () => {
    it('基本的な魔法ダメージを計算できる（乱数なし）', () => {
      const result = calculateEnemyMagicalDamage({
        enemyMagicalAttack: 100,
        enemyIntelligence: 50,
        playerMagicalDefense: 20,
      });

      // baseMagicalDamage = (100 * 1.5) * (1 + 50/100) = 150 * 1.5 = 225
      // finalMagicalDamage = max(1, floor(225) - 20) = 205
      expect(result).toBe(205);
    });

    it('最低ダメージは1', () => {
      const result = calculateEnemyMagicalDamage({
        enemyMagicalAttack: 1,
        enemyIntelligence: 0,
        playerMagicalDefense: 1000,
      });

      expect(result).toBeGreaterThanOrEqual(1);
    });

    it('知力が高いほどダメージが増加する', () => {
      const lowInt = calculateEnemyMagicalDamage({
        enemyMagicalAttack: 100,
        enemyIntelligence: 0,
        playerMagicalDefense: 0,
      });

      const highInt = calculateEnemyMagicalDamage({
        enemyMagicalAttack: 100,
        enemyIntelligence: 100,
        playerMagicalDefense: 0,
      });

      expect(highInt).toBeGreaterThan(lowInt);
    });
  });

  describe('getAttackSpeedLevel', () => {
    it('速度比率に基づいて適切な速度レベルを返す', () => {
      // Very Slow: ratio <= 0.25
      expect(getAttackSpeedLevel(0.2).cooldown).toBe(800);

      // Slow: ratio <= 0.5
      expect(getAttackSpeedLevel(0.4).cooldown).toBe(700);

      // Normal: ratio <= 1.2
      expect(getAttackSpeedLevel(1.0).cooldown).toBe(500);

      // Fast: ratio <= 2
      expect(getAttackSpeedLevel(1.5).cooldown).toBe(400);

      // Ludicrous Speed: ratio > 8
      expect(getAttackSpeedLevel(10).cooldown).toBe(250);
    });

    it('速度が0の場合はデフォルト（Normal）を返す', () => {
      expect(getAttackSpeedLevel(0).cooldown).toBe(500);
    });
  });

  describe('calculatePlayerAttackCooldown', () => {
    it('プレイヤーの攻撃クールダウンを計算', () => {
      const cooldown = calculatePlayerAttackCooldown({
        playerSpeed: 100,
        enemySpeed: 100,
      });

      // speedRatio = 1.0 -> Normal (500ms)
      expect(cooldown).toBe(500);
    });

    it('プレイヤーが速い場合はクールダウンが短い', () => {
      const cooldown = calculatePlayerAttackCooldown({
        playerSpeed: 200,
        enemySpeed: 100,
      });

      // speedRatio = 2.0 -> Fast (400ms)
      expect(cooldown).toBe(400);
    });

    it('敵が速い場合はクールダウンが長い', () => {
      const cooldown = calculatePlayerAttackCooldown({
        playerSpeed: 50,
        enemySpeed: 100,
      });

      // speedRatio = 0.5 -> Slow (700ms)
      expect(cooldown).toBe(700);
    });
  });

  describe('calculateEnemyAttackCooldown', () => {
    it('エンゲージ中の敵の攻撃クールダウンを計算', () => {
      const cooldown = calculateEnemyAttackCooldown({
        playerSpeed: 100,
        enemySpeed: 100,
      });

      // speedRatio = 1.0 -> speedLevel.cooldown = 500
      // engagedEnemyCooldown = max(200, 500 / 1.0) = 500
      expect(cooldown).toBe(500);
    });

    it('プレイヤーが非常に速い場合は敵の攻撃間隔が短くなる', () => {
      const cooldown = calculateEnemyAttackCooldown({
        playerSpeed: 400,
        enemySpeed: 100,
      });

      // speedRatio = 4.0 -> speedLevel.cooldown = 350
      // engagedEnemyCooldown = max(200, 350 / 4.0) = 200（最小値）
      expect(cooldown).toBe(200);
    });

    it('最低クールダウンは200ms', () => {
      const cooldown = calculateEnemyAttackCooldown({
        playerSpeed: 10000,
        enemySpeed: 1,
      });

      expect(cooldown).toBeGreaterThanOrEqual(200);
    });
  });
});
