import {
  BoxPlot,
  FilterRangeBoxPlot,
  FilterRangeBoxPlotProps,
  INumberStats,
  NumberStatsOptions,
} from '@lineup-lite/components';
import React, { useContext } from 'react';
import { Renderer, useAsyncDebounce } from 'react-table';
import { numberStats } from '../stats';
import { extractStats, isFilterAble, optionContext, statsGeneratorContext, StatsPropsLike } from './utils';

export interface BoxPlotRendererOptions extends NumberStatsOptions {}

function FilterBoxPlot(props: FilterRangeBoxPlotProps) {
  const setFilter = useAsyncDebounce(props.setFilter);
  return <FilterRangeBoxPlot {...props} setFilter={setFilter} />;
}

export function BoxPlotRenderer<P extends StatsPropsLike<number>>(props: P) {
  const options = useContext(optionContext) as BoxPlotRendererOptions;
  const stats =
    useContext<((arr: readonly number[], preFilter?: INumberStats) => INumberStats) | null>(statsGeneratorContext) ??
    numberStats(options);
  const { s, preFilter, cell } = extractStats(props, stats);
  if (cell) {
    return <BoxPlot s={s} />;
  }
  if (isFilterAble(props) && props.column.canFilter) {
    const { setFilter, filterValue } = props.column;
    return <FilterBoxPlot s={s} setFilter={setFilter} filterValue={filterValue} />;
  }
  return <BoxPlot s={s} preFilter={preFilter} summary />;
}

export function BoxPlotRendererFactory<P extends StatsPropsLike<number>>(
  options: BoxPlotRendererOptions = {}
): Renderer<P> {
  const stats = numberStats(options);
  return (props: P) => (
    <statsGeneratorContext.Provider value={stats}>
      <optionContext.Provider value={options}>
        <BoxPlotRenderer {...props} />
      </optionContext.Provider>
    </statsGeneratorContext.Provider>
  );
}
