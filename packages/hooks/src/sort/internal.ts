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

export function categoricalSortFunc(categories: readonly string[]): (a: string, b: string) => number {
  const lookup = new Map(categories.map((cat, i) => [cat, i]));
  return (va, vb) => {
    const aIndex = va == null || !lookup.has(va) ? Number.POSITIVE_INFINITY : lookup.get(va)!;
    const bIndex = vb == null || !lookup.has(vb) ? Number.POSITIVE_INFINITY : lookup.get(vb)!;
    return compareAsc(aIndex, bIndex);
  };
}
