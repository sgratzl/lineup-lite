import React from 'react';
import { Renderer, CellProps } from 'react-table';
import { defaultCategoricalColorScale, ICategoricalStats } from '../math';
import { UseStatsColumnProps } from '../hooks';
import './CategoricalRenderer.css';
import { resolve } from './utils';

export interface CategoricalRendererOptions {
  color?: (v: string) => string;
}

function deriveCategoricalOptions<D extends object, P extends CellProps<D, string>>(
  props: P,
  options: CategoricalRendererOptions = {}
) {
  const col = props.column as Partial<UseStatsColumnProps>;
  const stats = col.statsValue as ICategoricalStats | undefined;
  return {
    color: resolve(options.color, stats?.color, () => defaultCategoricalColorScale()),
  };
}

export function CategoricalRenderer<D extends object, P extends CellProps<D, string>>(
  options: CategoricalRendererOptions = {}
): Renderer<P> {
  return (props: P) => {
    const p = deriveCategoricalOptions<D, P>(props, options);
    return (
      <div className="lt-categorical" style={{ borderLeftColor: p.color(props.value) }}>
        {props.value}
      </div>
    );
  };
}
