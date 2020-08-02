import React from 'react';
import { CellProps, Renderer } from 'react-table';
import { deriveNumberOptions } from './BarRenderer';
import './ColorRenderer.css';

export interface ColorRendererOptions {
  scale?: (v: number) => number;
  color?: (v: number) => string;

  locales?: string | string[];
  format?: Intl.NumberFormatOptions;
}

export default function ColorRenderer<D extends object, P extends CellProps<D, number>>(
  options: ColorRendererOptions = {}
): Renderer<P> {
  return (props: P) => {
    const p = deriveNumberOptions<D, P>(props, options);
    return (
      <div className="lt-color" style={{ borderLeftColor: p.color(p.scale(props.value)) }}>
        {p.format(props.value)}
      </div>
    );
  };
}
