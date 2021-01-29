import {
  DateStatsOptions,
  FilterRangeHistogram,
  FilterRangeHistogramProps,
  Histogram,
  IDateStats,
} from '@lineup-lite/components';
import React, { useContext } from 'react';
import { Renderer, useAsyncDebounce } from 'react-table';
import { dateStats } from '../stats';
import { extractStats, groupMaxBin, isFilterAble, optionContext, statsGeneratorContext, StatsPropsLike } from './utils';

export interface HistogramRendererOptions extends DateStatsOptions {
  maxBin?: number;
}

function Filtered(props: FilterRangeHistogramProps<Date>) {
  const setFilter = useAsyncDebounce(props.setFilter);
  return <FilterRangeHistogram {...props} setFilter={setFilter} i18n={props.i18n} />;
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
      <Filtered
        s={s}
        preFilter={preFilter}
        maxBin={options.maxBin}
        setFilter={setFilter}
        filterValue={filterValue}
        i18n={props.i18n}
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
