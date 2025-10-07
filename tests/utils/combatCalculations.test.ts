import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  calculatePlayerPhysicalDamage,
  calculatePlayerMagicalDamage,
  calculateCriticalHit,
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
});
