import React from 'react';
import { Renderer, CellProps } from 'react-table';
import { BarRendererOptions, deriveNumberOptions } from './BarRenderer';
import { defaultConstantColorScale } from './defaults';
import { toPercent } from './utils';
import './ProportionalSymbolRenderer.css';

export function proportionalSymbolProps(value: number, color: string | ((v: number) => string)): React.CSSProperties {
  const c = typeof color === 'string' ? color : color(value);
  const p = toPercent(value);
  return {
    backgroundImage: `radial-gradient(circle closest-side at 0.6em 50%, ${c} ${p}, transparent ${p})`,
  };
}

export interface ProportionalSymbolRendererOptions extends BarRendererOptions {}

export default function ProportionalSymbolRenderer<D extends object, P extends CellProps<D, number>>(
  options: ProportionalSymbolRendererOptions = {}
): Renderer<P> {
  return (props: P) => {
    const p = deriveNumberOptions<D, P>(props, Object.assign({ color: defaultConstantColorScale }, options));
    return (
      <div className="lt-proportional-symbol" style={proportionalSymbolProps(p.scale(props.value), p.color)}>
        {p.format(props.value)}
      </div>
    );
  };
}
