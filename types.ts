export enum GameState {
  START,
  PLAYING,
  PLAYER_DEAD,
  SHOPPING,
  LEVEL_UP,
  EQUIPMENT_CHANGE,
}

export type EquipmentType = 'weapon' | 'armor' | 'accessory';
export type Element = '火' | '水' | '風' | '土' | '光' | '闇' | '無';

// --- New Stat System ---
export interface BaseStats {
  strength: number;     // 腕力
  stamina: number;      // 体力
  intelligence: number; // 知力
  speedAgility: number; // 敏捷
  luck: number;         // 幸運
}

export type AllocatableStat = keyof BaseStats;
export type DerivedStat = 'maxHp' | 'physicalAttack' | 'physicalDefense' | 'magicalAttack' | 'magicalDefense' | 'speed' | 'luckValue';

export const DERIVED_STAT_NAMES: Record<DerivedStat, string> = {
    maxHp: 'HP',
    physicalAttack: '物攻',
    physicalDefense: '物防',
    magicalAttack: '魔攻',
    magicalDefense: '魔防',
    speed: '素早さ',
    luckValue: '運気',
};
// --- End New Stat System ---


export interface Gem {
  name: string;
  stat: AllocatableStat; // Gems now boost base stats
  value: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  stats: Partial<Record<DerivedStat, number>>;
  price: number;
  elementalDamages?: Partial<Record<Element, number>>;
}

export interface Player {
  name: string;
  currentHp: number;
  baseStats: BaseStats;
  x: number; // World position
  isWalking: boolean;
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  statPoints: number;
  equipment: {
    weapon: Equipment | null;
    armor: Equipment | null;
    accessory: Equipment | null;
  };
  inventory: Equipment[];
}

export interface Enemy {
  id: number;
  name: string;
  level: number;
  baseStats: BaseStats;
  maxHp: number;
  currentHp: number;

  physicalAttack: number;
  physicalDefense: number;
  magicalAttack: number;
  magicalDefense: number;
  speed: number;
  luckValue: number;
  element: Element;
  
  color: string;
  shape: 'square' | 'circle';
  x: number; // World position
  xpValue: number;
  goldValue: number;
  attackPrepareTime: number;
  attackAnimationTime: number;
  attackState: 'idle' | 'preparing' | 'attacking';
  attackStateTimer: number;
}

export interface Area {
    name: string;
    bgColor: string;
    groundColor: string;
    enemyTypes: string[];
}

export type ShopType = 'weapon_shop' | 'armor_shop' | 'accessory_shop';

export interface Structure {
  id: number;
  type: 'house' | ShopType;
  x: number; // World position
}

export interface SceneryObject {
    id: number;
    type: string;
    x: number;
    variant: {
        [key: string]: any;
        scale: number;
    };
}

export interface PlayStats {
  startTime: number;
  playTime: number; // in seconds
  enemiesDefeated: number;
  farthestDistance: number;
  totalDistanceTraveled: number;
  totalXpGained: number;
  collectedEquipment: Set<string>;
  gemCollection: Record<AllocatableStat, number>;
}

export interface DamageInfo {
  text: string;
  color: string;
}

export interface DamageInstance {
  id: number;
  x: number;
  damages: DamageInfo[];
}