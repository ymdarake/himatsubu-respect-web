import { EquipmentMaster } from '../types';

export const EQUIPMENT_MASTER_DATA: EquipmentMaster[] = [
  // --- WEAPONS (Tier 0-1) ---
  {
    masterId: 'wpn_short_sword',
    name: 'ショートソード',
    type: 'weapon',
    baseStats: { physicalAttack: 5 },
    basePrice: 50,
    statGrowth: { physicalAttack: 3 },
    priceGrowth: 25,
  },
  {
    masterId: 'wpn_fire_rod',
    name: 'ファイアロッド',
    type: 'weapon',
    baseStats: { magicalAttack: 4 },
    basePrice: 80,
    statGrowth: { magicalAttack: 2 },
    priceGrowth: 40,
    elementalDamages: { '火': 8 },
    elementalDamageGrowth: { '火': 4 },
  },
  // --- WEAPONS (Tier 2+) ---
  {
    masterId: 'wpn_long_sword',
    name: 'ロングソード',
    type: 'weapon',
    baseStats: { physicalAttack: 12 },
    basePrice: 250,
    statGrowth: { physicalAttack: 6 },
    priceGrowth: 80,
  },
  {
    masterId: 'wpn_ice_brand',
    name: 'アイスブランド',
    type: 'weapon',
    baseStats: { physicalAttack: 10, magicalAttack: 5 },
    basePrice: 320,
    statGrowth: { physicalAttack: 4, magicalAttack: 3 },
    priceGrowth: 100,
    elementalDamages: { '水': 15 },
    elementalDamageGrowth: { '水': 6 },
  },

  // --- ARMOR (Tier 0-1) ---
  {
    masterId: 'arm_leather_vest',
    name: 'レザーベスト',
    type: 'armor',
    baseStats: { physicalDefense: 4, maxHp: 10 },
    basePrice: 60,
    statGrowth: { physicalDefense: 2, maxHp: 5 },
    priceGrowth: 30,
  },
  {
    masterId: 'arm_iron_plate',
    name: 'アイアンプレート',
    type: 'armor',
    baseStats: { physicalDefense: 8, maxHp: 20 },
    basePrice: 150,
    statGrowth: { physicalDefense: 4, maxHp: 10 },
    priceGrowth: 60,
  },
  // --- ARMOR (Tier 2+) ---
  {
    masterId: 'arm_steel_armor',
    name: 'スチールアーマー',
    type: 'armor',
    baseStats: { physicalDefense: 15, maxHp: 40 },
    basePrice: 400,
    statGrowth: { physicalDefense: 7, maxHp: 18 },
    priceGrowth: 120,
  },
  
  // --- ACCESSORIES (Tier 0-1) ---
  {
    masterId: 'acc_speed_ring',
    name: 'スピードリング',
    type: 'accessory',
    baseStats: { speed: 3, luckValue: 1 },
    basePrice: 100,
    statGrowth: { speed: 2, luckValue: 1 },
    priceGrowth: 50,
  },
  // --- ACCESSORIES (Tier 2+) ---
  {
    masterId: 'acc_power_glove',
    name: 'パワーグローブ',
    type: 'accessory',
    // FIX: Converted base stats (strength, stamina) to derived stats to match EquipmentMaster type.
    // Original: { strength: 2, stamina: 1 }
    // Conversion based on formulas: 1 strength -> 2 physicalAttack, 1 stamina -> 10 maxHp.
    baseStats: { physicalAttack: 4, maxHp: 10 },
    basePrice: 200,
    // FIX: Converted base stat growth to derived stat growth.
    // Original: { strength: 2 }
    statGrowth: { physicalAttack: 4 },
    priceGrowth: 90,
  },
];