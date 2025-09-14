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

export const GAME_SPEED = 10;
export const ATTACK_RANGE = 25; // in pixels
export const STAGE_LENGTH = 10; // in meters
export const PIXELS_PER_METER = 100;
export const HEALING_HOUSE_RANGE = 40;
export const SHOP_RANGE = 80;
export const ENEMY_PANEL_DISPLAY_RANGE = 200; // pixels
export const STAT_POINTS_PER_LEVEL = 5;

// Item and enemy spawn rates
export const BASE_DROP_CHANCE = 0.02; // 2% base chance
export const LUCK_TO_DROP_CHANCE_MULTIPLIER = 0.001; // 0.1% increased chance per luck point
export const GEM_SLIME_SPAWN_CHANCE = 0.05; // 5% chance for a Gem Slime to spawn

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


export const XP_FOR_NEXT_LEVEL_MULTIPLIER = 1.05;

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
  'スライム': { name: 'スライム', baseStats: { strength: 4, stamina: 2, intelligence: 1, speedAgility: 3, luck: 2 }, element: '水', color: 'bg-green-500', shape: 'circle', xpValue: 18, goldValue: 12, attackPrepareTime: 1200, attackAnimationTime: 400 },
  'ゴブリン': { name: 'ゴブリン', baseStats: { strength: 6, stamina: 4, intelligence: 2, speedAgility: 5, luck: 3 }, element: '土', color: 'bg-green-700', shape: 'square', xpValue: 26, goldValue: 18, attackPrepareTime: 1000, attackAnimationTime: 300 },
  'ホーネット': { name: 'ホーネット', baseStats: { strength: 4, stamina: 2, intelligence: 1, speedAgility: 12, luck: 3 }, element: '風', color: 'bg-yellow-400', shape: 'circle', xpValue: 20, goldValue: 15, attackPrepareTime: 600, attackAnimationTime: 200 },
  'マッドパピー': { name: 'マッドパピー', baseStats: { strength: 5, stamina: 4, intelligence: 1, speedAgility: 6, luck: 2 }, element: '土', color: 'bg-yellow-700', shape: 'square', xpValue: 22, goldValue: 16, attackPrepareTime: 900, attackAnimationTime: 300 },
  'ジャイアントワーム': { name: 'ジャイアントワーム', baseStats: { strength: 6, stamina: 8, intelligence: 1, speedAgility: 2, luck: 1 }, element: '土', color: 'bg-yellow-800', shape: 'circle', xpValue: 25, goldValue: 20, attackPrepareTime: 1500, attackAnimationTime: 500 },
  'ワイルドボア': { name: 'ワイルドボア', baseStats: { strength: 8, stamina: 5, intelligence: 1, speedAgility: 5, luck: 2 }, element: '土', color: 'bg-stone-600', shape: 'square', xpValue: 28, goldValue: 22, attackPrepareTime: 1100, attackAnimationTime: 400 },
  'マンドラゴラ': { name: 'マンドラゴラ', baseStats: { strength: 2, stamina: 4, intelligence: 7, speedAgility: 3, luck: 4 }, element: '土', color: 'bg-green-600', shape: 'circle', xpValue: 24, goldValue: 18, attackPrepareTime: 1300, attackAnimationTime: 600 },
  'キラービー': { name: 'キラービー', baseStats: { strength: 5, stamina: 3, intelligence: 1, speedAgility: 16, luck: 4 }, element: '風', color: 'bg-amber-500', shape: 'circle', xpValue: 29, goldValue: 25, attackPrepareTime: 500, attackAnimationTime: 200 },
  'ファンガス': { name: 'ファンガス', baseStats: { strength: 4, stamina: 7, intelligence: 3, speedAgility: 2, luck: 3 }, element: '土', color: 'bg-purple-400', shape: 'circle', xpValue: 26, goldValue: 21, attackPrepareTime: 1400, attackAnimationTime: 500 },
  'ピクシー': { name: 'ピクシー', baseStats: { strength: 1, stamina: 2, intelligence: 6, speedAgility: 14, luck: 6 }, element: '風', color: 'bg-pink-300', shape: 'circle', xpValue: 27, goldValue: 23, attackPrepareTime: 800, attackAnimationTime: 300 },
  'ウルフ': { name: 'ウルフ', baseStats: { strength: 7, stamina: 5, intelligence: 1, speedAgility: 10, luck: 4 }, element: '風', color: 'bg-gray-500', shape: 'square', xpValue: 35, goldValue: 30, attackPrepareTime: 700, attackAnimationTime: 300 },
  'バット': { name: 'バット', baseStats: { strength: 5, stamina: 3, intelligence: 1, speedAgility: 15, luck: 5 }, element: '闇', color: 'bg-gray-600', shape: 'circle', xpValue: 32, goldValue: 24, attackPrepareTime: 600, attackAnimationTime: 250 },
  'スケルトン': { name: 'スケルトン', baseStats: { strength: 8, stamina: 5, intelligence: 1, speedAgility: 6, luck: 2 }, element: '闇', color: 'bg-gray-300', shape: 'square', xpValue: 40, goldValue: 35, attackPrepareTime: 900, attackAnimationTime: 400 },
  'トレント': { name: 'トレント', baseStats: { strength: 10, stamina: 6, intelligence: 2, speedAgility: 1, luck: 3 }, element: '土', color: 'bg-yellow-900', shape: 'square', xpValue: 44, goldValue: 48, attackPrepareTime: 2200, attackAnimationTime: 700 },
  'ゴースト': { name: 'ゴースト', baseStats: { strength: 2, stamina: 3, intelligence: 9, speedAgility: 11, luck: 5 }, element: '闇', color: 'bg-gray-200', shape: 'circle', xpValue: 38, goldValue: 32, attackPrepareTime: 1000, attackAnimationTime: 400 },
  'ダークエルフ': { name: 'ダークエルフ', baseStats: { strength: 6, stamina: 5, intelligence: 6, speedAgility: 13, luck: 4 }, element: '闇', color: 'bg-indigo-400', shape: 'square', xpValue: 42, goldValue: 40, attackPrepareTime: 800, attackAnimationTime: 300 },
  'ウィスプ': { name: 'ウィスプ', baseStats: { strength: 1, stamina: 2, intelligence: 10, speedAgility: 15, luck: 7 }, element: '光', color: 'bg-cyan-300', shape: 'circle', xpValue: 40, goldValue: 35, attackPrepareTime: 1200, attackAnimationTime: 500 },
  'グール': { name: 'グール', baseStats: { strength: 9, stamina: 7, intelligence: 1, speedAgility: 4, luck: 1 }, element: '闇', color: 'bg-stone-500', shape: 'square', xpValue: 45, goldValue: 45, attackPrepareTime: 1300, attackAnimationTime: 500 },
  'ジャイアントスパイダー': { name: 'ジャイアントスパイダー', baseStats: { strength: 8, stamina: 6, intelligence: 1, speedAgility: 10, luck: 5 }, element: '土', color: 'bg-gray-800', shape: 'circle', xpValue: 48, goldValue: 50, attackPrepareTime: 800, attackAnimationTime: 300 },
  'ウッドゴーレム': { name: 'ウッドゴーレム', baseStats: { strength: 11, stamina: 10, intelligence: 1, speedAgility: 1, luck: 2 }, element: '土', color: 'bg-yellow-950', shape: 'square', xpValue: 50, goldValue: 55, attackPrepareTime: 2500, attackAnimationTime: 800 },
  'オーク': { name: 'オーク', baseStats: { strength: 12, stamina: 8, intelligence: 2, speedAgility: 4, luck: 2 }, element: '火', color: 'bg-red-700', shape: 'square', xpValue: 53, goldValue: 60, attackPrepareTime: 1500, attackAnimationTime: 500 },
  'リザードマン': { name: 'リザードマン', baseStats: { strength: 9, stamina: 7, intelligence: 4, speedAgility: 8, luck: 3 }, element: '水', color: 'bg-teal-600', shape: 'square', xpValue: 80, goldValue: 85, attackPrepareTime: 1100, attackAnimationTime: 450 },
  'ロック・スパイダー': { name: 'ロック・スパイダー', baseStats: { strength: 9, stamina: 6, intelligence: 1, speedAgility: 9, luck: 6 }, element: '土', color: 'bg-stone-600', shape: 'circle', xpValue: 60, goldValue: 72, attackPrepareTime: 900, attackAnimationTime: 350 },
  'ゴーレム': { name: 'ゴーレム', baseStats: { strength: 8, stamina: 15, intelligence: 1, speedAgility: 2, luck: 1 }, element: '土', color: 'bg-stone-500', shape: 'square', xpValue: 69, goldValue: 90, attackPrepareTime: 2000, attackAnimationTime: 600 },
  'コボルト': { name: 'コボルト', baseStats: { strength: 7, stamina: 6, intelligence: 3, speedAgility: 7, luck: 4 }, element: '土', color: 'bg-red-400', shape: 'square', xpValue: 55, goldValue: 65, attackPrepareTime: 900, attackAnimationTime: 350 },
  'トロル': { name: 'トロル', baseStats: { strength: 14, stamina: 12, intelligence: 1, speedAgility: 3, luck: 1 }, element: '土', color: 'bg-lime-700', shape: 'square', xpValue: 65, goldValue: 80, attackPrepareTime: 1800, attackAnimationTime: 600 },
  'サンドワーム': { name: 'サンドワーム', baseStats: { strength: 12, stamina: 14, intelligence: 1, speedAgility: 5, luck: 2 }, element: '土', color: 'bg-amber-600', shape: 'circle', xpValue: 72, goldValue: 95, attackPrepareTime: 1600, attackAnimationTime: 550 },
  'ジャイアントアント': { name: 'ジャイアントアント', baseStats: { strength: 10, stamina: 9, intelligence: 2, speedAgility: 9, luck: 3 }, element: '土', color: 'bg-neutral-800', shape: 'circle', xpValue: 68, goldValue: 88, attackPrepareTime: 1000, attackAnimationTime: 400 },
  'マインフレイヤー': { name: 'マインフレイヤー', baseStats: { strength: 5, stamina: 8, intelligence: 15, speedAgility: 8, luck: 5 }, element: '闇', color: 'bg-purple-700', shape: 'square', xpValue: 85, goldValue: 120, attackPrepareTime: 1900, attackAnimationTime: 700 },
  'アースエレメンタル': { name: 'アースエレメンタル', baseStats: { strength: 10, stamina: 16, intelligence: 8, speedAgility: 2, luck: 3 }, element: '土', color: 'bg-amber-800', shape: 'circle', xpValue: 90, goldValue: 130, attackPrepareTime: 2100, attackAnimationTime: 750 },
  'ガーゴイル': { name: 'ガーゴイル', baseStats: { strength: 11, stamina: 13, intelligence: 1, speedAgility: 3, luck: 2 }, element: '土', color: 'bg-gray-700', shape: 'square', xpValue: 95, goldValue: 110, attackPrepareTime: 1600, attackAnimationTime: 500 },
  'ファイア・エレメンタル': { name: 'ファイア・エレメンタル', baseStats: { strength: 10, stamina: 8, intelligence: 10, speedAgility: 12, luck: 7 }, element: '火', color: 'bg-orange-500', shape: 'circle', xpValue: 104, goldValue: 120, attackPrepareTime: 1400, attackAnimationTime: 400 },
  'サラマンダー': { name: 'サラマンダー', baseStats: { strength: 12, stamina: 10, intelligence: 5, speedAgility: 14, luck: 6 }, element: '火', color: 'bg-orange-600', shape: 'square', xpValue: 100, goldValue: 115, attackPrepareTime: 900, attackAnimationTime: 300 },
  'イフリート': { name: 'イフリート', baseStats: { strength: 13, stamina: 12, intelligence: 16, speedAgility: 10, luck: 5 }, element: '火', color: 'bg-red-600', shape: 'circle', xpValue: 130, goldValue: 160, attackPrepareTime: 1700, attackAnimationTime: 600 },
  'ヘルハウンド': { name: 'ヘルハウンド', baseStats: { strength: 15, stamina: 9, intelligence: 4, speedAgility: 17, luck: 4 }, element: '火', color: 'bg-zinc-800', shape: 'square', xpValue: 115, goldValue: 140, attackPrepareTime: 700, attackAnimationTime: 250 },
  'ボム': { name: 'ボム', baseStats: { strength: 2, stamina: 5, intelligence: 1, speedAgility: 16, luck: 8 }, element: '火', color: 'bg-gray-400', shape: 'circle', xpValue: 98, goldValue: 105, attackPrepareTime: 2000, attackAnimationTime: 100 },
  'フレイムドラゴン': { name: 'フレイムドラゴン', baseStats: { strength: 17, stamina: 16, intelligence: 10, speedAgility: 10, luck: 6 }, element: '火', color: 'bg-orange-800', shape: 'circle', xpValue: 180, goldValue: 320, attackPrepareTime: 1900, attackAnimationTime: 600 },
  'マグマスライム': { name: 'マグマスライム', baseStats: { strength: 9, stamina: 11, intelligence: 4, speedAgility: 6, luck: 4 }, element: '火', color: 'bg-red-500', shape: 'circle', xpValue: 92, goldValue: 100, attackPrepareTime: 1300, attackAnimationTime: 450 },
  'パイロデーモン': { name: 'パイロデーモン', baseStats: { strength: 16, stamina: 14, intelligence: 14, speedAgility: 11, luck: 5 }, element: '火', color: 'bg-rose-800', shape: 'square', xpValue: 160, goldValue: 250, attackPrepareTime: 1600, attackAnimationTime: 500 },
  'ドラゴン': { name: 'ドラゴン', baseStats: { strength: 15, stamina: 15, intelligence: 8, speedAgility: 9, luck: 5 }, element: '闇', color: 'bg-red-900', shape: 'circle', xpValue: 173, goldValue: 300, attackPrepareTime: 1800, attackAnimationTime: 500 },
  'ウィザード': { name: 'ウィザード', baseStats: { strength: 2, stamina: 4, intelligence: 14, speedAgility: 7, luck: 4 }, element: '闇', color: 'bg-purple-600', shape: 'square', xpValue: 120, goldValue: 150, attackPrepareTime: 1800, attackAnimationTime: 600 },
  'ミノタウロス': { name: 'ミノタウロス', baseStats: { strength: 18, stamina: 12, intelligence: 2, speedAgility: 5, luck: 1 }, element: '土', color: 'bg-yellow-800', shape: 'square', xpValue: 150, goldValue: 200, attackPrepareTime: 2500, attackAnimationTime: 800 },
  'デュラハン': { name: 'デュラハン', baseStats: { strength: 19, stamina: 15, intelligence: 8, speedAgility: 13, luck: 3 }, element: '闇', color: 'bg-slate-700', shape: 'square', xpValue: 170, goldValue: 280, attackPrepareTime: 1400, attackAnimationTime: 400 },
  'アイアンゴーレム': { name: 'アイアンゴーレム', baseStats: { strength: 16, stamina: 20, intelligence: 1, speedAgility: 3, luck: 1 }, element: '土', color: 'bg-slate-500', shape: 'square', xpValue: 165, goldValue: 240, attackPrepareTime: 2200, attackAnimationTime: 700 },
  'オーガ': { name: 'オーガ', baseStats: { strength: 20, stamina: 18, intelligence: 2, speedAgility: 6, luck: 2 }, element: '土', color: 'bg-emerald-800', shape: 'square', xpValue: 155, goldValue: 220, attackPrepareTime: 1700, attackAnimationTime: 600 },
  'ダークナイト': { name: 'ダークナイト', baseStats: { strength: 18, stamina: 16, intelligence: 10, speedAgility: 12, luck: 4 }, element: '闇', color: 'bg-zinc-900', shape: 'square', xpValue: 190, goldValue: 350, attackPrepareTime: 1300, attackAnimationTime: 450 },
  'ワイバーン': { name: 'ワイバーン', baseStats: { strength: 16, stamina: 13, intelligence: 6, speedAgility: 16, luck: 7 }, element: '風', color: 'bg-green-800', shape: 'circle', xpValue: 185, goldValue: 310, attackPrepareTime: 1200, attackAnimationTime: 400 },
  'ハーピー': { name: 'ハーピー', baseStats: { strength: 6, stamina: 4, intelligence: 3, speedAgility: 18, luck: 6 }, element: '風', color: 'bg-brown-400', shape: 'circle', xpValue: 110, goldValue: 95, attackPrepareTime: 500, attackAnimationTime: 200 },
  'キマイラ': { name: 'キマイラ', baseStats: { strength: 16, stamina: 14, intelligence: 12, speedAgility: 11, luck: 6 }, element: '火', color: 'bg-orange-700', shape: 'circle', xpValue: 200, goldValue: 400, attackPrepareTime: 1700, attackAnimationTime: 600 },
  'アークデーモン': { name: 'アークデーモン', baseStats: { strength: 22, stamina: 20, intelligence: 18, speedAgility: 15, luck: 8 }, element: '闇', color: 'bg-red-800', shape: 'square', xpValue: 250, goldValue: 500, attackPrepareTime: 1500, attackAnimationTime: 500 },
  'セラフィム': { name: 'セラフィム', baseStats: { strength: 15, stamina: 18, intelligence: 24, speedAgility: 19, luck: 10 }, element: '光', color: 'bg-yellow-200', shape: 'circle', xpValue: 260, goldValue: 550, attackPrepareTime: 1600, attackAnimationTime: 600 },
  'マスターウィザード': { name: 'マスターウィザード', baseStats: { strength: 8, stamina: 15, intelligence: 26, speedAgility: 14, luck: 9 }, element: '闇', color: 'bg-blue-800', shape: 'square', xpValue: 240, goldValue: 480, attackPrepareTime: 2000, attackAnimationTime: 800 },
  'キングゴースト': { name: 'キングゴースト', baseStats: { strength: 10, stamina: 16, intelligence: 22, speedAgility: 20, luck: 7 }, element: '闇', color: 'bg-slate-300', shape: 'circle', xpValue: 230, goldValue: 450, attackPrepareTime: 1300, attackAnimationTime: 400 },
  'エンシェントドラゴン': { name: 'エンシェントドラゴン', baseStats: { strength: 25, stamina: 24, intelligence: 16, speedAgility: 12, luck: 8 }, element: '闇', color: 'bg-indigo-950', shape: 'circle', xpValue: 300, goldValue: 700, attackPrepareTime: 2000, attackAnimationTime: 700 },
  'ジェムスライム': { name: 'ジェムスライム', baseStats: { strength: 4, stamina: 2, intelligence: 1, speedAgility: 3, luck: 2 }, element: '光', color: 'bg-fuchsia-500', shape: 'circle', xpValue: 75, goldValue: 100, attackPrepareTime: 1200, attackAnimationTime: 400 },
};


export const AREAS: Area[] = [
    { name: '草原', bgColor: 'bg-sky-400', groundColor: 'bg-green-700', enemyTypes: ['スライム', 'ゴブリン', 'ホーネット', 'マッドパピー', 'ジャイアントワーム', 'ワイルドボア', 'マンドラゴラ', 'キラービー', 'ファンガス', 'ピクシー'] },
    { name: '暗い森', bgColor: 'bg-indigo-900', groundColor: 'bg-emerald-950', enemyTypes: ['ウルフ', 'バット', 'トレント', 'スケルトン', 'ゴースト', 'ダークエルフ', 'ウィスプ', 'グール', 'ジャイアントスパイダー', 'ウッドゴーレム'] },
    { name: '埃の洞窟', bgColor: 'bg-yellow-800', groundColor: 'bg-yellow-950', enemyTypes: ['オーク', 'ロック・スパイダー', 'ゴーレム', 'リザードマン', 'コボルト', 'トロル', 'サンドワーム', 'ジャイアントアント', 'マインフレイヤー', 'アースエレメンタル'] },
    { name: '火山', bgColor: 'bg-red-700', groundColor: 'bg-stone-800', enemyTypes: ['ファイア・エレメンタル', 'ドラゴン', 'ガーゴイル', 'サラマンダー', 'イフリート', 'ヘルハウンド', 'ボム', 'フレイムドラゴン', 'マグマスライム', 'パイロデーモン'] },
    { name: '城の門', bgColor: 'bg-gray-600', groundColor: 'bg-gray-800', enemyTypes: ['ゴーレム', 'オーク', 'ドラゴン', 'ミノタウロス', 'ウィザード', 'デュラハン', 'アイアンゴーレム', 'オーガ', 'ダークナイト', 'ワイバーン'] },
    { name: '玉座', bgColor: 'bg-purple-800', groundColor: 'bg-purple-950', enemyTypes: ['バット', 'ファイア・エレメンタル', 'ドラゴン', 'ハーピー', 'キマイラ', 'アークデーモン', 'セラフィム', 'マスターウィザード', 'キングゴースト', 'エンシェントドラゴン'] },
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