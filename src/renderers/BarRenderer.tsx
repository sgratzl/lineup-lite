import React from 'react';
import { Renderer, CellProps } from "react-table";
import { defaultScale, defaultColorScale, defaultConstantColorScale } from './defaults';
import { toPercent } from './utils';

export function barProps(value: number, color: string | ((v: number) => string)): React.CSSProperties {
    const c = typeof color === 'string' ? color : color(value);
    const p = toPercent(value);
    return {
        backgroundImage: `linear-gradient(to right, ${c} ${p}, transparent ${p})`,
        textAlign: 'right'
    };
}

export interface BarRendererOptions {
    scale?: (v: number) => number;
    color?: (v: number) => string;
    locales?: string | string[];
    format?: Intl.NumberFormatOptions
}

export default function BarRenderer<D extends object, P extends CellProps<D, number>>(options: BarRendererOptions = {}): Renderer<P> {
    const scale = options.scale ?? defaultScale;
    const color = options.color ?? defaultConstantColorScale;
    const f = new Intl.NumberFormat(options.locales, options.format);
    return (props: P) => {
        return <div style={barProps(scale(props.value), color)}>{f.format(props.value)}</div>
    }
}