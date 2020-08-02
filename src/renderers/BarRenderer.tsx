import React from 'react';
import { Renderer, CellProps } from 'react-table';
import { defaultConstantColorScale, defaultScale } from './defaults';
import { toPercent, resolve } from './utils';
import { UseStatsColumnProps } from '../hooks/useStats';
import { INumberStats, NumberFormatter, resolveNumberFormatter } from '../stats/numberStats';
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
  format?: NumberFormatter;
}

export function deriveNumberOptions<D extends object, P extends CellProps<D, number>>(
  props: P,
  options: BarRendererOptions = {}
) {
  const col = props.column as Partial<UseStatsColumnProps>;
  const stats = col.statsValue as INumberStats | undefined;
  return {
    scale: resolve(options.scale, stats?.scale, () => defaultScale),
    color: resolve(options.color, stats?.color, () => defaultConstantColorScale),
    format: resolveNumberFormatter(resolve(options.format, stats?.format, () => ({}))),
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
