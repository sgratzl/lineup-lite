import React from 'react';
import { Renderer } from "react-table";

export function dateProps(): React.CSSProperties {
    return {
        textAlign: 'right'
    };
}

export interface DateRendererOptions {
    locales?: string | string[];
    format?: Intl.DateTimeFormatOptions
}

export default function DateRenderer<P extends { value: Date }>(options: DateRendererOptions = {}): Renderer<P> {
    const f = new Intl.DateTimeFormat(options.locales, options.format);
    return (props: P) => {
        return <div style={dateProps()}>{f.format(props.value)}</div>
    }
}