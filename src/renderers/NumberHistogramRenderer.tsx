import React from 'react';
import { Renderer } from 'react-table';
import { NumberStatsOptions } from '../math/numberStatsGenerator';
import Histogram, { FilterRangeHistogram } from './components/Histogram';
import { extractStats, isFilterAble, StatsPropsLike } from './utils';
import { numberStats } from '../stats/numberStats';

export interface NumberHistogramRendererOptions extends NumberStatsOptions {
  maxBin?: number;
}

export default function NumberHistogramRenderer<P extends StatsPropsLike<number>>(
  options: NumberHistogramRendererOptions = {}
): Renderer<P> {
  const stats = numberStats(options);
  return (props: P) => {
    const { s, preFilter, isCell } = extractStats(props, stats);
    if (isCell) {
      return <Histogram s={s} maxBin={options.maxBin} />;
    }
    if (isFilterAble(props) && props.column.canFilter) {
      const { setFilter, filterValue } = props.column;
      return (
        <FilterRangeHistogram
          s={s}
          preFilter={preFilter}
          maxBin={options.maxBin}
          setFilter={setFilter}
          filterValue={filterValue}
        />
      );
    }
    return <Histogram s={s} maxBin={options.maxBin} summary />;
  };
}
