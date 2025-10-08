export function formatCompactNumber(value: number): string {
    if (typeof value !== 'number' || !isFinite(value)) return String(value);
    if (value >= 1_000_000_000) {
        // 1B, 2B, 3B...（小数点以下切り捨て）
        return `${Math.floor(value / 1_000_000_000)}B`;
    }
    if (value >= 1_000_000) {
        // 1M, 2M, 3M...（小数点以下切り捨て）
        return `${Math.floor(value / 1_000_000)}M`;
    }
    if (value >= 100_000) {
        // 100K 以上は K 表記（小数点以下切り捨て）
        return `${Math.floor(value / 1_000)}K`;
    }
    return String(Math.floor(value));
}
