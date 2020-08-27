import React, { useContext } from 'react';
import { Renderer, CellProps } from 'react-table';
import { BarRendererOptions } from './BarRenderer';
import { toPercent, optionContext } from './utils';
import { deriveNumberOptions } from './barStats';

function radiFromArea(area: number) {
  // r * r * PI = area
  return Math.sqrt(area);
}

function proportionalSymbolProps(value: number, color: string | ((v: number) => string)): React.CSSProperties {
  const c = typeof color === 'string' ? color : color(value);
  const v = radiFromArea(value);
  const p = toPercent(v);
  const p2 = toPercent(Math.min(1, v + 0.04));
  return {
    backgroundImage: `radial-gradient(circle closest-side at 0.6em 50%, ${c} ${p}, transparent ${p2})`,
  };
}

export function ProportionalSymbolRenderer<D extends object, P extends CellProps<D, number>>(props: P) {
  const options = useContext(optionContext) as BarRendererOptions;
  const p = deriveNumberOptions<D, P>(props, options);
  return (
    <div className="lt-proportional-symbol" style={proportionalSymbolProps(p.scale(props.value), p.color)}>
      {p.format(props.value)}
    </div>
  );
}

export function ProportionalSymbolRendererFactory<D extends object, P extends CellProps<D, number>>(
  options: BarRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <ProportionalSymbolRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
