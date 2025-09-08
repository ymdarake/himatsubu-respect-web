import { Player, Area, ShopType, BaseStats, PlayStats, Element, AllocatableStat } from './types';

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
  xpToNextLevel: 70,
  gold: 0,
  statPoints: 0,
  equipment: {
    weapon: null,
    armor: null,
    accessory: null,
  },
  inventory: [],
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

export const BASE_EQUIPMENT_NAMES = [
    'ブレード', 'ソード', 'アックス', 'スピア',
    'ガード', 'メイル', 'プレート', 'ヘルム',
    'トーテム', 'リング', 'アミュレット', 'チャーム'
];

export const GAME_SPEED = 10;
export const ATTACK_RANGE = 25; // in pixels
export const STAGE_LENGTH = 10; // in meters
export const PIXELS_PER_METER = 100;
export const HEALING_HOUSE_RANGE = 40;
export const SHOP_RANGE = 80;
export const ENEMY_PANEL_DISPLAY_RANGE = 200; // pixels
export const LUCK_TO_GOLD_MULTIPLIER = 0.05; // 5% bonus gold per luck point
export const STAT_POINTS_PER_LEVEL = 5;

// New constants for item drops
export const BASE_DROP_CHANCE = 0.02; // 2% base chance
export const LUCK_TO_DROP_CHANCE_MULTIPLIER = 0.001; // 0.1% increased chance per luck point

export const GEM_COLORS: Record<AllocatableStat, string> = {
    strength: 'bg-red-500',
    stamina: 'bg-green-500',
    intelligence: 'bg-blue-500',
    speedAgility: 'bg-yellow-500',
    luck: 'bg-purple-500',
};

export const ELEMENT_COLORS: Record<Element, string> = {
    '火': 'text-red-400',
    '水': 'text-blue-400',
    '風': 'text-green-400',
    '土': 'text-yellow-600',
    '光': 'text-yellow-300',
    '闇': 'text-purple-400',
    '無': 'text-gray-400',
};

export const ELEMENT_HEX_COLORS: Record<Element, string> = {
    '火': '#f87171', // red-400
    '水': '#60a5fa', // blue-400
    '風': '#4ade80', // green-400
    '土': '#ca8a04', // yellow-600
    '光': '#fde047', // yellow-300
    '闇': '#a855f7', // purple-500
    '無': '#9ca3af', // gray-400
};

export const ELEMENTAL_PREFIXES: Record<Element, string> = {
    '火': 'フレイム',
    '水': 'アクア',
    '風': 'ウィンド',
    '土': 'アース',
    '光': 'ライト',
    '闇': 'ダーク',
    '無': '',
};


export const XP_FOR_NEXT_LEVEL_MULTIPLIER = 1.5;

export const ELEMENTAL_AFFINITY: Record<Element, Record<Element, number>> = {
    '火': { '火': 1, '水': 0.5, '風': 2, '土': 1, '光': 1, '闇': 1, '無': 1 },
    '水': { '火': 2, '水': 1, '風': 1, '土': 0.5, '光': 1, '闇': 1, '無': 1 },
    '風': { '火': 0.5, '水': 1, '風': 1, '土': 2, '光': 1, '闇': 1, '無': 1 },
    '土': { '火': 1, '水': 2, '風': 0.5, '土': 1, '光': 1, '闇': 1, '無': 1 },
    '光': { '火': 1, '水': 1, '風': 1, '土': 1, '光': 1, '闇': 2, '無': 1 },
    '闇': { '火': 1, '水': 1, '風': 1, '土': 1, '光': 2, '闇': 1, '無': 1 },
    '無': { '火': 1, '水': 1, '風': 1, '土': 1, '光': 1, '闇': 1, '無': 1 },
};

export const ATTACK_SPEED_LEVELS: { ratio: number; cooldown: number }[] = [
  // ratio (playerSpeed / enemySpeed), playerCooldown (ms)
  { ratio: 0.25, cooldown: 800 }, // Enemy is 4x+ faster -> Player is Very Slow
  { ratio: 0.5, cooldown: 700 },  // Enemy is 2x+ faster -> Player is Slow
  { ratio: 0.8, cooldown: 600 },  // Enemy is slightly faster -> Player is a bit Slow
  { ratio: 1.2, cooldown: 500 },  // Speeds are about even -> Player is Normal
  { ratio: 2, cooldown: 400 },    // Player is up to 2x faster -> Player is Fast
  { ratio: 4, cooldown: 350 },    // Player is up to 4x faster -> Player is Very Fast
  { ratio: 8, cooldown: 300 },    // Player is up to 8x faster -> Player is Ultra Fast
  { ratio: Infinity, cooldown: 250 }, // Player is 8x+ faster -> Player is Ludicrous Speed
];

export interface EnemyBaseData {
  name: string;
  baseStats: BaseStats;
  element: Element;
  color: string;
  shape: 'square' | 'circle';
  xpValue: number;
  goldValue: number;
  attackPrepareTime: number;
  attackAnimationTime: number;
}


export const ENEMY_DATA: Record<string, EnemyBaseData> = {
  'スライム': { name: 'スライム', baseStats: { strength: 4, stamina: 2, intelligence: 1, speedAgility: 3, luck: 2 }, element: '水', color: 'bg-green-500', shape: 'circle', xpValue: 10, goldValue: 12, attackPrepareTime: 1200, attackAnimationTime: 400 },
  'ゴブリン': { name: 'ゴブリン', baseStats: { strength: 6, stamina: 4, intelligence: 2, speedAgility: 5, luck: 3 }, element: '土', color: 'bg-green-700', shape: 'square', xpValue: 15, goldValue: 18, attackPrepareTime: 1000, attackAnimationTime: 300 },
  'ウルフ': { name: 'ウルフ', baseStats: { strength: 7, stamina: 5, intelligence: 1, speedAgility: 10, luck: 4 }, element: '風', color: 'bg-gray-500', shape: 'square', xpValue: 20, goldValue: 30, attackPrepareTime: 700, attackAnimationTime: 300 },
  'バット': { name: 'バット', baseStats: { strength: 5, stamina: 3, intelligence: 1, speedAgility: 15, luck: 5 }, element: '闇', color: 'bg-gray-600', shape: 'circle', xpValue: 18, goldValue: 24, attackPrepareTime: 600, attackAnimationTime: 250 },
  'トレント': { name: 'トレント', baseStats: { strength: 10, stamina: 6, intelligence: 2, speedAgility: 1, luck: 3 }, element: '土', color: 'bg-yellow-900', shape: 'square', xpValue: 25, goldValue: 48, attackPrepareTime: 2200, attackAnimationTime: 700 },
  'オーク': { name: 'オーク', baseStats: { strength: 12, stamina: 8, intelligence: 2, speedAgility: 4, luck: 2 }, element: '火', color: 'bg-red-700', shape: 'square', xpValue: 30, goldValue: 60, attackPrepareTime: 1500, attackAnimationTime: 500 },
  'ロック・スパイダー': { name: 'ロック・スパイダー', baseStats: { strength: 9, stamina: 6, intelligence: 1, speedAgility: 9, luck: 6 }, element: '土', color: 'bg-stone-600', shape: 'circle', xpValue: 35, goldValue: 72, attackPrepareTime: 900, attackAnimationTime: 350 },
  'ゴーレム': { name: 'ゴーレム', baseStats: { strength: 8, stamina: 15, intelligence: 1, speedAgility: 2, luck: 1 }, element: '土', color: 'bg-stone-500', shape: 'square', xpValue: 40, goldValue: 90, attackPrepareTime: 2000, attackAnimationTime: 600 },
  'ファイア・エレメンタル': { name: 'ファイア・エレメンタル', baseStats: { strength: 10, stamina: 8, intelligence: 10, speedAgility: 12, luck: 7 }, element: '火', color: 'bg-orange-500', shape: 'circle', xpValue: 60, goldValue: 120, attackPrepareTime: 1400, attackAnimationTime: 400 },
  'ドラゴン': { name: 'ドラゴン', baseStats: { strength: 15, stamina: 15, intelligence: 8, speedAgility: 9, luck: 5 }, element: '闇', color: 'bg-red-900', shape: 'circle', xpValue: 100, goldValue: 300, attackPrepareTime: 1800, attackAnimationTime: 500 },
};


export const AREAS: Area[] = [
    { name: '草原', bgColor: 'bg-sky-400', groundColor: 'bg-green-700', enemyTypes: ['スライム', 'ゴブリン'] },
    { name: '暗い森', bgColor: 'bg-indigo-900', groundColor: 'bg-emerald-950', enemyTypes: ['ウルフ', 'バット', 'トレント'] },
    { name: '埃の洞窟', bgColor: 'bg-yellow-800', groundColor: 'bg-yellow-950', enemyTypes: ['オーク', 'ロック・スパイダー', 'ゴーレム'] },
    { name: '火山', bgColor: 'bg-red-700', groundColor: 'bg-stone-800', enemyTypes: ['ファイア・エレメンタル', 'ドラゴン'] },
    { name: '城の門', bgColor: 'bg-gray-600', groundColor: 'bg-gray-800', enemyTypes: ['ゴーレム', 'オーク', 'ドラゴン'] },
    { name: '玉座', bgColor: 'bg-purple-800', groundColor: 'bg-purple-950', enemyTypes: ['バット', 'ファイア・エレメンタル', 'ドラゴン'] },
];

export const SHOP_TYPES: ShopType[] = ['weapon_shop', 'armor_shop', 'accessory_shop'];

export const SCENERY_CONFIG: Record<string, { type: string; density: number; variants: any[] }[]> = {
    '草原': [
        { type: 'tree', density: 0.8, variants: [{ color: 'bg-green-800', trunkColor: 'bg-yellow-900' }] },
        { type: 'bush', density: 1.5, variants: [{ color: 'bg-green-600' }, {color: 'bg-green-900'}] },
        { type: 'rock', density: 0.5, variants: [{ color: 'bg-gray-500' }] },
    ],
    '暗い森': [
        { type: 'tree', density: 2.0, variants: [{ color: 'bg-emerald-800', trunkColor: 'bg-stone-800' }, { color: 'bg-emerald-900', trunkColor: 'bg-stone-700' }] },
        { type: 'rock', density: 1.0, variants: [{ color: 'bg-gray-600' }] },
    ],
    '埃の洞窟': [
        { type: 'stalagmite', density: 1.8, variants: [{ color: 'bg-yellow-700' }, { color: 'bg-yellow-800' }] },
        { type: 'rock', density: 2.5, variants: [{ color: 'bg-stone-700' }] },
    ],
    '火山': [
        { type: 'rock', density: 3.0, variants: [{ color: 'bg-stone-900' }, {color: 'bg-red-900'}] },
        { type: 'crystal', density: 0.7, variants: [{ color: 'bg-red-500' }] },
    ],
     '城の門': [
        { type: 'pillar', density: 1.2, variants: [{ color: 'bg-gray-400' }] },
        { type: 'rock', density: 1.0, variants: [{ color: 'bg-gray-700' }] },
    ],
    '玉座': [
         { type: 'pillar', density: 1.5, variants: [{ color: 'bg-purple-600' }] },
         { type: 'crystal', density: 1.2, variants: [{ color: 'bg-purple-400' }, { color: 'bg-fuchsia-500' }] },
    ],
};