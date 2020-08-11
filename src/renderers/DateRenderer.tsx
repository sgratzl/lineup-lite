import React from 'react';
import { Renderer, CellProps } from 'react-table';
import { IDateStats, DateFormatter, resolveDateFormatter } from '../math/dateStatsGenerator';
import { UseStatsColumnProps } from '../hooks/useStats';
import './DateRenderer.css';
import { resolve } from './utils';

export interface DateRendererOptions {
  format?: DateFormatter;
}

export function deriveDateOptions<D extends object, P extends CellProps<D, Date>>(
  props: P,
  options: DateRendererOptions = {}
) {
  const col = props.column as Partial<UseStatsColumnProps>;
  const stats = col.statsValue as IDateStats | undefined;
  return {
    format: resolveDateFormatter(resolve(options.format, stats?.format, () => ({}))),
  };
}

export default function DateRenderer<D extends object, P extends CellProps<D, Date>>(
  options: DateRendererOptions = {}
): Renderer<P> {
  return (props: P) => {
    const p = deriveDateOptions<D, P>(props, options);
    return <div className="lt-date">{p.format(props.value)}</div>;
  };
}
