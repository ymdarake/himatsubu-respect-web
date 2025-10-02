# アーキテクチャドキュメント

## 概要

**サイドスクロールクエスト** は、React 19とTypeScriptで構築された横スクロール型RPGゲームです。プレイヤーは敵と戦い、レベルアップし、装備を集めながら進行します。

## 技術スタック

- **フロントエンド**: React 19, TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS v4
- **状態管理**: React Hooks (useState, useEffect, useMemo, useCallback)
- **オーディオ**: Web Audio API

## ディレクトリ構造

```
/
├── components/          # Reactコンポーネント
│   ├── Player.tsx           # プレイヤーキャラクター表示
│   ├── Enemy.tsx            # 敵キャラクター表示
│   ├── Shop.tsx             # ショップUI
│   ├── LevelUpModal.tsx     # レベルアップUI
│   └── ...                  # その他UIコンポーネント
├── hooks/              # カスタムフック
│   ├── useGameLogic.ts     # メインゲームロジック
│   └── usePlayer.ts        # プレイヤー状態管理
├── data/               # マスターデータ
│   ├── enemies.ts          # 敵データ定義
│   ├── weapons.ts          # 武器マスターデータ
│   ├── armor.ts            # 防具マスターデータ
│   ├── accessories.ts      # アクセサリーマスターデータ
│   └── areas.ts            # エリア定義
├── utils/              # ユーティリティ関数
│   ├── statCalculations.ts    # ステータス計算
│   ├── equipmentFactory.ts    # 装備生成・レベルアップ
│   ├── itemGenerator.ts       # アイテム生成
│   ├── worldGenerator.ts      # ワールド生成
│   └── audio.ts               # オーディオ管理
├── constants/          # 定数定義
│   ├── game.ts            # ゲーム定数
│   ├── combat.ts          # 戦闘関連定数
│   ├── player.ts          # プレイヤー初期値
│   └── ui.ts              # UI定数
├── types.ts            # 型定義
├── App.tsx             # メインアプリケーションコンポーネント
└── index.tsx           # エントリーポイント
```

## コアシステム

### 1. ステータスシステム

プレイヤーと敵は**基礎ステータス**（腕力、体力、知力、敏捷、幸運）と**派生ステータス**（HP、攻撃力、防御力など）を持ちます。

- 基礎ステータスはレベルアップ時に割り振り可能
- 派生ステータスは基礎ステータスと装備から自動計算
- 計算ロジック: `utils/statCalculations.ts`

詳細は [SPEC.md](SPEC.md#ステータスシステム) を参照してください。

### 2. 装備システム

装備は**マスターデータ**と**インスタンス**の2層構造で管理されます。

- **マスターデータ**: `data/` に定義された装備の基本情報
- **インスタンス**: プレイヤーが所持する装備（レベルと計算済みステータスを持つ）
- レア度: common, uncommon, rare, epic, legendary
- 属性: 火、水、風、土、光、闇、無

生成ロジック: `utils/equipmentFactory.ts`, `utils/itemGenerator.ts`

詳細は [SPEC.md](SPEC.md#装備システム) を参照してください。

### 3. 戦闘システム

60FPSのゲームループで戦闘を処理します。

#### 攻撃フロー
1. プレイヤーの攻撃判定と処理
2. 敵のAI処理と攻撃判定
3. ダメージ適用とHP更新
4. 撃破判定とドロップ処理

#### 主要な処理関数
- `processPlayerAttack()`: プレイヤーの攻撃処理
- `processEnemyAIAndAttacks()`: 敵のAIと攻撃処理
- `applyPlayerDamageAndCheckDeath()`: プレイヤーへのダメージ適用

ダメージ計算や属性相性の詳細は [SPEC.md](SPEC.md#戦闘システム) を参照してください。

### 4. ゲームループ

メインループは `hooks/useGameLogic.ts` の `updateGameLogic()` で実装されています。

```typescript
60FPS (16.67ms間隔) で実行:
1. プレイヤー状態の更新（移動、攻撃、被弾）
2. 敵の状態更新（AI、攻撃、HP管理）
3. 環境オブジェクトとの相互作用（ショップ、回復の家、転送陣）
4. ステージ遷移（画面端到達時）
5. レベルアップ処理
```

### 5. ワールド生成

ステージごとに敵とオブジェクトを動的に生成します。

- **ステージ**: 400m単位、インデックスに応じて難易度上昇
- **エリア**: 10ステージごとに切り替わり（草原、砂漠、雪原、火山、森林）
- **敵配置**: 2～5体/ステージ、特殊敵（ゴールドスライムなど）が低確率出現
- **オブジェクト**: ショップ（3ステージ間隔）、回復の家（3ステージ間隔）、転送陣（10ステージ間隔）

生成ロジック: `utils/worldGenerator.ts`

詳細は [SPEC.md](SPEC.md#ワールド構造) を参照してください。

### 6. セーブシステム

`localStorage` を使用してプレイヤーデータを保存します。

- **自動セーブ**: 10秒ごと
- **手動セーブ**: 「セーブしてタイトルへ戻る」ボタン
- **ウィンドウクローズ時**: 自動保存

保存内容: プレイヤーステータス、ステージインデックス、プレイ統計

詳細は [SPEC.md](SPEC.md#セーブシステム) を参照してください。

### 7. オーディオシステム

Web Audio APIを使用してBGMと効果音を再生します。

- エリアごとに異なるBGM
- 戦闘、レベルアップなどの効果音
- ミュート機能

実装: `utils/audio.ts`

## アーキテクチャパターン

### データフロー

```
App.tsx
  └─ useGameLogic()  [メインゲームロジック]
      ├─ usePlayer()  [プレイヤー状態管理]
      ├─ useState(enemies)  [敵配列]
      ├─ useState(structures)  [構造物配列]
      └─ updateGameLogic()  [60FPS ゲームループ]
          ├─ processPlayerAttack()
          ├─ processEnemyAIAndAttacks()
          ├─ handlePlayerLevelUp()
          └─ handlePlayerMovementAndStageChanges()
```

### コンポーネント階層

```
App
 ├─ ゲームビュー
 │   ├─ Player
 │   ├─ Enemy (複数)
 │   ├─ Shop / House / TeleporterStructure (複数)
 │   ├─ HealthBar
 │   └─ DamageText (複数)
 ├─ ステータスエリア
 │   ├─ PlayerStatsPanels (基礎・派生ステータス)
 │   ├─ EquipmentPanel
 │   ├─ EnemyStatusPanel
 │   └─ PlayStatsPanel
 ├─ ログエリア
 └─ モーダル (Shop / LevelUp / EquipmentChange / Teleporter)
```

### 状態管理

React Hooksを使用したシンプルな状態管理：

- **ローカル状態**: `useState` でコンポーネント固有の状態を管理
- **カスタムフック**: `useGameLogic`, `usePlayer` でロジックを分離
- **メモ化**: `useMemo`, `useCallback` で計算コストを削減

## パフォーマンス最適化

### メモ化戦略

```typescript
// 高コストな計算結果をキャッシュ
const calculatedStats = useMemo(() =>
  calculateDerivedStats(player), [player]
);

// イベントハンドラーの再生成を抑制
const handleBuyItem = useCallback((item) => {
  playerBuyItem(item, trackEquipment, addLog);
}, [playerBuyItem, trackEquipment, addLog]);
```

### レンダリング最適化

- 条件付きレンダリングで不要なコンポーネントを非表示
- 画面外のオブジェクトは描画しない（スクロール位置で判定）
- ダメージテキストは一定時間後に自動削除

### 状態更新の最適化

- 配列の更新は必要な場合のみ
- 攻撃処理で配列を正しく引き継ぎ（バグ修正済み）
- 死亡した敵は即座に配列から除去

## UI/UX設計

### レスポンシブ対応

- **デスクトップ**: キーボード操作（矢印キー、スペースキー）
- **モバイル**: タッチコントロール（方向ボタン、アクションボタン）
- Tailwind CSSのブレークポイント（`sm:`）で切り替え

### 画面構成

- **ゲームビュー**: 上部固定サイズ（h-64 sm:h-80）
- **ステータスエリア**: グリッドレイアウト（モバイル5列、デスクトップ4列）
- **ログエリア**: 下部スクロール可能

### アクセシビリティ

- ARIA属性でボタンの役割を明示
- キーボードナビゲーション対応
- 視覚的フィードバック（ダメージ表示、HP変動）

## デプロイ

### ビルド

```bash
npm run build
```

ビルド成果物は `dist/` ディレクトリに出力されます。

### プレビュー

```bash
npm run preview
```

## 拡張性

新機能を追加する際の指針：

1. **型定義**: `types.ts` に新しい型を追加
2. **定数**: `constants/` に関連定数を追加
3. **ロジック**: `hooks/` または `utils/` に処理を実装
4. **UI**: `components/` に新しいコンポーネントを追加
5. **データ**: `data/` にマスターデータを追加

具体例:
- 新しい敵: `data/enemies.ts` に追加
- 新しい装備: `data/weapons.ts`, `armor.ts`, `accessories.ts` に追加
- 新しいエリア: `data/areas.ts` に追加

詳細は [SPEC.md](SPEC.md#将来の拡張案) を参照してください。

## トラブルシューティング

### よくある問題

1. **画面が真っ黒/真っ白**
   - Tailwind CSSの設定を確認（`tailwind.config.js` のコンテンツパス）
   - `index.css` に `@import "tailwindcss";` があるか確認

2. **敵への攻撃が反映されない**
   - `processPlayerAttack` が正しく `newEnemies` を返しているか確認
   - `processEnemyAIAndAttacks` が更新済み配列を受け取っているか確認

3. **HPバーが表示されない**
   - `ENEMY_PANEL_DISPLAY_RANGE` の範囲内に敵がいるか確認
   - `displayedEnemyId` が正しく更新されているか確認

## 関連ドキュメント

- [SPEC.md](SPEC.md) - 詳細な仕様書（ステータス計算式、ダメージ計算、ゲーム定数など）
- [README.md](../README.md) - セットアップとビルド手順

## 参考リンク

- [React 19 ドキュメント](https://react.dev/)
- [Vite ドキュメント](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [TypeScript ドキュメント](https://www.typescriptlang.org/)
