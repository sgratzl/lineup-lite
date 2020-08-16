import React from 'react';
import { Renderer } from 'react-table';
import { dateStats } from '../stats/dateStats';
import Histogram, { FilterRangeHistogram } from './components/Histogram';
import { extractStats, isFilterAble, StatsPropsLike } from './utils';
import { DateStatsOptions } from '../math/dateStatsGenerator';

export interface HistogramRendererOptions extends DateStatsOptions {
  maxBin?: number;
}

export default function DateHistogramRenderer<P extends StatsPropsLike<Date | null>>(
  options: HistogramRendererOptions = {}
): Renderer<P> {
  const stats = dateStats(options);
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
