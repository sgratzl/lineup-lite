import React from 'react';
import { Renderer } from "react-table";
import { categoricalStats } from '../stats/categoricalStats';
import { CategoricalRendererOptions } from './CategoricalRenderer';
import { toPercent, extractStats } from './utils';
import { StatsProps } from '../hooks/useStats';

export interface CategoricalHistogramRendererOptions extends CategoricalRendererOptions {
    maxBin?: number;
}

export default function CategoricalHistogramRenderer<P extends { value: readonly string[] } | StatsProps<any>>(options: CategoricalHistogramRendererOptions = {}): Renderer<P> {
    const stats = categoricalStats(options);
    return (props: P) => {
        const s = extractStats(props, stats);
        return <div>
            {s.hist.map((h) => <div key={h.value} data-value={h.value}>
                <div style={{ backgroundColor: h.color, height: toPercent(h.count / (options.maxBin ?? s.maxBin)) }} />
            </div>)}
        </div>
    }
}