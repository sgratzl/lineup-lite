import React from 'react';
import { Renderer } from "react-table";
import { dateStats, DateStatsOptions } from '../stats/dateStats';
import { toPercent } from './utils';

export interface HistogramRendererOptions extends DateStatsOptions {
    maxBin?: number;
}

export default function DateHistogramRenderer<P extends { value: readonly Date[] }>(options: HistogramRendererOptions = {}): Renderer<P> {
    const stats = dateStats(options);
    return (props: P) => {
        const s = stats(props.value);
        return <div>
            {s.hist.map((h) => <div key={h.x0.getTime()} data-value={`${h.x0}`}>
                <div style={{ backgroundColor: h.color, height: toPercent(h.count / (options.maxBin ?? s.maxBin)) }} />
            </div>)}
            <span>{s.format(s.min)}</span>
            <span>{s.format(s.max)}</span>
        </div>
    }
}