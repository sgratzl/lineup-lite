/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, {Fragment} from 'react';
import { defaultColorScale } from '../math';
import type { CommonProps } from './common';
import type { HeatMap1DProps } from './HeatMap1D';
import { clsx, toLocaleString, toPercent } from './utils';

export interface LineChartProps extends HeatMap1DProps {
  /**
   * value line before filtering
   */
  preFilter?: readonly (number | null | undefined)[];
  /**
   * fill the line chart at the bottom
   */
  fill?: boolean;
}

const width = 100;
const height = 20;

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
      const x = (i * xScale) * width;
      const y = (1-yScale(v)) * height;
      return `${prefix}${x},${y}`;
    })
    .join('');
}

function generateArea(
  vs: readonly (number | null | undefined)[],
  xScale: number,
  yScale: (v: number) => number
): string {
  let last = -1;
  let segments: string[] = [];

  vs.forEach((v, i) => {
    if (v == null) {
      if (last >= 0) {
        // close last
        segments.push(`M${last},${height} Z`);
        last = -1;
      }
      return;
    }
    const x = width * i * xScale;
    const y = (1 - yScale(v)) * height;
    if (last < 0) {
      segments.push(`M${x},${height} L${x},${y}`);
    } else {
      segments.push(`L${x},${y}`);
    }
    last = x;
  });
  if (last >= 0) {
    segments.push(`L${last},${height} Z`);
  }
  return segments.join(' ');
}

/**
 * renders a line chart
 */
export function LineChart(props: LineChartProps): JSX.Element {
  const values = props.value ?? [];
  const xScale = 1 / (props.value.length - 1);
  const yScale = typeof props.scale === 'function' ? props.scale : (v: number) => v;
  const colorScale = typeof props.color === 'string' ? () => props.color as string : props.color ?? defaultColorScale;

  return (
    <div className={clsx('lt-line-chart', props.className)} style={props.style}>
      {typeof props.format === 'string' && <span aria-hidden="false">{props.format}</span>}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={'lt-line-chart-container'}
        preserveAspectRatio="none"
      >
        {typeof props.format === 'string' && <title>{props.format}</title>}
        {props.fill && props.preFilter && <path className="lt-line-chart-area lt-line-chart-area-pre" d={generateArea(props.preFilter, xScale, yScale)} />}
        {props.preFilter && (
          <path className="lt-line-chart-line lt-line-chart-pre" d={generateLine(props.preFilter, xScale, yScale)} />
        )}
        {props.fill && <path className="lt-line-chart-area" d={generateArea(values, xScale, yScale)} />}
        <path className="lt-line-chart-line" d={generateLine(values, xScale, yScale)} />
      </svg>
      <div className="lt-line-chart-points">
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
                left: toPercent(i * xScale),
                top: toPercent(1 - normalized)
              }}
              title={label}
            />
          );
        })}
      </div>
    </div>
  );
}

export interface MultiLineChartProps extends CommonProps {
  value: readonly (readonly (number | null | undefined)[])[];
  /**
   * optional scale to convert the number in the 0..1 range
   */
  scale?: (v: number) => number;
  /**
   * fill the line chart at the bottom
   */
  fill?: boolean;
}
/**
 * renders multiple line charts
 */
export function MultiLineChart(props: MultiLineChartProps): JSX.Element {
  const maxX = props.value.reduce((acc, v) => Math.max(acc, v ? v.length : 0), 0);
  const xScale = 1 / (maxX - 1);
  const yScale = typeof props.scale === 'function' ? props.scale : (v: number) => v;
  return (
    <div className={clsx('lt-line-chart', props.className)}
        style={props.style}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={'lt-line-chart-container'}
        preserveAspectRatio="none"
      >
        {props.value.map((vs, i) => (<Fragment key={i}>
          {props.fill && <path className="lt-line-chart-area" d={generateArea(vs ?? [], xScale, yScale)} />}
          <path className="lt-line-chart-line" d={generateLine(vs ?? [], xScale, yScale)} />
        </Fragment>))}
      </svg>
    </div>
  );
}
