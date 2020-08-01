import React from 'react';
import { Renderer } from "react-table";
import { StatsProps } from '../hooks/useStats';
import { numberStats, NumberStatsOptions } from '../stats/numberStats';
import { extractStats, toPercent } from './utils';

export interface NumberHistogramRendererOptions extends NumberStatsOptions {
    maxBin?: number;
}

export default function NumberHistogramRenderer<P extends { value: readonly number[] } | StatsProps<any>>(options: NumberHistogramRendererOptions = {}): Renderer<P> {
    const stats = numberStats(options);
    return (props: P) => {
        const s = extractStats(props, stats);
        return <div>
            {s.hist.map((h) => <div key={h.x0}>
                <div style={{ backgroundColor: h.color, height: toPercent(h.count / (options.maxBin ?? s.maxBin)) }} />
            </div>)}
        </div>
    }
}