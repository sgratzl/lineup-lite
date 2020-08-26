import React, { useContext } from 'react';
import { Renderer } from 'react-table';
import { dateStats } from '../stats';
import Histogram, { FilterRangeHistogram } from './components/Histogram';
import { extractStats, isFilterAble, StatsPropsLike, groupMaxBin, statsGeneratorContext, optionContext } from './utils';
import { DateStatsOptions, IDateStats } from '../math';

export interface HistogramRendererOptions extends DateStatsOptions {
  maxBin?: number;
}

export function DateHistogramRenderer<P extends StatsPropsLike<Date | null>>(props: P) {
  const options = useContext(optionContext) as HistogramRendererOptions;
  const stats =
    useContext<((arr: readonly (Date | null)[], preFilter?: IDateStats) => IDateStats) | null>(statsGeneratorContext) ??
    dateStats(options);
  const { s, preFilter, cell } = extractStats(props, stats);
  if (cell) {
    const maxBin = groupMaxBin(options, cell, props);
    return <Histogram s={s} maxBin={maxBin} />;
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
}

export function DateHistogramRendererFactory<P extends StatsPropsLike<Date | null>>(
  options: HistogramRendererOptions = {}
): Renderer<P> {
  const stats = dateStats(options);
  return (props: P) => (
    <statsGeneratorContext.Provider value={stats}>
      <optionContext.Provider value={options}>
        <DateHistogramRenderer {...props} />
      </optionContext.Provider>
    </statsGeneratorContext.Provider>
  );
}
