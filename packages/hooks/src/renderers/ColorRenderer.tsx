import React from 'react';
import { CellProps, Renderer } from 'react-table';
import { BarRendererOptions } from './BarRenderer';
import { deriveNumberOptions } from './barStats';

export function ColorRenderer<D extends object, P extends CellProps<D, number>>(
  options: BarRendererOptions = {}
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
