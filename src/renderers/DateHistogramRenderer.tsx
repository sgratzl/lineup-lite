import React from 'react';
import { Renderer } from "react-table";
import { dateStats, DateStatsOptions } from '../stats/dateStats';
import { toPercent, extractStats } from './utils';
import { StatsProps } from '../hooks/useStats';
import { histWrapperStyle, histBinInnerStyle, histBinStyle, histMinSpanStyle, histMaxSpanStyle } from "./histStyles";

export interface HistogramRendererOptions extends DateStatsOptions {
    maxBin?: number;
}

export default function DateHistogramRenderer<P extends { value: readonly Date[] } | StatsProps<any>>(options: HistogramRendererOptions = {}): Renderer<P> {
    const stats = dateStats(options);
    return (props: P) => {
        const s = extractStats(props, stats);
        return <div style={histWrapperStyle}>
            {s.hist.map((h) => <div key={h.x0.getTime()} style={histBinStyle}>
                <div style={{ ...histBinInnerStyle, backgroundColor: h.color, height: toPercent(h.count / (options.maxBin ?? s.maxBin)) }} />
            </div>)}
            <span style={histMinSpanStyle} >{s.format(s.min)}</span>
            <span style={histMaxSpanStyle} >{s.format(s.max)}</span>
        </div>
    }
}