import { Area } from '../types';

export const AREAS: Area[] = [
    { name: '草原', bgColor: 'bg-sky-400', groundColor: 'bg-green-700', enemyTypes: ['スライム', 'ゴブリン', 'ホーネット', 'マッドパピー', 'ジャイアントワーム', 'ワイルドボア', 'マンドラゴラ', 'キラービー', 'ファンガス', 'ピクシー'], bossName: 'ゴブリンキング' },
    { name: '暗い森', bgColor: 'bg-indigo-900', groundColor: 'bg-emerald-950', enemyTypes: ['ウルフ', 'バット', 'トレント', 'スケルトン', 'ゴースト', 'ダークエルフ', 'ウィスプ', 'グール', 'ジャイアントスパイダー', 'ウッドゴーレム'], bossName: 'フォレストタイラント' },
    { name: '埃の洞窟', bgColor: 'bg-yellow-800', groundColor: 'bg-yellow-950', enemyTypes: ['オーク', 'ロック・スパイダー', 'ゴーレム', 'リザードマン', 'コボルト', 'トロル', 'サンドワーム', 'ジャイアントアント', 'マインフレイヤー', 'アースエレメンタル'], bossName: 'ストーンコロッサス' },
    { name: '火山', bgColor: 'bg-red-700', groundColor: 'bg-stone-800', enemyTypes: ['ファイア・エレメンタル', 'ドラゴン', 'ガーゴイル', 'サラマンダー', 'イフリート', 'ヘルハウンド', 'ボム', 'フレイムドラゴン', 'マグマスライム', 'パイロデーモン'], bossName: 'ボルケーノロード' },
    { name: '城の門', bgColor: 'bg-gray-600', groundColor: 'bg-gray-800', enemyTypes: ['ゴーレム', 'オーク', 'ドラゴン', 'ミノタウロス', 'ウィザード', 'デュラハン', 'アイアンゴーレム', 'オーガ', 'ダークナイト', 'ワイバーン'], bossName: 'ナイトメアキング' },
    { name: '玉座', bgColor: 'bg-purple-800', groundColor: 'bg-purple-950', enemyTypes: ['バット', 'ファイア・エレメンタル', 'ドラゴン', 'ハーピー', 'キマイラ', 'アークデーモン', 'セラフィム', 'マスターウィザード', 'キングゴースト', 'エンシェントドラゴン'], bossName: 'カオスエンペラー' },
];

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
