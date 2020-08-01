import React from 'react';
import { Renderer } from "react-table";
import { numberStats, NumberStatsOptions } from '../stats/numberStats';
import { toPercent } from './utils';

export interface HistogramRendererOptions extends NumberStatsOptions {
    maxBin?: number;
}

export default function HistogramRenderer<P extends { value: readonly number[] }>(options: HistogramRendererOptions = {}): Renderer<P> {
    const stats = numberStats(options);
    return (props: P) => {
        const s = stats(props.value);
        return <div>
            {s.hist.map((h) => <div key={h.x0}>
                <div style={{ backgroundColor: h.color, height: toPercent(h.count / (options.maxBin ?? s.maxBin)) }} />
            </div>)}
        </div>
    }
}