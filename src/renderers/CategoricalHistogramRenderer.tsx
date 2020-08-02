import React from 'react';
import { Renderer } from "react-table";
import { StatsProps } from '../hooks/useStats';
import { categoricalStats } from '../stats/categoricalStats';
import { CategoricalRendererOptions } from './CategoricalRenderer';
import Histogram from './components/Histogram';
import { extractStats } from './utils';

export interface CategoricalHistogramRendererOptions extends CategoricalRendererOptions {
    maxBin?: number;
}

export default function CategoricalHistogramRenderer<P extends { value: readonly string[] } | StatsProps<any>>(options: CategoricalHistogramRendererOptions = {}): Renderer<P> {
    const stats = categoricalStats(options);
    return (props: P) => {
        const s = extractStats(props, stats);
        return <Histogram s={s} maxBin={options.maxBin} label />
    }
}