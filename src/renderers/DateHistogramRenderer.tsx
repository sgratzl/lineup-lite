import React from 'react';
import { Renderer } from "react-table";
import { StatsProps } from '../hooks/useStats';
import { dateStats, DateStatsOptions } from '../stats/dateStats';
import Histogram from './components/Histogram';
import { extractStats } from './utils';

export interface HistogramRendererOptions extends DateStatsOptions {
    maxBin?: number;
}

export default function DateHistogramRenderer<P extends { value: readonly Date[] } | StatsProps<any>>(options: HistogramRendererOptions = {}): Renderer<P> {
    const stats = dateStats(options);
    return (props: P) => {
        const s = extractStats(props, stats);
        return <Histogram s={s} maxBin={options.maxBin} />
    }
}