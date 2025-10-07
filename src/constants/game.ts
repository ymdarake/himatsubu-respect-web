import { ShopType } from '../types';

export const GAME_SPEED = 10;
export const ATTACK_RANGE = 25; // in pixels
export const STAGE_LENGTH = 10; // in meters
export const PIXELS_PER_METER = 100;
export const HEALING_HOUSE_RANGE = 40;
export const SHOP_RANGE = 80;
export const TELEPORTER_RANGE = 60;
export const ENEMY_PANEL_DISPLAY_RANGE = 200; // pixels
export const STAT_POINTS_PER_LEVEL = 5;

// Item and enemy spawn rates
export const BASE_DROP_CHANCE = 0.02; // 2% base chance
export const LUCK_TO_DROP_CHANCE_MULTIPLIER = 0.001; // 0.1% increased chance per luck point
export const GEM_SLIME_SPAWN_CHANCE = 0.05; // 5% chance for a Gem Slime to spawn

export const XP_FOR_NEXT_LEVEL_MULTIPLIER = 1.1;

export const SHOP_TYPES: ShopType[] = ['weapon_shop', 'armor_shop', 'accessory_shop'];
