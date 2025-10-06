// XP獲得量のシミュレーション比較

// 基本設定
const INITIAL_XP_TO_NEXT_LEVEL = 50;
const XP_MULTIPLIER = 1.1;

// 複数のBASE_ENEMY_XPでテスト
const baseXpOptions = [500, 1000, 2000, 5000];

// 必要経験値を計算
function calculateRequiredXP(level) {
    let xpRequired = INITIAL_XP_TO_NEXT_LEVEL;
    for (let i = 1; i < level; i++) {
        xpRequired = Math.floor(xpRequired * XP_MULTIPLIER);
    }
    return xpRequired;
}

// XP計算（基礎XPと係数の両方を考慮）
function getXpPerEnemy(stageIndex, multiplier, baseXp) {
    return Math.floor(baseXp * Math.pow(multiplier, stageIndex / 5));
}

// レベルアップに必要な敵撃破数を計算
function calculateEnemiesNeeded(currentLevel, stageIndex, multiplier, baseXp) {
    const requiredXP = calculateRequiredXP(currentLevel + 1);
    const xpPerEnemy = getXpPerEnemy(stageIndex, multiplier, baseXp);
    return Math.ceil(requiredXP / xpPerEnemy);
}

// より現実的なシミュレーション: 高レベルでも現実的なステージ
console.log("=".repeat(100));
console.log("目標: 終盤でも20体程度でレベルアップ");
console.log("戦略: 基礎XPと係数の組み合わせで最適化");
console.log("=".repeat(100));
console.log();

// 実際のプレイでは、同じステージで何度もレベルアップする
const realisticTestCases = [
    { level: 50, stage: 40, desc: "中盤" },
    { level: 100, stage: 60, desc: "後半" },
    { level: 150, stage: 70, desc: "終盤" },
    { level: 200, stage: 80, desc: "やり込み" },
];

const multiplier = 1.15; // 係数を1.15に変更

console.log(`係数${multiplier}、基礎XPを変えた場合の比較\n`);

baseXpOptions.forEach(baseXp => {
    console.log(`【基礎XP: ${baseXp}】`);
    console.log("段階       | Lv/St  | 必要XP         | 敵1体XP  | 必要敵数");
    console.log("-".repeat(75));

    realisticTestCases.forEach(({ level, stage, desc }) => {
        const requiredXP = calculateRequiredXP(level + 1);
        const xpPerEnemy = getXpPerEnemy(stage, multiplier, baseXp);
        const enemiesNeeded = calculateEnemiesNeeded(level, stage, multiplier, baseXp);
        const isGood = enemiesNeeded >= 15 && enemiesNeeded <= 50;
        const mark = isGood ? '✓' : ' ';

        console.log(
            `${mark}${desc.padEnd(9)} | ${level.toString().padStart(3)}/${stage.toString().padStart(2)} | ` +
            `${requiredXP.toString().padStart(14)} | ${xpPerEnemy.toString().padStart(8)}xp | ${enemiesNeeded.toString().padStart(8)}体`
        );
    });
    console.log();
});

console.log("=".repeat(100));
console.log("まとめ: 各基礎XPでの必要撃破数");
console.log("=".repeat(100));
console.log();
console.log("段階       | Lv/St  | " + baseXpOptions.map(xp => `基礎${xp}xp`.padStart(10)).join(" | "));
console.log("-".repeat(100));

realisticTestCases.forEach(({ level, stage, desc }) => {
    const counts = baseXpOptions.map(baseXp => {
        const enemies = calculateEnemiesNeeded(level, stage, multiplier, baseXp);
        const isGood = enemies >= 15 && enemies <= 50;
        const mark = isGood ? '✓' : ' ';
        return `${mark}${enemies}体`.padStart(10);
    });
    console.log(`${desc.padEnd(10)} | ${level.toString().padStart(3)}/${stage.toString().padStart(2)} | ${counts.join(" | ")}`);
});

console.log("\n" + "=".repeat(100));
console.log("✓ = 目標範囲内（15-50体）");
console.log("=".repeat(100));
