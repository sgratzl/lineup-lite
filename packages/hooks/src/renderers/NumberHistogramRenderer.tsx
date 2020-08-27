import { FilterRangeHistogram, Histogram, INumberStats, NumberStatsOptions } from '@lineup-lite/components';
import React, { useContext } from 'react';
import { Renderer } from 'react-table';
import { numberStats } from '../stats';
import { extractStats, groupMaxBin, isFilterAble, optionContext, statsGeneratorContext, StatsPropsLike } from './utils';

export interface NumberHistogramRendererOptions extends NumberStatsOptions {
  maxBin?: number;
}

export function NumberHistogramRenderer<P extends StatsPropsLike<number>>(props: P) {
  const options = useContext(optionContext) as NumberHistogramRendererOptions;
  const stats =
    useContext<((arr: readonly number[], preFilter?: INumberStats) => INumberStats) | null>(statsGeneratorContext) ??
    numberStats(options);
  const { s, preFilter, cell } = extractStats(props, stats);
  if (cell) {
    const maxBin = groupMaxBin(options, cell, props);
    return <Histogram s={s} maxBin={maxBin} />;
  }
  if (isFilterAble(props) && props.column.canFilter) {
    const { setFilter, filterValue } = props.column;
    // TODO debounc
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

export function NumberHistogramRendererFactory<P extends StatsPropsLike<number>>(
  options: NumberHistogramRendererOptions = {}
): Renderer<P> {
  const stats = numberStats(options);
  return (props: P) => (
    <statsGeneratorContext.Provider value={stats}>
      <optionContext.Provider value={options}>
        <NumberHistogramRenderer {...props} />
      </optionContext.Provider>
    </statsGeneratorContext.Provider>
  );
}
