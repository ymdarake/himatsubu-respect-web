import { BaseStats, Element } from '../types';

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
  'スライム': { name: 'スライム', baseStats: { strength: 4, stamina: 2, intelligence: 1, speedAgility: 3, luck: 2 }, element: '水', color: 'bg-green-500', shape: 'circle', xpValue: 18, goldValue: 2, attackPrepareTime: 1200, attackAnimationTime: 400 },
  'ゴブリン': { name: 'ゴブリン', baseStats: { strength: 6, stamina: 4, intelligence: 2, speedAgility: 5, luck: 3 }, element: '土', color: 'bg-green-700', shape: 'square', xpValue: 26, goldValue: 2, attackPrepareTime: 1000, attackAnimationTime: 300 },
  'ホーネット': { name: 'ホーネット', baseStats: { strength: 4, stamina: 2, intelligence: 1, speedAgility: 12, luck: 3 }, element: '風', color: 'bg-yellow-400', shape: 'circle', xpValue: 20, goldValue: 2, attackPrepareTime: 600, attackAnimationTime: 200 },
  'マッドパピー': { name: 'マッドパピー', baseStats: { strength: 5, stamina: 4, intelligence: 1, speedAgility: 6, luck: 2 }, element: '土', color: 'bg-yellow-700', shape: 'square', xpValue: 22, goldValue: 2, attackPrepareTime: 900, attackAnimationTime: 300 },
  'ジャイアントワーム': { name: 'ジャイアントワーム', baseStats: { strength: 6, stamina: 8, intelligence: 1, speedAgility: 2, luck: 1 }, element: '土', color: 'bg-yellow-800', shape: 'circle', xpValue: 25, goldValue: 2, attackPrepareTime: 1500, attackAnimationTime: 500 },
  'ワイルドボア': { name: 'ワイルドボア', baseStats: { strength: 8, stamina: 5, intelligence: 1, speedAgility: 5, luck: 2 }, element: '土', color: 'bg-stone-600', shape: 'square', xpValue: 28, goldValue: 2, attackPrepareTime: 1100, attackAnimationTime: 400 },
  'マンドラゴラ': { name: 'マンドラゴラ', baseStats: { strength: 2, stamina: 4, intelligence: 7, speedAgility: 3, luck: 4 }, element: '土', color: 'bg-green-600', shape: 'circle', xpValue: 24, goldValue: 2, attackPrepareTime: 1300, attackAnimationTime: 600 },
  'キラービー': { name: 'キラービー', baseStats: { strength: 5, stamina: 3, intelligence: 1, speedAgility: 16, luck: 4 }, element: '風', color: 'bg-amber-500', shape: 'circle', xpValue: 29, goldValue: 3, attackPrepareTime: 500, attackAnimationTime: 200 },
  'ファンガス': { name: 'ファンガス', baseStats: { strength: 4, stamina: 7, intelligence: 3, speedAgility: 2, luck: 3 }, element: '土', color: 'bg-purple-400', shape: 'circle', xpValue: 26, goldValue: 2, attackPrepareTime: 1400, attackAnimationTime: 500 },
  'ピクシー': { name: 'ピクシー', baseStats: { strength: 1, stamina: 2, intelligence: 6, speedAgility: 14, luck: 6 }, element: '風', color: 'bg-pink-300', shape: 'circle', xpValue: 27, goldValue: 2, attackPrepareTime: 800, attackAnimationTime: 300 },
  'ウルフ': { name: 'ウルフ', baseStats: { strength: 7, stamina: 5, intelligence: 1, speedAgility: 10, luck: 4 }, element: '風', color: 'bg-gray-500', shape: 'square', xpValue: 35, goldValue: 3, attackPrepareTime: 700, attackAnimationTime: 300 },
  'バット': { name: 'バット', baseStats: { strength: 5, stamina: 3, intelligence: 1, speedAgility: 15, luck: 5 }, element: '闇', color: 'bg-gray-600', shape: 'circle', xpValue: 32, goldValue: 3, attackPrepareTime: 600, attackAnimationTime: 250 },
  'スケルトン': { name: 'スケルトン', baseStats: { strength: 8, stamina: 5, intelligence: 1, speedAgility: 6, luck: 2 }, element: '闇', color: 'bg-gray-300', shape: 'square', xpValue: 40, goldValue: 3, attackPrepareTime: 900, attackAnimationTime: 400 },
  'トレント': { name: 'トレント', baseStats: { strength: 10, stamina: 6, intelligence: 2, speedAgility: 1, luck: 3 }, element: '土', color: 'bg-yellow-900', shape: 'square', xpValue: 44, goldValue: 3, attackPrepareTime: 2200, attackAnimationTime: 700 },
  'ゴースト': { name: 'ゴースト', baseStats: { strength: 2, stamina: 3, intelligence: 9, speedAgility: 11, luck: 5 }, element: '闇', color: 'bg-gray-200', shape: 'circle', xpValue: 38, goldValue: 3, attackPrepareTime: 1000, attackAnimationTime: 400 },
  'ダークエルフ': { name: 'ダークエルフ', baseStats: { strength: 6, stamina: 5, intelligence: 6, speedAgility: 13, luck: 4 }, element: '闇', color: 'bg-indigo-400', shape: 'square', xpValue: 42, goldValue: 3, attackPrepareTime: 800, attackAnimationTime: 300 },
  'ウィスプ': { name: 'ウィスプ', baseStats: { strength: 1, stamina: 2, intelligence: 10, speedAgility: 15, luck: 7 }, element: '光', color: 'bg-cyan-300', shape: 'circle', xpValue: 40, goldValue: 3, attackPrepareTime: 1200, attackAnimationTime: 500 },
  'グール': { name: 'グール', baseStats: { strength: 9, stamina: 7, intelligence: 1, speedAgility: 4, luck: 1 }, element: '闇', color: 'bg-stone-500', shape: 'square', xpValue: 45, goldValue: 3, attackPrepareTime: 1300, attackAnimationTime: 500 },
  'ジャイアントスパイダー': { name: 'ジャイアントスパイダー', baseStats: { strength: 8, stamina: 6, intelligence: 1, speedAgility: 10, luck: 5 }, element: '土', color: 'bg-gray-800', shape: 'circle', xpValue: 48, goldValue: 3, attackPrepareTime: 800, attackAnimationTime: 300 },
  'ウッドゴーレム': { name: 'ウッドゴーレム', baseStats: { strength: 11, stamina: 10, intelligence: 1, speedAgility: 1, luck: 2 }, element: '土', color: 'bg-yellow-950', shape: 'square', xpValue: 50, goldValue: 3, attackPrepareTime: 2500, attackAnimationTime: 800 },
  'オーク': { name: 'オーク', baseStats: { strength: 12, stamina: 8, intelligence: 2, speedAgility: 4, luck: 2 }, element: '火', color: 'bg-red-700', shape: 'square', xpValue: 53, goldValue: 3, attackPrepareTime: 1500, attackAnimationTime: 500 },
  'リザードマン': { name: 'リザードマン', baseStats: { strength: 9, stamina: 7, intelligence: 4, speedAgility: 8, luck: 3 }, element: '水', color: 'bg-teal-600', shape: 'square', xpValue: 80, goldValue: 3, attackPrepareTime: 1100, attackAnimationTime: 450 },
  'ロック・スパイダー': { name: 'ロック・スパイダー', baseStats: { strength: 9, stamina: 6, intelligence: 1, speedAgility: 9, luck: 6 }, element: '土', color: 'bg-stone-600', shape: 'circle', xpValue: 60, goldValue: 3, attackPrepareTime: 900, attackAnimationTime: 350 },
  'ゴーレム': { name: 'ゴーレム', baseStats: { strength: 8, stamina: 15, intelligence: 1, speedAgility: 2, luck: 1 }, element: '土', color: 'bg-stone-500', shape: 'square', xpValue: 69, goldValue: 3, attackPrepareTime: 2000, attackAnimationTime: 600 },
  'コボルト': { name: 'コボルト', baseStats: { strength: 7, stamina: 6, intelligence: 3, speedAgility: 7, luck: 4 }, element: '土', color: 'bg-red-400', shape: 'square', xpValue: 55, goldValue: 3, attackPrepareTime: 900, attackAnimationTime: 350 },
  'トロル': { name: 'トロル', baseStats: { strength: 14, stamina: 12, intelligence: 1, speedAgility: 3, luck: 1 }, element: '土', color: 'bg-lime-700', shape: 'square', xpValue: 65, goldValue: 3, attackPrepareTime: 1800, attackAnimationTime: 600 },
  'サンドワーム': { name: 'サンドワーム', baseStats: { strength: 12, stamina: 14, intelligence: 1, speedAgility: 5, luck: 2 }, element: '土', color: 'bg-amber-600', shape: 'circle', xpValue: 72, goldValue: 4, attackPrepareTime: 1600, attackAnimationTime: 550 },
  'ジャイアントアント': { name: 'ジャイアントアント', baseStats: { strength: 10, stamina: 9, intelligence: 2, speedAgility: 9, luck: 3 }, element: '土', color: 'bg-neutral-800', shape: 'circle', xpValue: 68, goldValue: 3, attackPrepareTime: 1000, attackAnimationTime: 400 },
  'マインフレイヤー': { name: 'マインフレイヤー', baseStats: { strength: 5, stamina: 8, intelligence: 15, speedAgility: 8, luck: 5 }, element: '闇', color: 'bg-purple-700', shape: 'square', xpValue: 85, goldValue: 4, attackPrepareTime: 1900, attackAnimationTime: 700 },
  'アースエレメンタル': { name: 'アースエレメンタル', baseStats: { strength: 10, stamina: 16, intelligence: 8, speedAgility: 2, luck: 3 }, element: '土', color: 'bg-amber-800', shape: 'circle', xpValue: 90, goldValue: 4, attackPrepareTime: 2100, attackAnimationTime: 750 },
  'ガーゴイル': { name: 'ガーゴイル', baseStats: { strength: 11, stamina: 13, intelligence: 1, speedAgility: 3, luck: 2 }, element: '土', color: 'bg-gray-700', shape: 'square', xpValue: 95, goldValue: 4, attackPrepareTime: 1600, attackAnimationTime: 500 },
  'ファイア・エレメンタル': { name: 'ファイア・エレメンタル', baseStats: { strength: 10, stamina: 8, intelligence: 10, speedAgility: 12, luck: 7 }, element: '火', color: 'bg-orange-500', shape: 'circle', xpValue: 104, goldValue: 4, attackPrepareTime: 1400, attackAnimationTime: 400 },
  'サラマンダー': { name: 'サラマンダー', baseStats: { strength: 12, stamina: 10, intelligence: 5, speedAgility: 14, luck: 6 }, element: '火', color: 'bg-orange-600', shape: 'square', xpValue: 100, goldValue: 4, attackPrepareTime: 900, attackAnimationTime: 300 },
  'イフリート': { name: 'イフリート', baseStats: { strength: 13, stamina: 12, intelligence: 16, speedAgility: 10, luck: 5 }, element: '火', color: 'bg-red-600', shape: 'circle', xpValue: 130, goldValue: 4, attackPrepareTime: 1700, attackAnimationTime: 600 },
  'ヘルハウンド': { name: 'ヘルハウンド', baseStats: { strength: 15, stamina: 9, intelligence: 4, speedAgility: 17, luck: 4 }, element: '火', color: 'bg-zinc-800', shape: 'square', xpValue: 115, goldValue: 4, attackPrepareTime: 700, attackAnimationTime: 250 },
  'ボム': { name: 'ボム', baseStats: { strength: 2, stamina: 5, intelligence: 1, speedAgility: 16, luck: 8 }, element: '火', color: 'bg-gray-400', shape: 'circle', xpValue: 98, goldValue: 4, attackPrepareTime: 2000, attackAnimationTime: 100 },
  'フレイムドラゴン': { name: 'フレイムドラゴン', baseStats: { strength: 17, stamina: 16, intelligence: 10, speedAgility: 10, luck: 6 }, element: '火', color: 'bg-orange-800', shape: 'circle', xpValue: 180, goldValue: 4, attackPrepareTime: 1900, attackAnimationTime: 600 },
  'マグマスライム': { name: 'マグマスライム', baseStats: { strength: 9, stamina: 11, intelligence: 4, speedAgility: 6, luck: 4 }, element: '火', color: 'bg-red-500', shape: 'circle', xpValue: 92, goldValue: 4, attackPrepareTime: 1300, attackAnimationTime: 450 },
  'パイロデーモン': { name: 'パイロデーモン', baseStats: { strength: 16, stamina: 14, intelligence: 14, speedAgility: 11, luck: 5 }, element: '火', color: 'bg-rose-800', shape: 'square', xpValue: 160, goldValue: 4, attackPrepareTime: 1600, attackAnimationTime: 500 },
  'ドラゴン': { name: 'ドラゴン', baseStats: { strength: 15, stamina: 15, intelligence: 8, speedAgility: 9, luck: 5 }, element: '闇', color: 'bg-red-900', shape: 'circle', xpValue: 173, goldValue: 4, attackPrepareTime: 1800, attackAnimationTime: 500 },
  'ウィザード': { name: 'ウィザード', baseStats: { strength: 2, stamina: 4, intelligence: 14, speedAgility: 7, luck: 4 }, element: '闇', color: 'bg-purple-600', shape: 'square', xpValue: 120, goldValue: 4, attackPrepareTime: 1800, attackAnimationTime: 600 },
  'ミノタウロス': { name: 'ミノタウロス', baseStats: { strength: 18, stamina: 12, intelligence: 2, speedAgility: 5, luck: 1 }, element: '土', color: 'bg-yellow-800', shape: 'square', xpValue: 150, goldValue: 4, attackPrepareTime: 2500, attackAnimationTime: 800 },
  'デュラハン': { name: 'デュラハン', baseStats: { strength: 19, stamina: 15, intelligence: 8, speedAgility: 13, luck: 3 }, element: '闇', color: 'bg-slate-700', shape: 'square', xpValue: 170, goldValue: 4, attackPrepareTime: 1400, attackAnimationTime: 400 },
  'アイアンゴーレム': { name: 'アイアンゴーレム', baseStats: { strength: 16, stamina: 20, intelligence: 1, speedAgility: 3, luck: 1 }, element: '土', color: 'bg-slate-500', shape: 'square', xpValue: 165, goldValue: 4, attackPrepareTime: 2200, attackAnimationTime: 700 },
  'オーガ': { name: 'オーガ', baseStats: { strength: 20, stamina: 18, intelligence: 2, speedAgility: 6, luck: 2 }, element: '土', color: 'bg-emerald-800', shape: 'square', xpValue: 155, goldValue: 4, attackPrepareTime: 1700, attackAnimationTime: 600 },
  'ダークナイト': { name: 'ダークナイト', baseStats: { strength: 18, stamina: 16, intelligence: 10, speedAgility: 12, luck: 4 }, element: '闇', color: 'bg-zinc-900', shape: 'square', xpValue: 190, goldValue: 4, attackPrepareTime: 1300, attackAnimationTime: 450 },
  'ワイバーン': { name: 'ワイバーン', baseStats: { strength: 16, stamina: 13, intelligence: 6, speedAgility: 16, luck: 7 }, element: '風', color: 'bg-green-800', shape: 'circle', xpValue: 185, goldValue: 4, attackPrepareTime: 1200, attackAnimationTime: 400 },
  'ハーピー': { name: 'ハーピー', baseStats: { strength: 6, stamina: 4, intelligence: 3, speedAgility: 18, luck: 6 }, element: '風', color: 'bg-brown-400', shape: 'circle', xpValue: 110, goldValue: 4, attackPrepareTime: 500, attackAnimationTime: 200 },
  'キマイラ': { name: 'キマイラ', baseStats: { strength: 16, stamina: 14, intelligence: 12, speedAgility: 11, luck: 6 }, element: '火', color: 'bg-orange-700', shape: 'circle', xpValue: 200, goldValue: 5, attackPrepareTime: 1700, attackAnimationTime: 600 },
  'アークデーモン': { name: 'アークデーモン', baseStats: { strength: 22, stamina: 20, intelligence: 18, speedAgility: 15, luck: 8 }, element: '闇', color: 'bg-red-800', shape: 'square', xpValue: 250, goldValue: 5, attackPrepareTime: 1500, attackAnimationTime: 500 },
  'セラフィム': { name: 'セラフィム', baseStats: { strength: 15, stamina: 18, intelligence: 24, speedAgility: 19, luck: 10 }, element: '光', color: 'bg-yellow-200', shape: 'circle', xpValue: 260, goldValue: 5, attackPrepareTime: 1600, attackAnimationTime: 600 },
  'マスターウィザード': { name: 'マスターウィザード', baseStats: { strength: 8, stamina: 15, intelligence: 26, speedAgility: 14, luck: 9 }, element: '闇', color: 'bg-blue-800', shape: 'square', xpValue: 240, goldValue: 5, attackPrepareTime: 2000, attackAnimationTime: 800 },
  'キングゴースト': { name: 'キングゴースト', baseStats: { strength: 10, stamina: 16, intelligence: 22, speedAgility: 20, luck: 7 }, element: '闇', color: 'bg-slate-300', shape: 'circle', xpValue: 230, goldValue: 5, attackPrepareTime: 1300, attackAnimationTime: 400 },
  'エンシェントドラゴン': { name: 'エンシェントドラゴン', baseStats: { strength: 25, stamina: 24, intelligence: 16, speedAgility: 12, luck: 8 }, element: '闇', color: 'bg-indigo-950', shape: 'circle', xpValue: 300, goldValue: 5, attackPrepareTime: 2000, attackAnimationTime: 700 },
  'ジェムスライム': { name: 'ジェムスライム', baseStats: { strength: 4, stamina: 2, intelligence: 1, speedAgility: 3, luck: 2 }, element: '光', color: 'bg-fuchsia-500', shape: 'circle', xpValue: 75, goldValue: 4, attackPrepareTime: 1200, attackAnimationTime: 400 },
  'ゴールドスライム': { name: 'ゴールドスライム', baseStats: { strength: 2, stamina: 10, intelligence: 1, speedAgility: 15, luck: 20 }, element: '光', color: 'bg-amber-400', shape: 'circle', xpValue: 10, goldValue: 100, attackPrepareTime: 2000, attackAnimationTime: 400 },
  'ヒーリングスライム': { name: 'ヒーリングスライム', baseStats: { strength: 1, stamina: 10, intelligence: 10, speedAgility: 8, luck: 10 }, element: '光', color: 'bg-pink-400', shape: 'circle', xpValue: 20, goldValue: 5, attackPrepareTime: 99999, attackAnimationTime: 400 },
};