import React from 'react';
import { Renderer } from "react-table";
import { defaultCategoricalColorScale } from './defaults';

export function categoricalProps(color: string): React.CSSProperties {
    return {
        borderLeft: `1.2em solid ${color}`,
        paddingLeft: '0.2em'
    };
}

export interface CategoricalRendererOptions {
    color?: ((v: string) => string);
}

export default function CategoricalRenderer<P extends { value: string }>(options: CategoricalRendererOptions = {}): Renderer<P> {
    const color = options.color ?? defaultCategoricalColorScale();
    return (props: P) => {
        return <div style={categoricalProps(color(props.value))}>{props.value}</div>
    }
}