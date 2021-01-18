import { Histogram, FilterBinHistogram, ICategoricalStats } from '@lineup-lite/components';
import React, { useContext } from 'react';
import type { Renderer } from 'react-table';
import { categoricalStats } from '../stats';
import type { CategoricalRendererOptions } from './CategoricalRenderer';
import { extractStats, groupMaxBin, isFilterAble, optionContext, statsGeneratorContext, StatsPropsLike } from './utils';

export interface CategoricalHistogramRendererOptions extends CategoricalRendererOptions {
  maxBin?: number;
}

export function CategoricalHistogramRenderer<P extends StatsPropsLike<string>>(props: P) {
  const options = useContext(optionContext) as CategoricalHistogramRendererOptions;
  const stats =
    useContext<((arr: readonly string[], preFilter?: ICategoricalStats) => ICategoricalStats) | null>(
      statsGeneratorContext
    ) ?? categoricalStats(options);
  const { s, preFilter, cell } = extractStats(props, stats);
  if (cell) {
    const maxBin = groupMaxBin(options, cell, props);
    return <Histogram s={s} maxBin={maxBin} />;
  }
  if (isFilterAble(props) && props.column.canFilter) {
    const { setFilter, filterValue } = props.column;
    return (
      <FilterBinHistogram
        s={s}
        preFilter={preFilter}
        maxBin={options.maxBin}
        setFilter={setFilter}
        filterValue={filterValue}
        label
      />
    );
  }
  return <Histogram s={s} maxBin={options.maxBin} label summary />;
}

export function CategoricalHistogramRendererFactory<P extends StatsPropsLike<string>>(
  options: CategoricalHistogramRendererOptions = {}
): Renderer<P> {
  const stats = categoricalStats(options);
  return (props: P) => (
    <statsGeneratorContext.Provider value={stats}>
      <optionContext.Provider value={options}>
        <CategoricalHistogramRenderer {...props} />
      </optionContext.Provider>
    </statsGeneratorContext.Provider>
  );
}
