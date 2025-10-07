# 戦闘システムリファクタリング工程表

## 概要

`useGameLogic`内の戦闘ロジック（`processPlayerAttack`、`processEnemyAIAndAttacks`）を小さな単位で分離・整理する。

## 設計方針

- **責務の分離**: 戦闘ロジックを`useCombatSystem`フックに分離
- **useEnemyManager**: 純粋な敵の状態管理に専念（すでに完了）
- **usePlayer**: プレイヤーの状態管理に専念（すでに完了）
- **useCombatSystem**: 戦闘の計算・判定・報酬処理を担当（新規作成）

---

## Phase 1: 戦闘計算ロジックの抽出（ユーティリティ化）

### 1-1. ダメージ計算ロジックを関数化
- [ ] `utils/combatCalculations.ts`を新規作成
- [ ] プレイヤーの物理ダメージ計算を関数化: `calculatePlayerPhysicalDamage()`
- [ ] プレイヤーの魔法ダメージ計算を関数化: `calculatePlayerMagicalDamage()`
- [ ] プレイヤーのクリティカル判定を関数化: `calculateCriticalHit()`
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

**依存関係**:
- 入力: プレイヤーステータス、敵ステータス、装備の属性ダメージ
- 出力: ダメージ値、クリティカルフラグ

### 1-2. 敵の攻撃計算ロジックを関数化
- [ ] 敵の物理ダメージ計算を関数化: `calculateEnemyPhysicalDamage()`
- [ ] 敵の魔法ダメージ計算を関数化: `calculateEnemyMagicalDamage()`
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

**依存関係**:
- 入力: 敵ステータス、プレイヤーステータス
- 出力: ダメージ値

### 1-3. 攻撃速度・クールダウン計算を関数化
- [ ] 攻撃速度レベル判定を関数化: `getAttackSpeedLevel()`
- [ ] プレイヤーの攻撃クールダウン計算を関数化: `calculatePlayerAttackCooldown()`
- [ ] 敵の攻撃クールダウン計算を関数化: `calculateEnemyAttackCooldown()`
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

**依存関係**:
- 入力: プレイヤー速度、敵速度
- 出力: クールダウン時間（ミリ秒）

---

## Phase 2: 報酬計算ロジックの抽出

### 2-1. 経験値計算を関数化
- [ ] `utils/rewardCalculations.ts`を新規作成
- [ ] 敵撃破時のXP計算を関数化: `calculateXpReward()`
  - 入力: 敵のxpValue、現在のステージ、目標レベル
  - 出力: 獲得XP
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

### 2-2. ゴールド計算を関数化
- [ ] 通常敵のゴールド計算を関数化: `calculateGoldReward()`
  - 入力: 敵のgoldValue、プレイヤーの運気
  - 出力: 獲得ゴールド
- [ ] ゴールドスライム特殊処理を関数化: `calculateGoldSlimeReward()`
  - 入力: ステージ番号
  - 出力: 獲得ゴールド
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

### 2-3. アイテムドロップ判定を関数化
- [ ] ドロップ率計算を関数化: `calculateDropChance()`
  - 入力: プレイヤーの運気
  - 出力: ドロップ率
- [ ] ジェムスライムのジェムドロップを関数化: `generateGemDrops()`
  - 入力: なし
  - 出力: ドロップしたジェムのリスト
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

---

## Phase 3: 戦闘状態管理の分離

### 3-1. 攻撃準備状態の管理を分離
- [ ] `hooks/useCombatState.ts`を新規作成
- [ ] プレイヤーの攻撃準備状態管理: `playerAttackReady` ref
- [ ] 敵の攻撃タイマー管理: `enemyAttackTimers` ref（`useEnemyManager`から移動）
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

### 3-2. ダメージ表示の管理を分離
- [ ] `hooks/useDamageDisplay.ts`を新規作成
- [ ] ダメージインスタンスの状態管理: `damageInstances` state
- [ ] ダメージ追加関数: `addDamageInstance()`
- [ ] ダメージインスタンスの自動削除ロジック
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

### 3-3. ゴールドドロップ表示の管理を分離
- [ ] ゴールドドロップの状態管理: `goldDrops` state
- [ ] ゴールドドロップ追加関数: `addGoldDrop()`
- [ ] ゴールドドロップの自動削除ロジック
- [ ] `useDamageDisplay`に統合するか、別フックにするか判断
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

---

## Phase 4: プレイヤー攻撃処理の分離

### 4-1. プレイヤー攻撃のコアロジック作成
- [ ] `hooks/useCombatSystem.ts`を新規作成
- [ ] Phase 1で作成した計算関数を使用
- [ ] Phase 3で作成した状態管理を使用
- [ ] `executePlayerAttack()`関数を実装
  - 入力: 攻撃対象の敵、プレイヤーステータス、装備の属性ダメージ
  - 処理: ダメージ計算、クールダウン設定、アニメーション制御
  - 出力: 更新された敵の配列
- [ ] 報酬処理は**まだ含めない**（次のステップ）
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

### 4-2. 敵撃破時の報酬処理を分離
- [ ] Phase 2で作成した報酬計算関数を使用
- [ ] `processEnemyDefeatRewards()`関数を実装
  - 入力: 撃破された敵、プレイヤー状態、現在のステージ
  - 処理: XP付与、ゴールド付与、アイテムドロップ、特殊処理（ヒーリングスライム等）
  - 出力: 更新されたプレイヤー状態、ログメッセージ
- [ ] `executePlayerAttack()`から呼び出すように統合
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

### 4-3. プレイヤーアニメーション制御の分離
- [ ] プレイヤーのアクション設定を関数化: `triggerPlayerAttackAnimation()`
  - 入力: 攻撃方向
  - 処理: アクション設定、攻撃方向設定、タイムアウト設定
- [ ] `executePlayerAttack()`から呼び出すように統合
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

---

## Phase 5: 敵AI・攻撃処理の分離

### 5-1. 敵の攻撃状態遷移ロジックを分離
- [ ] `processEnemyAttackState()`関数を実装
  - 入力: 敵の現在の状態、現在時刻
  - 処理: 攻撃状態（idle→preparing→attacking→idle）の遷移
  - 出力: 更新された敵
- [ ] Phase 1の計算関数を使用
- [ ] Phase 3の状態管理を使用
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

### 5-2. ボスの特殊挙動を分離
- [ ] `processBossPostAttackMovement()`関数を実装
  - 入力: ボスの敵、プレイヤー位置
  - 処理: 攻撃後の移動
  - 出力: 更新された敵
- [ ] `processEnemyAttackState()`から呼び出すように統合
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

### 5-3. エンゲージ中の敵のAIロジックを分離
- [ ] `processEngagedEnemyAI()`関数を実装
  - 入力: エンゲージ中の敵、プレイヤー速度、現在時刻
  - 処理: 攻撃タイミング判定、攻撃準備状態への遷移
  - 出力: 更新された敵
- [ ] Phase 1の速度計算関数を使用
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

### 5-4. 敵の全体AI処理を統合
- [ ] `processAllEnemiesAI()`関数を実装
  - 入力: 全敵の配列、エンゲージ中の敵ID、プレイヤー状態
  - 処理: 各敵に対してAIロジックを適用
  - 出力: 更新された敵の配列、プレイヤーへの総ダメージ
- [ ] Phase 5-1〜5-3の関数を統合
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

---

## Phase 6: useGameLogicからの移行

### 6-1. useCombatSystemをuseGameLogicに統合
- [ ] `useGameLogic`内で`useCombatSystem`を呼び出し
- [ ] `updateGameLogic`内の`processPlayerAttack`を`useCombatSystem.executePlayerAttack`に置き換え
- [ ] `updateGameLogic`内の`processEnemyAIAndAttacks`を`useCombatSystem.processAllEnemiesAI`に置き換え
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

### 6-2. 古いコードの削除
- [ ] `useGameLogic`内の旧`processPlayerAttack`関数を削除
- [ ] `useGameLogic`内の旧`processEnemyAIAndAttacks`関数を削除
- [ ] 不要になったローカル変数・refを整理
- [ ] 既存のテストがあれば実行、なければ手動で動作確認

### 6-3. 最終確認
- [ ] ゲーム全体の動作確認
  - プレイヤー攻撃が正常に動作するか
  - 敵のAI・攻撃が正常に動作するか
  - 報酬（XP、ゴールド、アイテム）が正常に付与されるか
  - 特殊な敵（ゴールドスライム、ヒーリングスライム、ジェムスライム、ボス）が正常に動作するか
- [ ] パフォーマンスに問題がないか確認
- [ ] コンソールエラーがないか確認

---

## Phase 7: ドキュメント更新

### 7-1. REFACTORING_PLAN.mdの更新
- [ ] タスク1cを完了としてマーク
- [ ] 実際の実装内容を反映

### 7-2. CLAUDE.mdの更新
- [ ] アーキテクチャセクションに新しいフック構造を記載
  - `useCombatSystem`: 戦闘システム
  - `useDamageDisplay`: ダメージ表示管理
- [ ] 新しいユーティリティファイルを記載
  - `utils/combatCalculations.ts`: ダメージ計算
  - `utils/rewardCalculations.ts`: 報酬計算

---

## 注意事項

- **各Phaseは独立して動作確認可能な単位にする**
- **必ずコミット単位を小さく保つ**（1つのサブタスク = 1コミット）
- **各ステップで動作確認を行い、問題があれば即座に修正**
- **依存関係を最小限にし、テスト可能な設計を心がける**
- **TDD原則に従い、可能な限りテストを先に書く**（時間があれば）

---

## 推定作業時間

- Phase 1: 30分（計算ロジックの抽出）
- Phase 2: 20分（報酬計算の抽出）
- Phase 3: 30分（状態管理の分離）
- Phase 4: 40分（プレイヤー攻撃処理）
- Phase 5: 40分（敵AI処理）
- Phase 6: 20分（統合・移行）
- Phase 7: 10分（ドキュメント更新）

**合計: 約3時間**（実際にはデバッグ・調整時間が追加で必要）
