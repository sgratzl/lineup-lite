import { Histogram, ICategoricalStats, FilterSetHistogram, UpSetPartialLine } from '@lineup-lite/components';
import React, { useContext } from 'react';
import type { Renderer } from 'react-table';
import { categoricalStats } from '../stats';
import type { CategoricalRendererOptions } from './CategoricalRenderer';
import { extractStats, isFilterAble, optionContext, statsGeneratorContext, StatsPropsLike } from './utils';

export interface CategoricalSetHistogramRendererOptions extends CategoricalRendererOptions {
  maxBin?: number;
}

export function CategoricalSetHistogramRenderer<P extends StatsPropsLike<string>>(props: P) {
  const options = useContext(optionContext) as CategoricalSetHistogramRendererOptions;
  const stats =
    useContext<((arr: readonly string[], preFilter?: ICategoricalStats) => ICategoricalStats) | null>(
      statsGeneratorContext
    ) ?? categoricalStats(options);
  const { s, preFilter, cell } = extractStats(props, stats);
  if (cell) {
    const groupValue = s.hist.map((bin) => (bin.count === 0 ? false : bin.count === s.count ? true : null));
    return <UpSetPartialLine {...s} sets={s.categories} value={groupValue} i18n={props.i18n} />;
  }
  if (isFilterAble(props) && props.column.canFilter) {
    const { setFilter, filterValue } = props.column;
    return (
      <FilterSetHistogram
        s={s}
        preFilter={preFilter}
        maxBin={options.maxBin}
        setFilter={setFilter}
        filterValue={filterValue}
        label
        i18n={props.i18n}
      />
    );
  }
  return <Histogram s={s} maxBin={options.maxBin} label summary />;
}

export function CategoricalSetHistogramRendererFactory<P extends StatsPropsLike<string>>(
  options: CategoricalSetHistogramRendererOptions = {}
): Renderer<P> {
  const stats = categoricalStats(options);
  return (props: P) => (
    <statsGeneratorContext.Provider value={stats}>
      <optionContext.Provider value={options}>
        <CategoricalSetHistogramRenderer {...props} />
      </optionContext.Provider>
    </statsGeneratorContext.Provider>
  );
}
