import React from 'react';
import { Renderer } from 'react-table';
import { StatsProps } from '../hooks/useStats';
import { NumberStatsOptions, INumberStats } from '../math/numberStatsGenerator';
import Histogram, { FilterRangeHistogram } from './components/Histogram';
import { extractStats, isFilterAble, isValueStats } from './utils';
import { numberStats } from '../stats/numberStats';

export interface NumberHistogramRendererOptions extends NumberStatsOptions {
  maxBin?: number;
}

export default function NumberHistogramRenderer<P extends { value: readonly number[] } | StatsProps<any>>(
  options: NumberHistogramRendererOptions = {}
): Renderer<P> {
  const stats = numberStats(options);
  return (props: P) => {
    if (isValueStats<INumberStats>(props)) {
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
