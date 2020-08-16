import React from 'react';
import { Renderer } from 'react-table';
import { StatsProps } from '../hooks/useStats';
import { categoricalStats } from '../stats/categoricalStats';
import { CategoricalRendererOptions } from './CategoricalRenderer';
import Histogram, { FilterBinHistogram } from './components/Histogram';
import { extractStats, isFilterAble, isValueStats } from './utils';
import { ICategoricalStats } from '../math/categoricalStatsGenerator';

export interface CategoricalHistogramRendererOptions extends CategoricalRendererOptions {
  maxBin?: number;
}

export default function CategoricalHistogramRenderer<P extends { value: readonly string[] } | StatsProps<any>>(
  options: CategoricalHistogramRendererOptions = {}
): Renderer<P> {
  const stats = categoricalStats(options);
  return (props: P) => {
    if (isValueStats<ICategoricalStats>(props)) {
      return <Histogram s={props.value} maxBin={options.maxBin} />;
    }
    const s = extractStats(props, stats);
    if (isFilterAble(props) && props.column.canFilter) {
      const { setFilter, filterValue } = props.column;
      return <FilterBinHistogram s={s} maxBin={options.maxBin} setFilter={setFilter} filterValue={filterValue} label />;
    }
    return <Histogram s={s} maxBin={options.maxBin} label summary />;
  };
}
