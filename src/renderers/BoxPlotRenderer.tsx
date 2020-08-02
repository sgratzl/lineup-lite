import React from 'react';
import { Renderer } from 'react-table';
import { StatsProps } from '../hooks/useStats';
import { numberStats, NumberStatsOptions } from '../stats/numberStats';
import './BoxPlotRenderer.css';
import BoxPlot from './components/BoxPlot';
import { extractStats } from './utils';

export interface BoxPlotRendererOptions extends NumberStatsOptions {}

export default function BoxPlotRenderer<P extends { value: readonly number[] } | StatsProps<any>>(
  options: BoxPlotRendererOptions = {}
): Renderer<P> {
  const stats = numberStats(options);
  return (props: P) => {
    const s = extractStats(props, stats);
    return (
      <div className="lt-boxplot lt-summary" data-min={s.format(s.min)} data-max={s.format(s.max)}>
        <BoxPlot s={s} className="lt-boxplot-wrapper" />
      </div>
    );
  };
}
