// 「ステージNを2周（10体撃破）でレベルN-1→Nへレベルアップ」を実現する設計

const INITIAL_XP_TO_NEXT_LEVEL = 50;
const XP_MULTIPLIER = 1.1; // レベルアップに必要なXPは1.1倍ずつ増加
const BASE_ENEMY_XP = 20; // 敵の基礎XP

// レベルNに必要なXP
function getRequiredXP(level) {
    let xp = INITIAL_XP_TO_NEXT_LEVEL;
    for (let i = 1; i < level; i++) {
        xp = Math.floor(xp * XP_MULTIPLIER);
    }
    return xp;
}

// 「ステージNを2周（10体）でレベルN-1→Nにレベルアップ」するために必要な
// ステージNの敵1体あたりのXP
function getRequiredEnemyXP(level) {
    const requiredXP = getRequiredXP(level);
    return Math.ceil(requiredXP / 10); // 10体で達成
}

// 実際の敵XP（指数関数的増加）
function getActualEnemyXP(stage, multiplier) {
    return Math.floor(BASE_ENEMY_XP * Math.pow(multiplier, stage / 5));
}

console.log("=".repeat(100));
console.log("目標: ステージNを2周（10体撃破）でレベルN-1→Nにレベルアップ");
console.log("=".repeat(100));
console.log();

// 目標を達成するために必要な係数を逆算
console.log("【必要な敵XP vs 実際の敵XP（係数別）】\n");

const testStages = [10, 20, 30, 50, 70, 100];
const multipliers = [1.09, 1.10, 1.11, 1.12];

console.log("ステージ | レベル | 必要XP   | 目標敵XP | " + multipliers.map(m => `係数${m}`.padStart(10)).join(" | "));
console.log("-".repeat(100));

testStages.forEach(stage => {
    const level = stage; // レベル = ステージの想定
    const requiredXP = getRequiredXP(level);
    const targetEnemyXP = getRequiredEnemyXP(level);

    const actualXPs = multipliers.map(mult => {
        const actual = getActualEnemyXP(stage, mult);
        const diff = actual - targetEnemyXP;
        const diffPercent = ((diff / targetEnemyXP) * 100).toFixed(0);
        const mark = Math.abs(diff / targetEnemyXP) < 0.1 ? '✓' : ' ';
        return `${mark}${actual}(${diffPercent > 0 ? '+' : ''}${diffPercent}%)`.padStart(10);
    });

    console.log(
        `${stage.toString().padStart(8)} | ${level.toString().padStart(6)} | ${requiredXP.toString().padStart(8)} | ${targetEnemyXP.toString().padStart(8)} | ${actualXPs.join(" | ")}`
    );
});

console.log("\n" + "=".repeat(100));
console.log("✓ = 目標±10%以内");
console.log("=".repeat(100));

// 最適な係数を逆算
console.log("\n【最適係数の逆算】\n");
console.log("レベルアップに必要なXPの倍率: 1.1");
console.log("必要な敵XPの倍率（ステージ5ごと）: " + Math.pow(1.1, 5).toFixed(4));
console.log("つまり、Math.pow(係数, stage/5) が Math.pow(1.1, level) に一致すべき");
console.log();
console.log("もしレベル ≈ ステージなら:");
console.log("  Math.pow(係数, stage/5) ≈ Math.pow(1.1, stage)");
console.log("  係数^(1/5) ≈ 1.1");
console.log("  係数 ≈ 1.1^5 = " + Math.pow(1.1, 5).toFixed(4));
console.log();
console.log("→ 最適係数は約 1.61（ただしこれは急すぎる）");
console.log("→ より現実的には、レベル進行とステージ進行の比率を調整すべき");
