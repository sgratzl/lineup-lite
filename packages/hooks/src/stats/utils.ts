export function isStatsOptions<T extends object>(arr: T | readonly any[]): arr is T {
  return !Array.isArray(arr);
}
