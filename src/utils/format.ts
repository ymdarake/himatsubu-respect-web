export function formatCompactNumber(value: number): string {
    if (typeof value !== 'number' || !isFinite(value)) return String(value);
    if (value >= 1_000_000) {
        // 1M, 2M, 3M...（小数点以下切り捨て）
        return `${Math.floor(value / 1_000_000)}M`;
    }
    return String(Math.floor(value));
}
