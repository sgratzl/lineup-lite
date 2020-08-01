import React from 'react';
import { Renderer } from "react-table";
import { dateStats, DateStatsOptions } from '../stats/dateStats';
import { toPercent, extractStats } from './utils';
import { StatsProps } from '../hooks/useStats';

export interface HistogramRendererOptions extends DateStatsOptions {
    maxBin?: number;
}

export default function DateHistogramRenderer<P extends { value: readonly Date[] } | StatsProps<any>>(options: HistogramRendererOptions = {}): Renderer<P> {
    const stats = dateStats(options);
    return (props: P) => {
        const s = extractStats(props, stats);
        return <div>
            {s.hist.map((h) => <div key={h.x0.getTime()}>
                <div style={{ backgroundColor: h.color, height: toPercent(h.count / (options.maxBin ?? s.maxBin)) }} />
            </div>)}
            <span>{s.format(s.min)}</span>
            <span>{s.format(s.max)}</span>
        </div>
    }
}