import React from 'react';
import { Renderer, CellProps } from "react-table";
import { schemeCategory10 } from 'd3-scale-chromatic';

export function categoricalProps(value: string, color: ((v: string) => string)): React.CSSProperties {
    return {
        borderLeft: `1.2em solid ${color(value)}`,
        paddingLeft: '0.2em'
    };
}

export interface CategoricalRendererOptions {
    color?: ((v: string) => string);
}

export function autoAssignColors(colors: readonly string[]) {
    let i = 0;
    const map = new Map<string, string>();
    return (c: string) => {
        if (map.has(c)) {
            return map.get(c)!;
        }
        const color = colors[(i++) % colors.length];
        map.set(c, color);
        return color;
    }
}

export default function CategoricalRenderer<D extends object, P extends CellProps<D, string>>(options: CategoricalRendererOptions = {}): Renderer<P> {
    const color = options.color ?? autoAssignColors(schemeCategory10);
    return (props: P) => {
        return <div style={categoricalProps(props.value, color)}>{props.value}</div>
    }
}