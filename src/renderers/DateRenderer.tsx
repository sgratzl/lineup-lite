import React from 'react';
import { Renderer, CellProps } from "react-table";
import { IDateStats } from '../stats/dateStats';
import { UseStatsColumnProps } from '../hooks/useStats';

export function dateProps(): React.CSSProperties {
    return {
        textAlign: 'right'
    };
}

export interface DateRendererOptions {
    locales?: string | string[];
    format?: Intl.DateTimeFormatOptions
}

export function deriveDateOptions<D extends object, P extends CellProps<D, Date>>(props: P, options: DateRendererOptions = {}) {
    const col = (props.column as Partial<UseStatsColumnProps>);
    if (col.statsValue) {
        return col.statsValue as IDateStats;
    }
    const f = new Intl.DateTimeFormat(options.locales, options.format);
    return {
        format: f.format.bind(f)
    };
}

export default function DateRenderer<D extends object, P extends CellProps<D, Date>>(options: DateRendererOptions = {}): Renderer<P> {
    return (props: P) => {
        const p = deriveDateOptions<D, P>(props, options);
        return <div style={dateProps()}>{p.format(props.value)}</div>
    }
}