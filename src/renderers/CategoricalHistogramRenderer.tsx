import React from 'react';
import { Renderer } from "react-table";
import { categoricalStats } from '../stats/categoricalStats';
import { CategoricalRendererOptions } from './CategoricalRenderer';
import { toPercent } from './utils';

export function categoricalProps(color: string): React.CSSProperties {
    return {
        borderLeft: `1.2em solid ${color}`,
        paddingLeft: '0.2em'
    };
}

export interface CategoricalHistogramRendererOptions extends CategoricalRendererOptions {
    maxBin?: number;
}

export default function CategoricalHistogramRenderer<P extends { value: readonly string[] }>(options: CategoricalHistogramRendererOptions = {}): Renderer<P> {
    const stats = categoricalStats(options);
    return (props: P) => {
        const s = stats(props.value);
        return <div>
            {s.hist.map((h) => <div key={h.value} data-value={h.value}>
                <div style={{ backgroundColor: h.color, height: toPercent(h.count / (options.maxBin ?? s.maxBin)) }} />
            </div>)}
        </div>
    }
}