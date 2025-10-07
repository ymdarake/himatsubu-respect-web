import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  calculateXpReward,
  calculateGoldReward,
  calculateGoldSlimeReward,
  calculateDropChance,
  generateGemDrops,
} from '@/utils/rewardCalculations';

describe('rewardCalculations', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random');
  });
  describe('calculateXpReward', () => {
    it('ステージ0で敵撃破時のXPを計算できる', () => {
      const xp = calculateXpReward({
        enemyXpValue: 20,
        stageIndex: 0,
        xpMultiplier: 1.5,
      });

      // targetLevel = 0 + 1 = 1
      // requiredXPForTargetLevel = 50
      // baseXpPerEnemy = floor(50 / 10) = 5
      // xpGained = floor(5 * (20 / 20)) = 5
      expect(xp).toBe(5);
    });

    it('ステージ1で敵撃破時のXPを計算できる', () => {
      const xp = calculateXpReward({
        enemyXpValue: 20,
        stageIndex: 1,
        xpMultiplier: 1.5,
      });

      // targetLevel = 1 + 1 = 2
      // requiredXPForTargetLevel = floor(50 * 1.5) = 75
      // baseXpPerEnemy = floor(75 / 10) = 7
      // xpGained = floor(7 * (20 / 20)) = 7
      expect(xp).toBe(7);
    });

    it('敵のxpValueが高いほど多くのXPを獲得', () => {
      const lowXp = calculateXpReward({
        enemyXpValue: 10,
        stageIndex: 0,
        xpMultiplier: 1.5,
      });

      const highXp = calculateXpReward({
        enemyXpValue: 40,
        stageIndex: 0,
        xpMultiplier: 1.5,
      });

      expect(highXp).toBeGreaterThan(lowXp);
    });

    it('ステージが進むほど必要XPが増える', () => {
      const stage0Xp = calculateXpReward({
        enemyXpValue: 20,
        stageIndex: 0,
        xpMultiplier: 1.5,
      });

      const stage5Xp = calculateXpReward({
        enemyXpValue: 20,
        stageIndex: 5,
        xpMultiplier: 1.5,
      });

      expect(stage5Xp).toBeGreaterThan(stage0Xp);
    });

    it('XP計算結果は整数', () => {
      const xp = calculateXpReward({
        enemyXpValue: 15,
        stageIndex: 2,
        xpMultiplier: 1.5,
      });

      expect(Number.isInteger(xp)).toBe(true);
    });
  });

  describe('calculateGoldReward', () => {
    it('基本的なゴールド報酬を計算できる', () => {
      vi.mocked(Math.random).mockReturnValue(0.5); // 0.8 + 0.5 * 0.4 = 1.0

      const gold = calculateGoldReward({
        enemyGoldValue: 100,
        luckValue: 0,
      });

      // baseGoldFromEnemy = 100 * 1.0 = 100
      // luckBonusMultiplier = 1 + (0 * 0.00833) = 1
      // goldDropped = floor(100 * 1) = 100
      expect(gold).toBe(100);
    });

    it('運気が高いほどゴールドが増える', () => {
      vi.mocked(Math.random).mockReturnValue(0.5);

      const lowLuck = calculateGoldReward({
        enemyGoldValue: 100,
        luckValue: 0,
      });

      const highLuck = calculateGoldReward({
        enemyGoldValue: 100,
        luckValue: 300,
      });

      // luckValue=300 -> luckBonusMultiplier = 1 + (300 * 0.00833) = 3.499
      expect(highLuck).toBeGreaterThan(lowLuck);
    });

    it('乱数により0.8〜1.2倍の範囲で変動する', () => {
      // 最小値（0.8倍）
      vi.mocked(Math.random).mockReturnValue(0);
      const minGold = calculateGoldReward({
        enemyGoldValue: 100,
        luckValue: 0,
      });
      expect(minGold).toBe(80);

      // 最大値（1.2倍）
      vi.mocked(Math.random).mockReturnValue(1);
      const maxGold = calculateGoldReward({
        enemyGoldValue: 100,
        luckValue: 0,
      });
      expect(maxGold).toBe(120);
    });

    it('ゴールド報酬は整数', () => {
      vi.mocked(Math.random).mockReturnValue(0.7);

      const gold = calculateGoldReward({
        enemyGoldValue: 123,
        luckValue: 150,
      });

      expect(Number.isInteger(gold)).toBe(true);
    });
  });

  describe('calculateGoldSlimeReward', () => {
    it('ステージに応じたゴールド報酬を計算', () => {
      expect(calculateGoldSlimeReward(0)).toBe(100);
      expect(calculateGoldSlimeReward(1)).toBe(200);
      expect(calculateGoldSlimeReward(5)).toBe(600);
      expect(calculateGoldSlimeReward(10)).toBe(1100);
    });
  });

  describe('calculateDropChance', () => {
    it('基本ドロップ率を計算', () => {
      const dropChance = calculateDropChance({
        luckValue: 0,
        baseDropChance: 0.02,
        luckMultiplier: 0.001,
      });

      // 0.02 + 0 * 0.001 = 0.02 (2%)
      expect(dropChance).toBe(0.02);
    });

    it('運気が高いほどドロップ率が上がる', () => {
      const lowLuckChance = calculateDropChance({
        luckValue: 0,
        baseDropChance: 0.02,
        luckMultiplier: 0.001,
      });

      const highLuckChance = calculateDropChance({
        luckValue: 100,
        baseDropChance: 0.02,
        luckMultiplier: 0.001,
      });

      // 0.02 + 100 * 0.001 = 0.12 (12%)
      expect(highLuckChance).toBeGreaterThan(lowLuckChance);
      expect(highLuckChance).toBeCloseTo(0.12, 5); // 小数点5桁まで
    });

    it('運気300でドロップ率が32%になる', () => {
      const dropChance = calculateDropChance({
        luckValue: 300,
        baseDropChance: 0.02,
        luckMultiplier: 0.001,
      });

      // 0.02 + 300 * 0.001 = 0.32 (32%)
      expect(dropChance).toBe(0.32);
    });
  });

  describe('generateGemDrops', () => {
    it('3〜5個のジェムをランダムにドロップ', () => {
      // 3個ドロップ（最小値）
      vi.mocked(Math.random).mockReturnValue(0);
      const minGems = generateGemDrops();
      const minTotal = Object.values(minGems).reduce((sum, count) => sum + count, 0);
      expect(minTotal).toBe(3);

      // 5個ドロップ（最大値）
      vi.mocked(Math.random).mockReturnValue(0.99);
      const maxGems = generateGemDrops();
      const maxTotal = Object.values(maxGems).reduce((sum, count) => sum + count, 0);
      expect(maxTotal).toBe(5);
    });

    it('ドロップされたジェムは有効なステータス', () => {
      vi.mocked(Math.random).mockReturnValue(0.5);

      const gems = generateGemDrops();
      const validStats = ['strength', 'stamina', 'intelligence', 'speedAgility', 'luck'];

      for (const stat of Object.keys(gems)) {
        expect(validStats).toContain(stat);
      }
    });

    it('各ステータスのドロップ数は0以上', () => {
      vi.mocked(Math.random).mockReturnValue(0.5);

      const gems = generateGemDrops();

      for (const count of Object.values(gems)) {
        expect(count).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
