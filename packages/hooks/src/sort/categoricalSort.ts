import type { RowCompareFunction } from './interfaces';
import type { Row } from 'react-table';
import { ICategoricalStats, isCategoricalStats } from '@lineup-lite/components';
import { compareAsc } from './internal';

export function categoricalGroupCompare(a: Row<any>, b: Row<any>, columnId: string): number {
  const av: ICategoricalStats = a.values[columnId];
  const bv: ICategoricalStats = b.values[columnId];

  if (isCategoricalStats(av) && isCategoricalStats(bv)) {
    const ai = av.categories.indexOf(av.maxBin.x0);
    const bi = av.categories.indexOf(bv.maxBin.x0);
    return compareAsc(ai, bi);
  }
  return compareAsc(av, bv);
}

/**
 * generates a comparator that sorts by the given set of category order
 */
export function categoricalSort(categories: readonly string[]): RowCompareFunction {
  const lookup = new Map(categories.map((cat, i) => [cat, i]));
  return (a, b, columnId) => {
    const va = a.values[columnId];
    const vb = b.values[columnId];
    const aIndex = va == null || !lookup.has(va) ? Number.POSITIVE_INFINITY : lookup.get(va)!;
    const bIndex = vb == null || !lookup.has(vb) ? Number.POSITIVE_INFINITY : lookup.get(vb)!;
    return compareAsc(aIndex, bIndex);
  };
}
