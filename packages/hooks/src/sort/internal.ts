/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

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
    const aIndex = lookup.get(va) ?? Number.POSITIVE_INFINITY;
    const bIndex = lookup.get(vb) ?? Number.POSITIVE_INFINITY;
    return compareAsc(aIndex, bIndex);
  };
}
