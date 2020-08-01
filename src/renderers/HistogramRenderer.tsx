import React from 'react';
import { Renderer } from "react-table";
import { numberStats, NumberStatsOptions } from '../stats/numberStats';
import { toPercent } from './utils';

export function barProps(value: number, color: string | ((v: number) => string)): React.CSSProperties {
    const c = typeof color === 'string' ? color : color(value);
    const p = toPercent(value);
    return {
        backgroundImage: `linear-gradient(to right, ${c} ${p}, transparent ${p})`,
        textAlign: 'right'
    };
}

export interface HistogramRendererOptions extends NumberStatsOptions {
    maxBin?: number;
}

export default function HistogramRenderer<P extends { value: readonly number[] }>(options: HistogramRendererOptions = {}): Renderer<P> {
    const stats = numberStats(options);
    return (props: P) => {
        const s = stats(props.value);
        return <div>
            {s.hist.map((h) => <div key={h.x0} data-value={`${h.x0}`}>
                <div style={{ backgroundColor: h.color, height: toPercent(h.count / (options.maxBin ?? s.maxBin)) }} />
            </div>)}
        </div>
    }
}