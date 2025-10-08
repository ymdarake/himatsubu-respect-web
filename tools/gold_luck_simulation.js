/**
 * 運気値とステージ別のゴールド獲得量シミュレーション
 *
 * 現在の係数: 0.0025
 * 提案係数: 0.005, 0.01
 */

// just: for create pr

// 敵のgoldValue（ステージごとの代表的な敵）
const enemyGoldByStage = {
  0: 2,    // スライム (ステージ1)
  10: 3,   // ウルフ (ステージ11)
  20: 3,   // オーク (ステージ21)
  30: 4,   // ファイア・エレメンタル (ステージ31)
  50: 4,   // ドラゴン (ステージ51)
  100: 5,  // 後半エリア (推定)
  200: 6,  // さらに後半 (推定)
  500: 10, // 終盤 (推定)
};

// 運気値のサンプル
const luckValues = [0, 50, 100, 150, 200, 300, 500];

// 係数のパターン
const coefficients = {
  current: 0.0025,
  proposed1: 0.005,
  proposed2: 0.00833, // 運気300で3.5倍 (1 + 300*0.00833 ≈ 3.5)
};

function calculateGold(baseGoldValue, luckValue, coefficient) {
  // baseGoldFromEnemy = goldValue * (0.8 + Math.random() * 0.4)
  // 平均値を使用: goldValue * 1.0
  const baseGoldFromEnemy = baseGoldValue * 1.0;

  // luckBonusMultiplier = 1 + (luckValue * coefficient)
  const luckBonusMultiplier = 1 + (luckValue * coefficient);

  // goldDropped = Math.floor(baseGoldFromEnemy * luckBonusMultiplier)
  const goldDropped = Math.floor(baseGoldFromEnemy * luckBonusMultiplier);

  return goldDropped;
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('運気値別・ステージ別 ゴールド獲得シミュレーション');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// 各係数での結果を計算
Object.entries(coefficients).forEach(([name, coefficient]) => {
  const displayName = name === 'current' ? '現在 (0.0025)' :
    name === 'proposed1' ? '提案1 (0.005)' :
      '提案2 (0.00833 = 運気300で3.5倍)';

  console.log(`\n【${displayName}】`);
  console.log('─'.repeat(80));

  // ヘッダー
  const header = 'ステージ | 基礎G | ' + luckValues.map(l => `運気${l}`.padStart(8)).join(' | ');
  console.log(header);
  console.log('─'.repeat(80));

  // 各ステージでの結果
  Object.entries(enemyGoldByStage).forEach(([stage, baseGold]) => {
    const results = luckValues.map(luck => {
      const gold = calculateGold(baseGold, luck, coefficient);
      const bonus = gold - baseGold;
      return `${gold}G(+${bonus})`.padStart(8);
    });

    console.log(`${String(stage).padStart(7)} | ${String(baseGold).padStart(5)} | ${results.join(' | ')}`);
  });
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('比較: 運気100での増加率');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

Object.entries(coefficients).forEach(([name, coefficient]) => {
  const multiplier = 1 + (100 * coefficient);
  const increasePercent = (coefficient * 100 * 100).toFixed(0);
  console.log(`${name.padEnd(10)}: ${multiplier}倍 (+${increasePercent}%)`);
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('比較: 運気200での増加率');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

Object.entries(coefficients).forEach(([name, coefficient]) => {
  const multiplier = 1 + (200 * coefficient);
  const increasePercent = (coefficient * 200 * 100).toFixed(0);
  console.log(`${name.padEnd(10)}: ${multiplier}倍 (+${increasePercent}%)`);
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('特定シナリオ比較');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// シナリオ1: ステージ1, 運気0 vs 運気100
console.log('【シナリオ1】ステージ1 (基礎2G), 運気0 vs 運気100');
Object.entries(coefficients).forEach(([name, coefficient]) => {
  const gold0 = calculateGold(2, 0, coefficient);
  const gold100 = calculateGold(2, 100, coefficient);
  console.log(`  ${name.padEnd(10)}: ${gold0}G → ${gold100}G (差分: +${gold100 - gold0}G)`);
});

console.log('\n【シナリオ2】ステージ30 (基礎4G), 運気100 vs 運気200');
Object.entries(coefficients).forEach(([name, coefficient]) => {
  const gold100 = calculateGold(4, 100, coefficient);
  const gold200 = calculateGold(4, 200, coefficient);
  console.log(`  ${name.padEnd(10)}: ${gold100}G → ${gold200}G (差分: +${gold200 - gold100}G)`);
});

console.log('\n【シナリオ3】ステージ100 (基礎5G), 運気200 vs 運気500');
Object.entries(coefficients).forEach(([name, coefficient]) => {
  const gold200 = calculateGold(5, 200, coefficient);
  const gold500 = calculateGold(5, 500, coefficient);
  console.log(`  ${name.padEnd(10)}: ${gold200}G → ${gold500}G (差分: +${gold500 - gold200}G)`);
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('10体討伐時の累積ゴールド比較 (ステージ30, 基礎4G)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

luckValues.forEach(luck => {
  console.log(`運気${luck}の場合:`);
  Object.entries(coefficients).forEach(([name, coefficient]) => {
    const perEnemy = calculateGold(4, luck, coefficient);
    const total = perEnemy * 10;
    console.log(`  ${name.padEnd(10)}: ${perEnemy}G/体 × 10体 = ${total}G`);
  });
  console.log('');
});
