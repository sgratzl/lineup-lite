import React from 'react';
import { Renderer, CellProps } from "react-table";
import { interpolateBlues } from 'd3-scale-chromatic';

export function colorProps(color: string): React.CSSProperties {
    return {
        borderLeft: `1.2em solid ${color}`,
        textAlign: 'right',
        paddingLeft: '0.2em'
    };
}

export interface ColorRendererOptions {
    scale?: (v: number) => number;
    color?: ((v: number) => string);

    locales?: string | string[];
    format?: Intl.NumberFormatOptions
}

export default function ColorRenderer<D extends object, P extends CellProps<D, number>>(options: ColorRendererOptions = {}): Renderer<P> {
    const scale = options.scale ?? ((v: number) => Math.max(Math.min(v, 1), 0));
    const color = options.color ?? interpolateBlues;
    const f = new Intl.NumberFormat(options.locales, options.format);
    return (props: P) => {
        return <div style={colorProps(color(scale(props.value)))}>{f.format(props.value)}</div>
    }
}