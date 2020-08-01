import React from 'react';
import { Renderer, CellProps } from "react-table";
import { defaultCategoricalColorScale } from './defaults';
import { ICategoricalStats } from '../stats/categoricalStats';
import { UseStatsColumnProps } from '../hooks/useStats';

export function categoricalProps(color: string): React.CSSProperties {
    return {
        borderLeft: `1.2em solid ${color}`,
        paddingLeft: '0.2em'
    };
}

export interface CategoricalRendererOptions {
    color?: ((v: string) => string);
}

export function deriveCategoricalOptions<D extends object, P extends CellProps<D, string>>(props: P, options: CategoricalRendererOptions = {}) {
    const col = (props.column as Partial<UseStatsColumnProps>);
    if (col.statsValue) {
        return col.statsValue as ICategoricalStats;
    }
    return {
        color: options.color ?? defaultCategoricalColorScale()
    };
}

export default function CategoricalRenderer<D extends object, P extends CellProps<D, string>>(options: CategoricalRendererOptions = {}): Renderer<P> {
    return (props: P) => {
        const p = deriveCategoricalOptions<D, P>(props, options);
        return <div style={categoricalProps(p.color(props.value))}>{props.value}</div>
    }
}