import React from 'react';
import { Renderer } from 'react-table';
import { StatsProps } from '../hooks/useStats';
import { dateStats } from '../stats/dateStats';
import Histogram, { FilterRangeHistogram } from './components/Histogram';
import { extractStats, isFilterAble, isValueStats } from './utils';
import { DateStatsOptions, IDateStats } from '../math/dateStatsGenerator';

export interface HistogramRendererOptions extends DateStatsOptions {
  maxBin?: number;
}

export default function DateHistogramRenderer<P extends { value: readonly Date[] } | StatsProps<any>>(
  options: HistogramRendererOptions = {}
): Renderer<P> {
  const stats = dateStats(options);
  return (props: P) => {
    if (isValueStats<IDateStats>(props)) {
      return <Histogram s={props.value} maxBin={options.maxBin} />;
    }
    const s = extractStats(props, stats);
    if (isFilterAble(props) && props.column.canFilter) {
      const { setFilter, filterValue } = props.column;
      return <FilterRangeHistogram s={s} maxBin={options.maxBin} setFilter={setFilter} filterValue={filterValue} />;
    }
    return <Histogram s={s} maxBin={options.maxBin} summary />;
  };
}
