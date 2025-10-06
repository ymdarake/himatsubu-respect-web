/**
 * 腕力 vs 運気(ギャンブラー装備) の物理攻撃力比較
 */

// ステータス計算式
const strengthToPhysicalAttack = (strength) => strength * 2;
const luckToPhysicalAttack = (luck) => Math.floor(luck * 2.0); // ギャンブラーダイス装備時（チート級）

// ベースステータス（レベル1、全ステ10と仮定）
const basePhysicalAttack = 5;

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('腕力 vs 運気(ギャンブラー) の物理攻撃力比較');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('【変換比率（チート級）】');
console.log('- 腕力 → 物理攻撃: 1:2 (腕力1 = 物理攻撃+2)');
console.log('- 運気 → 物理攻撃: 1:2 (運気1 = 物理攻撃+2、ギャンブラーダイス装備時)');
console.log('- 比率: 腕力と運気が **完全同等** + クリティカル・金策ボーナス！\n');

console.log('【同じステータスポイントを振った場合】');
const statPoints = [10, 20, 50, 100, 200, 300];

console.log('─'.repeat(80));
console.log('ポイント | 腕力ビルド | 運気ビルド | 差分 | 腕力の優位性');
console.log('─'.repeat(80));

statPoints.forEach(points => {
  const strengthAttack = strengthToPhysicalAttack(points);
  const luckAttack = luckToPhysicalAttack(points);
  const diff = strengthAttack - luckAttack;
  const ratio = (strengthAttack / luckAttack).toFixed(2);

  console.log(
    `${String(points).padStart(8)} | ` +
    `${String(strengthAttack).padStart(10)}攻 | ` +
    `${String(luckAttack).padStart(10)}攻 | ` +
    `${String(diff).padStart(4)}攻 | ` +
    `${ratio}倍`
  );
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('運気ビルドの総合メリット');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('運気300の場合（チート級）:');
console.log('- 物理攻撃: +600 (運気の200%)');
console.log('- クリティカル率: 75% (300/400、上限到達)');
console.log('- クリティカル平均倍率: 1 + 0.75 * 0.5 = 1.375倍');
console.log('- 実質物理攻撃: 600 * 1.375 = 825相当');
console.log('- ゴールド獲得: 3.5倍 (運気300 * 0.00833)');
console.log('- アイテムドロップ率ボーナス: 約+0.75 (300 * 0.0025)\n');

console.log('腕力300の場合:');
console.log('- 物理攻撃: +600 (腕力 * 2)');
console.log('- クリティカル率: 基本値のみ');
console.log('- 実質攻撃力: 600');
console.log('- ゴールド・ドロップボーナス: なし\n');

console.log('→ 運気ビルドは腕力と同等の火力 + クリティカルで1.375倍 + 金策3.5倍 = チート！\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('ギャンブラー装備込みの比較シミュレーション');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// 実際の装備を考慮したシミュレーション
const scenarios = [
  {
    name: '序盤 (レベル10、ステ振り20)',
    strengthBuild: { strength: 30, luck: 10 }, // 初期10 + 振り20
    luckBuild: { strength: 10, luck: 30 },
    gamblerEquip: { weapon: 20, armor: 15, accessory: 30 } // 装備からの運気
  },
  {
    name: '中盤 (レベル30、ステ振り60)',
    strengthBuild: { strength: 70, luck: 10 },
    luckBuild: { strength: 10, luck: 70 },
    gamblerEquip: { weapon: 20, armor: 15, accessory: 30 }
  },
  {
    name: '後半 (レベル60、ステ振り120)',
    strengthBuild: { strength: 130, luck: 10 },
    luckBuild: { strength: 10, luck: 130 },
    gamblerEquip: { weapon: 20, armor: 15, accessory: 30 }
  },
  {
    name: '終盤 (レベル100、ステ振り200)',
    strengthBuild: { strength: 210, luck: 10 },
    luckBuild: { strength: 10, luck: 210 },
    gamblerEquip: { weapon: 20, armor: 15, accessory: 30 }
  }
];

scenarios.forEach(scenario => {
  console.log(`【${scenario.name}】`);

  // 腕力ビルド
  const strAttack = basePhysicalAttack + strengthToPhysicalAttack(scenario.strengthBuild.strength);

  // 運気ビルド（装備込み）
  const totalLuck = 5 + scenario.luckBuild.luck + scenario.gamblerEquip.weapon +
                    scenario.gamblerEquip.armor + scenario.gamblerEquip.accessory;
  const luckAttack = basePhysicalAttack + luckToPhysicalAttack(totalLuck);
  const critRate = Math.min(0.75, totalLuck / 400);
  const avgCritMultiplier = 1 + (critRate * 0.5);
  const effectiveLuckAttack = Math.floor(luckAttack * avgCritMultiplier);

  console.log(`  腕力ビルド: 物理攻撃 ${strAttack}`);
  console.log(`  運気ビルド: 運気${totalLuck} → 物理攻撃 ${luckAttack}`);
  console.log(`            クリティカル率${(critRate * 100).toFixed(1)}% → 実質攻撃力 ${effectiveLuckAttack}`);
  console.log(`  差分: ${effectiveLuckAttack - strAttack} (運気が${effectiveLuckAttack > strAttack ? '有利' : '不利'})`);
  console.log(`  運気の追加メリット: ゴールド${(1 + totalLuck * 0.00833).toFixed(2)}倍、ドロップ率+${(totalLuck * 0.0025).toFixed(2)}\n`);
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('結論');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('1. 純粋な物理攻撃力: 腕力が4倍効率的');
console.log('2. クリティカルを考慮: 運気100以上で拮抗し始める');
console.log('3. 運気の総合メリット: ゴールド・ドロップ率が大幅向上');
console.log('4. バランス: ギャンブラー装備の0.5倍率は適切（腕力より弱いが、');
console.log('   クリティカル・金策メリットで補完される）\n');
