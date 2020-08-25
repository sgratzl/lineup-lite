import React from 'react';
import { Renderer } from 'react-table';
import { categoricalStats } from '../stats/categoricalStats';
import { CategoricalRendererOptions } from './CategoricalRenderer';
import Histogram, { FilterBinHistogram } from './components/Histogram';
import { extractStats, isFilterAble, StatsPropsLike, groupMaxBin } from './utils';

export interface CategoricalHistogramRendererOptions extends CategoricalRendererOptions {
  maxBin?: number;
}

export default function CategoricalHistogramRenderer<P extends StatsPropsLike<string>>(
  options: CategoricalHistogramRendererOptions = {}
): Renderer<P> {
  const stats = categoricalStats(options);
  return (props: P) => {
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
  };
}
