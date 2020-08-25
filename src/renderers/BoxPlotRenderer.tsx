import React from 'react';
import { Renderer } from 'react-table';
import { numberStatsGenerator, NumberStatsOptions } from '../math';
import './BoxPlotRenderer.css';
import BoxPlot from './components/BoxPlot';
import { extractStats, isFilterAble, StatsPropsLike } from './utils';
import { FilterRangeSlider } from './components/FilterRange';

export interface BoxPlotRendererOptions extends NumberStatsOptions {}

export function BoxPlotRenderer<P extends StatsPropsLike<number>>(options: BoxPlotRendererOptions = {}): Renderer<P> {
  const stats = numberStatsGenerator(options);
  return (props: P) => {
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
      filter = <FilterRangeSlider s={s} setFilter={setFilter} filterValue={filterValue} />;
    }
    return (
      <div className="lt-boxplot lt-summary" data-min={s.format(s.min)} data-max={s.format(s.max)}>
        <BoxPlot s={s} preFilter={preFilter} className="lt-boxplot-wrapper" />
        {filter}
      </div>
    );
  };
}
