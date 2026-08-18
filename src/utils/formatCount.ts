/**
 * Formats a raw count into a compact, human-friendly string.
 * 45231 -> "45.2k", 2100000 -> "2.1M", 900 -> "900"
 */
export function formatCount(n: number): string {
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return String(n);
}
