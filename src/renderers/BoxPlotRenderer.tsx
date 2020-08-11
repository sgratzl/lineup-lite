import React from 'react';
import { Renderer } from 'react-table';
import { StatsProps } from '../hooks/useStats';
import { numberStatsGenerator, NumberStatsOptions } from '../math/numberStatsGenerator';
import './BoxPlotRenderer.css';
import BoxPlot from './components/BoxPlot';
import { extractStats, isFilterAble } from './utils';
import { FilterRangeSlider } from './components/FilterRange';

export interface BoxPlotRendererOptions extends NumberStatsOptions {}

export default function BoxPlotRenderer<P extends { value: readonly number[] } | StatsProps<any>>(
  options: BoxPlotRendererOptions = {}
): Renderer<P> {
  const stats = numberStatsGenerator(options);
  return (props: P) => {
    const s = extractStats(props, stats);
    let filter = null;
    if (isFilterAble(props) && props.column.canFilter) {
      const { setFilter, filterValue } = props.column;
      filter = <FilterRangeSlider s={s} setFilter={setFilter} filterValue={filterValue} />;
    }
    return (
      <div className="lt-boxplot lt-summary" data-min={s.format(s.min)} data-max={s.format(s.max)}>
        <BoxPlot s={s} className="lt-boxplot-wrapper" />
        {filter}
      </div>
    );
  };
}
