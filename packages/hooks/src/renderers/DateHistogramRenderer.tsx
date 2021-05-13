/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  DateStatsOptions,
  FilterRangeHistogram,
  FilterRangeHistogramProps,
  Histogram,
  IDateStats,
  CommonProps,
} from '@lineup-lite/components';
import React, { useContext } from 'react';
import type { Renderer } from 'react-table';
import { dateStats } from '../stats';
import {
  extractStats,
  groupMaxBin,
  isFilterAble,
  optionContext,
  statsGeneratorContext,
  StatsPropsLike,
  useAsyncDebounce,
} from './utils';

export interface HistogramRendererOptions extends DateStatsOptions, CommonProps {
  maxBin?: number;
}

function Filtered(props: FilterRangeHistogramProps<Date>) {
  const setFilter = useAsyncDebounce(props.setFilter);
  return <FilterRangeHistogram {...props} setFilter={setFilter} i18n={props.i18n} />;
}

export function DateHistogramRenderer<P extends StatsPropsLike<Date | null>>(props: P): JSX.Element {
  const options = useContext(optionContext) as HistogramRendererOptions;
  const stats =
    useContext<((arr: readonly (Date | null)[], preFilter?: IDateStats) => IDateStats) | null>(statsGeneratorContext) ??
    dateStats(options);
  const { s, preFilter, cell } = extractStats(props, stats);
  if (cell) {
    const maxBin = groupMaxBin(options, cell as unknown as { isAggregated?: boolean }, props);
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
        style={options.style}
        className={options.className}
      />
    );
  }
  return <Histogram s={s} maxBin={options.maxBin} summary style={options.style} className={options.className} />;
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
