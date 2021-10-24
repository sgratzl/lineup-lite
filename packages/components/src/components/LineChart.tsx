/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { defaultColorScale } from '../math';
import type { CommonProps } from './common';
import type { HeatMap1DProps } from './HeatMap1D';
import { clsx, toLocaleString, toPercent } from './utils';

export interface LineChartProps extends HeatMap1DProps {
  /**
   * value line before filtering
   */
  preFilter?: readonly (number | null | undefined)[];
}

function generateLine(
  vs: readonly (number | null | undefined)[],
  xScale: number,
  yScale: (v: number) => number
): string {
  return vs
    .map((v, i) => {
      if (v == null) {
        return '';
      }
      const prefix = i === 0 || vs[i - 1] == null ? ' M' : ' L';
      const x = i * xScale;
      const y = yScale(v);
      return `${prefix}${x},${y}`;
    })
    .join('');
}
const width = 100;
const height = 20;

/**
 * renders a line chart
 */
export function LineChart(props: LineChartProps): JSX.Element {
  const values = props.value ?? [];
  const xNorm = 1 / (props.value.length - 1);
  const xScale = width * xNorm;
  const yScale = typeof props.scale === 'function' ? props.scale : (v: number) => v;
  const colorScale = typeof props.color === 'string' ? () => props.color as string : props.color ?? defaultColorScale;

  return (
    <div className={clsx('lt-line-chart', props.className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={'lt-line-chart-container'}
        style={props.style}
        preserveAspectRatio="none"
      >
        {typeof props.format === 'string' && <title>{props.format}</title>}
        {props.preFilter && (
          <path className="lt-line-chart-line lt-line-chart-pre" d={generateLine(props.preFilter, xScale, yScale)} />
        )}
        <path className="lt-line-chart-line" d={generateLine(values, xScale, yScale)} />
      </svg>
      {values.map((v, i) => {
        if (v == null) {
          return null;
        }
        const label = typeof props.format === 'function' ? props.format(v, i) : toLocaleString(v);
        const normalized = typeof props.scale === 'function' && v != null ? props.scale(v) : v;
        const color = colorScale(normalized, i);
        return (
          <div
            key={i}
            className="lt-line-chart-point"
            style={{
              backgroundColor: color,
              transform: `translate(${toPercent(i * xNorm)},${toPercent(1 - normalized)})`,
            }}
            title={label}
          />
        );
      })}
    </div>
  );
}

export interface MultiLineChartProps extends CommonProps {
  values: readonly (readonly (number | null | undefined)[])[];
  /**
   * optional scale to convert the number in the 0..1 range
   */
  scale?: (v: number) => number;
}
/**
 * renders multiple line charts
 */
export function MultiLineChart(props: MultiLineChartProps): JSX.Element {
  const maxX = props.values.reduce((acc, v) => Math.max(acc, v ? v.length : 0), 0);
  const xNorm = 1 / (maxX - 1);
  const xScale = width * xNorm;
  const yScale = typeof props.scale === 'function' ? props.scale : (v: number) => v;
  return (
    <div className={clsx('lt-line-chart', props.className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={'lt-line-chart-container'}
        style={props.style}
        preserveAspectRatio="none"
      >
        {props.values.map((vs, i) => (
          <path key={i} className="lt-line-chart-line" d={generateLine(vs ?? {}, xScale, yScale)} />
        ))}
      </svg>
    </div>
  );
}
