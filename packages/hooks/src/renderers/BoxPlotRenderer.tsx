import React, { useContext } from 'react';
import { Renderer } from 'react-table';
import { INumberStats, NumberStatsOptions } from '../math';
import BoxPlot from '../components/BoxPlot';
import { extractStats, isFilterAble, optionContext, statsGeneratorContext, StatsPropsLike } from './utils';
import { FilterRangeSlider } from '../components/FilterRange';
import { numberStats } from '../stats';

export interface BoxPlotRendererOptions extends NumberStatsOptions {}

export function BoxPlotRenderer<P extends StatsPropsLike<number>>(props: P) {
  const options = useContext(optionContext) as BoxPlotRendererOptions;
  const stats =
    useContext<((arr: readonly number[], preFilter?: INumberStats) => INumberStats) | null>(statsGeneratorContext) ??
    numberStats(options);
  const { s, preFilter, cell } = extractStats(props, stats);
  if (cell) {
    return (
      <div className="lt-boxplot lt-summary lt-group">
        <BoxPlot s={s} className="lt-boxplot-wrapper" />
      </div>
    );
  }
  let filter = null;
  if (isFilterAble(props) && props.column.canFilter) {
    const { setFilter, filterValue } = props.column;
    // TODO debounce filter
    filter = <FilterRangeSlider s={s} setFilter={setFilter} filterValue={filterValue} />;
  }
  return (
    <div className="lt-boxplot lt-summary" data-min={s.format(s.min)} data-max={s.format(s.max)}>
      <BoxPlot s={s} preFilter={preFilter} className="lt-boxplot-wrapper" />
      {filter}
    </div>
  );
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
