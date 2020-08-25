import React from 'react';
import { Renderer, CellProps } from 'react-table';
import { BarRendererOptions } from './BarRenderer';
import { toPercent } from './utils';
import './ProportionalSymbolRenderer.css';
import { deriveNumberOptions } from './barStats';

function radiFromArea(area: number) {
  // r * r * PI = area
  return Math.sqrt(area);
}

function proportionalSymbolProps(value: number, color: string | ((v: number) => string)): React.CSSProperties {
  const c = typeof color === 'string' ? color : color(value);
  const p = toPercent(radiFromArea(value));
  return {
    backgroundImage: `radial-gradient(circle closest-side at 0.6em 50%, ${c} ${p}, transparent ${p})`,
  };
}

export function ProportionalSymbolRenderer<D extends object, P extends CellProps<D, number>>(
  options: BarRendererOptions = {}
): Renderer<P> {
  return (props: P) => {
    const p = deriveNumberOptions<D, P>(props, options);
    return (
      <div className="lt-proportional-symbol" style={proportionalSymbolProps(p.scale(props.value), p.color)}>
        {p.format(props.value)}
      </div>
    );
  };
}
