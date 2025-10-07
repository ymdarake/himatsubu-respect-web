import { Element, AllocatableStat } from '../types';

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
