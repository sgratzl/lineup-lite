import React from 'react';
import { Renderer } from 'react-table';
import { StatsProps } from '../hooks/useStats';
import { dateStats, DateStatsOptions } from '../stats/dateStats';
import Histogram, { FilterRangeHistogram } from './components/Histogram';
import { extractStats, isFilterAble } from './utils';

export interface HistogramRendererOptions extends DateStatsOptions {
  maxBin?: number;
}

export default function DateHistogramRenderer<P extends { value: readonly Date[] } | StatsProps<any>>(
  options: HistogramRendererOptions = {}
): Renderer<P> {
  const stats = dateStats(options);
  return (props: P) => {
    const s = extractStats(props, stats);
    if (isFilterAble(props) && props.column.canFilter) {
      const { setFilter, filterValue } = props.column;
      return <FilterRangeHistogram s={s} maxBin={options.maxBin} setFilter={setFilter} filterValue={filterValue} />;
    }
    return <Histogram s={s} maxBin={options.maxBin} />;
  };
}
