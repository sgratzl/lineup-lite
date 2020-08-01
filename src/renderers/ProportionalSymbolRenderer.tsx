import React from 'react';
import { Renderer, CellProps } from "react-table";
import { BarRendererOptions } from './BarRenderer';
import { defaultScale, defaultConstantColorScale } from './defaults';
import { toPercent } from './utils';

export function proportionalSymbolProps(value: number, color: string | ((v: number) => string)): React.CSSProperties {
    const c = typeof color === 'string' ? color : color(value);
    const p = toPercent(value);
    return {
        backgroundImage: `radial-gradient(circle closest-side, ${c} ${p}, transparent ${p})`,
        backgroundPosition: 'left center',
        textAlign: 'right'
    };
}

export interface ProportionalSymbolRendererOptions extends BarRendererOptions {
}

export default function ProportionalSymbolRenderer<D extends object, P extends CellProps<D, number>>(options: ProportionalSymbolRendererOptions = {}): Renderer<P> {
    const scale = options.scale ?? defaultScale;
    const color = options.color ?? defaultConstantColorScale;
    const f = new Intl.NumberFormat(options.locales, options.format);
    return (props: P) => {
        return <div style={proportionalSymbolProps(scale(props.value), color)}>{f.format(props.value)}</div>
    }
}