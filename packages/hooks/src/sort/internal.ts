export function compareAsc<T>(va: T, vb: T): number {
  if (va === vb) {
    return 0;
  }
  if (va == null) {
    return 1;
  }
  if (vb == null) {
    return -1;
  }
  return va < vb ? -1 : 1;
}
