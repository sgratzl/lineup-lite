import React, { useContext } from 'react';
import { CellProps, Renderer } from 'react-table';
import { NumberFormatter } from '../math';
import { deriveNumberOptions } from './barStats';
import { optionContext, toPercent } from './utils';

function barProps(value: number, color: string | ((v: number) => string)): React.CSSProperties {
  const c = typeof color === 'string' ? color : color(value);
  const p = toPercent(value);
  return {
    backgroundImage: `linear-gradient(to right, ${c} ${p}, transparent ${p})`,
  };
}

export interface BarRendererOptions {
  scale?: (v: number) => number;
  color?: (v: number) => string;
  format?: NumberFormatter;
}

export function BarRenderer<D extends object, P extends CellProps<D, number>>(props: P) {
  const options = useContext(optionContext) as BarRendererOptions;
  const p = deriveNumberOptions<D, P>(props, options);
  return (
    <div className="lt-bar" style={barProps(p.scale(props.value), p.color)}>
      {p.format(props.value)}
    </div>
  );
}

export function BarRendererFactory<D extends object, P extends CellProps<D, number>>(
  options: BarRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <BarRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
