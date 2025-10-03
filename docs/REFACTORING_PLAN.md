# サイドスクロールクエスト リファクタリングTODOリスト

今後の拡張性、メンテナンス性、パフォーマンスを向上させるためのリファクタリングタスクリストです。

---

- [ ] **1. 巨大なロジックフック `useGameLogic` の分割**
  - **内容**: `useGameLogic.ts` を `usePlayerState`, `useEnemyManager`, `useWorldManager` など、責務に応じた小さなフックに分割する。
  - **目的**: 関心の分離、テスト容易性の向上。
  - **サブタスク:**
    - [x] 1a. プレイヤーの `state` と初期化・リセットロジックを `usePlayer` フックに分離する。
    - [x] 1b. プレイヤーの更新ロジック（装備、回復、ステータス割り振りなど）を `usePlayer` フックに移動する。
    - [x] 1c. 敵の状態管理（生成、AI、戦闘ロジック）を `useEnemyManager` フックに分離する。
      - [x] 敵のstate（enemies, engagedEnemyId, displayedEnemyId, enemyHits）を `useEnemyManager` に移動
      - [x] 敵関連のrefとcomputed values（activeEnemies, engagedEnemy, displayedEnemy）を移動
      - [ ] 敵の生成・AI・戦闘ロジック（processPlayerAttack, processEnemyAIAndAttacks）を `useEnemyManager` に移動（今後のタスク）
    - [ ] 1d. ワールド（ステージ、背景、建造物）の管理を `useWorldManager` フックに分離する。

- [x] **2. `Enemy.tsx` のスプライト描画ロジックの分離**
  - **内容**: 敵のSVGスプライトを `Enemy.tsx` から `components/enemySprites.tsx` に分離し、データ駆動で描画する。
  - **目的**: コンポーネントの責務分割、スケーラビリティ向上。

- [x] **3. ゲームループの `requestAnimationFrame` への移行**
  - **内容**: ゲームループを `setInterval` から `requestAnimationFrame` に置き換える。
  - **目的**: パフォーマンス向上、スムーズなアニメーション、リソース消費の削減。

- [x] **4. `App.tsx` のUIロジックのコンポーネント化とDRY化**
  - **内容**: `App.tsx` 内で重複しているモバイル/デスクトップのUI（ステータスパネルなど）を共通コンポーネントに切り出す。
  - **目的**: コードの削減（DRY原則）、メンテナンス性の向上。

- [x] **5. `gameLoop` 関数のロジック分割**
  - **内容**: `gameLoop` 内の処理を `handlePlayerMovement`, `updateEnemyAI`, `processCombat` のような小さな関数に分割する。
  - **目的**: 可読性とデバッグの容易さ向上。