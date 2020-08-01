import React from 'react';
import { CellProps, Renderer } from "react-table";
import { deriveNumberOptions } from './BarRenderer';

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
    return (props: P) => {
        const p = deriveNumberOptions<D, P>(props, options);
        return <div style={colorProps(p.color(p.scale(props.value)))}>{p.format(props.value)}</div>
    }
}