import type { RowCompareFunction } from './interfaces';
import type { Row } from 'react-table';
import {
  ICategoricalStats,
  isCategoricalStats,
  isCategoricalSetValue,
  categoricalSetDegree,
  CategoricalSetValue,
} from '@lineup-lite/components';
import { compareAsc } from './internal';

export function categoricalSetGroupCompare(a: Row<any>, b: Row<any>, columnId: string): number {
  const av: ICategoricalStats = a.values[columnId];
  const bv: ICategoricalStats = b.values[columnId];

  if (isCategoricalStats(av) && isCategoricalStats(bv)) {
    // TODO
    const ai = av.categories.indexOf(av.maxBin.x0);
    const bi = av.categories.indexOf(bv.maxBin.x0);
    return compareAsc(ai, bi);
  }
  return compareAsc(av, bv);
}

function categoricalSetIndices(value: CategoricalSetValue, lookup?: Map<string, number>) {
  const vs: (string | number)[] = [];
  for (const vi of value) {
    vs.push(lookup ? lookup.get(vi) ?? Number.POSITIVE_INFINITY : vi);
  }
  return vs.sort(compareAsc);
}

/**
 * generates a comparator that sorts by the given set of category order
 */
export function categoricalSetCompare(categories?: readonly string[]): RowCompareFunction {
  const lookup = categories ? new Map(categories.map((cat, i) => [cat, i])) : undefined;
  return (a, b, columnId) => {
    const va = a.values[columnId];
    const vb = b.values[columnId];
    if (!isCategoricalSetValue(va) || !isCategoricalSetValue(vb)) {
      return compareAsc(va, vb);
    }
    const degreeA = categoricalSetDegree(va);
    const degreeB = categoricalSetDegree(vb);
    if (degreeA !== degreeB) {
      return degreeA - degreeB;
    }
    const iA = categoricalSetIndices(va, lookup);
    const iB = categoricalSetIndices(vb, lookup);
    const min = Math.min(iA.length, iB.length);
    for (let i = 0; i < min; i++) {
      if (iA[i] === iB[i]) {
        continue;
      }
      if (iA[i] < iB[i]) {
        return -1;
      }
      return 1;
    }
    // must be the same degree, so the same
    return 0;
  };
}
