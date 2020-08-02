import React from 'react';
import { Renderer } from 'react-table';
import { StatsProps } from '../hooks/useStats';
import { numberStats, NumberStatsOptions } from '../stats/numberStats';
import Histogram from './components/Histogram';
import { extractStats } from './utils';

export interface NumberHistogramRendererOptions extends NumberStatsOptions {
  maxBin?: number;
}

export default function NumberHistogramRenderer<P extends { value: readonly number[] } | StatsProps<any>>(
  options: NumberHistogramRendererOptions = {}
): Renderer<P> {
  const stats = numberStats(options);
  return (props: P) => {
    const s = extractStats(props, stats);
    return <Histogram s={s} maxBin={options.maxBin} />;
  };
}
