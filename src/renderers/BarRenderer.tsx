import React from 'react';
import { Renderer, CellProps } from 'react-table';
import { defaultConstantColorScale, defaultScale } from './defaults';
import { toPercent } from './utils';
import { UseStatsColumnProps } from '../hooks/useStats';
import { INumberStats } from '../stats/numberStats';
import './BarRenderer.css';

export function barProps(value: number, color: string | ((v: number) => string)): React.CSSProperties {
  const c = typeof color === 'string' ? color : color(value);
  const p = toPercent(value);
  return {
    backgroundImage: `linear-gradient(to right, ${c} ${p}, transparent ${p})`,
  };
}

export interface BarRendererOptions {
  scale?: (v: number) => number;
  color?: (v: number) => string;
  locales?: string | string[];
  format?: Intl.NumberFormatOptions;
}

export function deriveNumberOptions<D extends object, P extends CellProps<D, number>>(
  props: P,
  options: BarRendererOptions = {}
) {
  const col = props.column as Partial<UseStatsColumnProps>;
  if (col.statsValue) {
    return col.statsValue as INumberStats;
  }
  const f = new Intl.NumberFormat(options.locales, options.format);
  return {
    scale: options.scale ?? defaultScale,
    color: options.color ?? defaultConstantColorScale,
    format: f.format.bind(f),
  };
}

export default function BarRenderer<D extends object, P extends CellProps<D, number>>(
  options: BarRendererOptions = {}
): Renderer<P> {
  return (props: P) => {
    const p = deriveNumberOptions<D, P>(props, options);
    return (
      <div className="lt-bar" style={barProps(p.scale(props.value), p.color)}>
        {p.format(props.value)}
      </div>
    );
  };
}
