import type { Row } from 'react-table';

export function sortCompare(a: Row<any>, b: Row<any>, columnId: string) {
  const va = a.values[columnId];
  const vb = b.values[columnId];
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

export function sortCategories(categories: readonly string[]) {
  const lookup = new Map(categories.map((cat, i) => [cat, i]));
  return (a: Row<any>, b: Row<any>, columnId: string) => {
    const va = a.values[columnId];
    const vb = b.values[columnId];
    const aIndex = va == null || !lookup.has(va) ? Number.POSITIVE_INFINITY : lookup.get(va)!;
    const bIndex = vb == null || !lookup.has(vb) ? Number.POSITIVE_INFINITY : lookup.get(vb)!;
    if (aIndex === bIndex) {
      return 0;
    }
    return aIndex < bIndex ? -1 : 1;
  };
}
