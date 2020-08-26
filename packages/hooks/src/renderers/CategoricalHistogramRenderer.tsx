import React, { useContext } from 'react';
import { Renderer } from 'react-table';
import { ICategoricalStats } from '../math';
import { categoricalStats } from '../stats';
import { CategoricalRendererOptions } from './CategoricalRenderer';
import Histogram, { FilterBinHistogram } from '../components/Histogram';
import { extractStats, isFilterAble, StatsPropsLike, groupMaxBin, statsGeneratorContext, optionContext } from './utils';

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
