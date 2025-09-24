import { Element } from '../types';

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
