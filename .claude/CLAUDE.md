# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**サイドスクロールクエスト** - Reactベースのサイドスクロール型RPG

- **技術スタック**: React 19, TypeScript, Vite, Tailwind CSS
- **ゲームジャンル**: 横スクロール型のRPG（プレイヤーが敵と戦い、レベルアップし、装備を集めながら進む）

## 開発コマンド

```bash
# 開発サーバー起動（ポート3000）
npm run dev

# 本番ビルド
npm run build

# プレビュー
npm run preview
```

## アーキテクチャ

### ディレクトリ構成

```
/
├── components/       # Reactコンポーネント（Player, Enemy, Shop等）
├── hooks/           # カスタムフック
│   ├── useGameLogic.ts  # メインゲームロジック（ゲーム状態管理、敵生成、戦闘処理等）
│   └── usePlayer.ts     # プレイヤー状態管理
├── data/            # マスターデータ
│   ├── enemies.ts       # 敵データ定義
│   ├── equipmentMaster.ts, weapons.ts, armor.ts, accessories.ts  # 装備データ
│   └── areas.ts         # エリア定義
├── utils/           # ユーティリティ関数
│   ├── statCalculations.ts  # ステータス計算（プレイヤー/敵の派生ステータス）
│   ├── equipmentFactory.ts  # 装備生成・レベルアップ処理
│   └── worldGenerator.ts    # ワールド生成ロジック
├── constants/       # 定数定義
└── types.ts         # 型定義
```

### コアシステム

**ステータス体系**（types.ts:14-35）
- **基礎ステータス（BaseStats）**: strength（腕力）、stamina（体力）、intelligence（知力）、speedAgility（敏捷）、luck（幸運）
- **派生ステータス（DerivedStat）**: maxHp、physicalAttack、physicalDefense、magicalAttack、magicalDefense、speed、luckValue
- 派生ステータスは `statCalculations.ts` の `calculateDerivedStats()` で基礎ステータスと装備から計算される

**装備システム**
- **マスターデータベース**: 各装備は `EquipmentMaster` で定義（masterId、baseStats、statGrowth等）
- **インスタンス**: プレイヤーが所持する装備は `Equipment` 型（instanceId、level、計算済みステータス等）
- **生成・強化**: `equipmentFactory.ts` で装備のレベルアップや新規生成を処理

**ゲームループ**（hooks/useGameLogic.ts）
- `useGameLogic` フックがゲーム全体の状態を管理
- プレイヤー移動、敵生成、戦闘処理、ショップ/家との相互作用、テレポート処理等
- GameStateで状態遷移を管理（START、PLAYING、SHOPPING、LEVEL_UP等）

**属性システム**
- 属性（Element）: '火'、'水'、'風'、'土'、'光'、'闇'、'無'
- 装備は `elementalDamages` で属性ダメージを持つ場合がある

## 重要な開発ルール

### ステータス計算の変更時
- `statCalculations.ts` の計算式を変更する場合は、プレイヤーと敵の両方のバランスに影響するため注意
- 新しい装備やステータスを追加する場合は、既存の `EquipmentMaster` と `BaseStats` の構造に従う

### データ追加
- **新しい敵**: `data/enemies.ts` に追加し、`ENEMY_DATA` レコードに登録
- **新しい装備**: 各カテゴリのマスターデータファイル（weapons.ts、armor.ts、accessories.ts）に追加
- **新しいエリア**: `data/areas.ts` に追加

### セーブデータ
- localStorage を使用（キー: `SAVE_KEY`, `MUTE_KEY`）
- セーブデータ構造の変更時は後方互換性を考慮

### UI/UX
- モバイル対応：タッチコントロール（TouchControls）とデスクトップキーボード操作の両方に対応
- Tailwind CSSでスタイリング（レスポンシブ対応）
