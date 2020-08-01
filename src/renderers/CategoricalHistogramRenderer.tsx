import React from 'react';
import { Renderer } from "react-table";
import { categoricalStats } from '../stats/categoricalStats';
import { CategoricalRendererOptions } from './CategoricalRenderer';
import { toPercent, extractStats } from './utils';
import { StatsProps } from '../hooks/useStats';
import { histWrapperStyle, histBinStyle, histBinInnerStyle, histBinLabelStyle } from './histStyles';

export interface CategoricalHistogramRendererOptions extends CategoricalRendererOptions {
    maxBin?: number;
}

export default function CategoricalHistogramRenderer<P extends { value: readonly string[] } | StatsProps<any>>(options: CategoricalHistogramRendererOptions = {}): Renderer<P> {
    const stats = categoricalStats(options);
    return (props: P) => {
        const s = extractStats(props, stats);
        return <div style={histWrapperStyle}>
            {s.hist.map((h) => <div key={h.value} style={histBinStyle}>
                <div style={{ ...histBinInnerStyle, backgroundColor: h.color, height: toPercent(h.count / (options.maxBin ?? s.maxBin)) }} />
                <span style={histBinLabelStyle}>{h.value}</span>
            </div>)}
        </div>
    }
}