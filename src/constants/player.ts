import { Player, PlayStats } from '../types';

export const INITIAL_PLAYER: Player = {
  name: 'Hero',
  currentHp: 0, // Will be set based on derived maxHp at game start
  baseStats: {
    strength: 5,     // 腕力
    stamina: 5,      // 体力
    intelligence: 5, // 知力
    speedAgility: 5, // 敏捷
    luck: 5,         // 幸運
  },
  x: 100, // Start player at x=100 to leave space on the left
  isWalking: false,
  level: 1,
  xp: 0,
  xpToNextLevel: 50,
  gold: 0,
  statPoints: 0,
  equipment: {
    weapon: null,
    armor: null,
    accessory: null,
  },
  inventory: [],
  isStatAllocationLocked: false,
  lastStatAllocation: null,
};

export const INITIAL_PLAY_STATS: PlayStats = {
  startTime: 0,
  playTime: 0,
  enemiesDefeated: 0,
  farthestDistance: 0,
  totalDistanceTraveled: 0,
  totalXpGained: 0,
  collectedEquipment: new Set(),
  gemCollection: {
    strength: 0,
    stamina: 0,
    intelligence: 0,
    speedAgility: 0,
    luck: 0,
  },
};
