import React from 'react';
import { Renderer } from "react-table";
import { defaultScale, defaultColorScale } from './defaults';

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

export default function ColorRenderer<P extends { value: number }>(options: ColorRendererOptions = {}): Renderer<P> {
    const scale = options.scale ?? defaultScale;
    const color = options.color ?? defaultColorScale;
    const f = new Intl.NumberFormat(options.locales, options.format);
    return (props: P) => {
        return <div style={colorProps(color(scale(props.value)))}>{f.format(props.value)}</div>
    }
}