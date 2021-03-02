/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { Row } from 'react-table';
import {
  ICategoricalStats,
  isCategoricalStats,
  isCategoricalSetValue,
  categoricalSetDegree,
  CategoricalSetValue,
} from '@lineup-lite/components';
import type { RowCompareFunction } from './interfaces';
import { compareAsc } from './internal';
import type { UnknownObject } from '../interfaces';

function toMode(s: ICategoricalStats, bin: number) {
  if (bin < 0 || s.hist.length <= bin) {
    return 4;
  }
  const binValue = s.hist[bin].count;
  const maxCount = s.flatItems.length;
  if (maxCount === binValue) {
    return 1;
  }
  if (binValue > 0) {
    return 2;
  }
  return 3;
}

export function categoricalSetGroupCompare(a: Row<UnknownObject>, b: Row<UnknownObject>, columnId: string): number {
  const av: ICategoricalStats = a.values[columnId];
  const bv: ICategoricalStats = b.values[columnId];

  if (isCategoricalStats(av) && isCategoricalStats(bv)) {
    for (let i = 0; i < av.hist.length; i += 1) {
      const avi = toMode(av, i);
      const bvi = toMode(bv, i);
      if (avi !== bvi) {
        return compareAsc(avi, bvi);
      }
    }
    return 0;
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
    for (let i = 0; i < min; i += 1) {
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
