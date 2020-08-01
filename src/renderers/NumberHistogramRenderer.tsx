import React from 'react';
import { Renderer } from "react-table";
import { StatsProps } from '../hooks/useStats';
import { numberStats, NumberStatsOptions } from '../stats/numberStats';
import { extractStats, toPercent } from './utils';
import { histWrapperStyle, histMinSpanStyle, histMaxSpanStyle, histBinInnerStyle, histBinStyle } from './histStyles';

export interface NumberHistogramRendererOptions extends NumberStatsOptions {
    maxBin?: number;
}

export default function NumberHistogramRenderer<P extends { value: readonly number[] } | StatsProps<any>>(options: NumberHistogramRendererOptions = {}): Renderer<P> {
    const stats = numberStats(options);
    return (props: P) => {
        const s = extractStats(props, stats);
        return <div style={histWrapperStyle}>
            {s.hist.map((h) => <div key={h.x0} style={histBinStyle}>
                <div style={{ ...histBinInnerStyle, backgroundColor: h.color, height: toPercent(h.count / (options.maxBin ?? s.maxBin)) }} />
            </div>)}
            <span style={histMinSpanStyle} >{s.format(s.min)}</span>
            <span style={histMaxSpanStyle} >{s.format(s.max)}</span>
        </div>
    }
}