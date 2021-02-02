/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { defaultColorScale } from '../math';
import type { CommonProps } from './common';
import { clsx, toLocaleString } from './utils';

export interface HeatMap1DProps extends CommonProps {
  /**
   * the value to render
   */
  value: readonly number[];
  /**
   * optional scale to convert the number in the 0..1 range
   */
  scale?: (v: number) => number;
  /**
   * value or value to color function
   */
  color?: string | ((v: number, index: number) => string);
  /**
   * label for value to label function
   */
  format?: string | ((v: number, index: number) => string);
}

/**
 * renders a numeric 1d heatmap
 */
export function HeatMap1D(props: HeatMap1DProps) {
  return (
    <div
      className={clsx('lt-heatmap-1d', props.className)}
      style={props.style}
      title={typeof props.format === 'string' ? props.format : undefined}
    >
      {(props.value ?? []).map((v, i) => {
        const label = typeof props.format === 'function' ? props.format(v, i) : toLocaleString(v);
        const normalized = typeof props.scale === 'function' && v != null ? props.scale(v) : v;
        const color = typeof props.color === 'string' ? props.color : (props.color ?? defaultColorScale)(normalized, i);
        return (
          <div key={i} className="lt-heatmap-1d-cell" title={label} style={{ backgroundColor: color }}>
            <span aria-hidden="false">{label}</span>
          </div>
        );
      })}
    </div>
  );
}