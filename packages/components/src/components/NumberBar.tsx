/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { CSSProperties } from 'react';
import { defaultColorScale, defaultDivergingColorScale } from '../math';
import type { CommonProps } from './common';
import { clsx, format, mergeStyles, toLocaleString, toPercent } from './utils';

export interface CommonNumberProps extends CommonProps {
  /**
   * optional scale to convert the number in the 0..1 range
   */
  scale?: (v: number) => number;
  /**
   * value or value to color function
   */
  color?: string | ((v: number) => string);
  /**
   * label for value to label function
   */
  format?: string | ((v: number) => string);
}

export interface NumberBarProps extends CommonNumberProps {
  /**
   * the value to render
   */
  value: number;
}

function barProps(value: number, color: string | ((v: number) => string)): CSSProperties | null {
  if (value == null || Number.isNaN(value) || value <= 0) {
    return null;
  }
  const c = typeof color === 'string' ? color : color(value);
  if (value >= 1) {
    return {
      backgroundColor: c,
    };
  }
  const p = toPercent(value);
  return {
    backgroundImage: `linear-gradient(to right, ${c} ${p}, transparent ${p})`,
  };
}

/**
 * renders a numeric value along with a bar
 */
export function NumberBar(props: NumberBarProps): JSX.Element {
  const label = format(props.value, props.format ?? toLocaleString);
  return (
    <div
      className={clsx('lt-bar', props.className)}
      style={mergeStyles(
        props.style,
        barProps(props.scale ? props.scale(props.value) : props.value, props.color ?? defaultColorScale)
      )}
      title={label}
    >
      {label}
    </div>
  );
}

export interface DivergingNumberBarProps extends NumberBarProps {
  /**
   * @default 0.5 if no scale is given 0 otherwise
   */
  center?: number;
}

function divergingBarProps(
  center: number,
  value: number,
  color: string | ((v: number) => string)
): CSSProperties | null {
  if (value == null || Number.isNaN(value) || value === center) {
    return null;
  }
  const c = typeof color === 'string' ? color : color(value);
  const p = toPercent(value);
  const m = toPercent(center);

  if (value <= 0) {
    return {
      backgroundImage: `linear-gradient(to right, ${c} ${m}, transparent ${m})`,
    };
  }
  if (value >= 1) {
    return {
      backgroundImage: `linear-gradient(to right, transparent ${m}, ${c} ${m})`,
    };
  }
  if (value < center) {
    return {
      backgroundImage: `linear-gradient(to right, transparent ${p}, ${c} ${p}, ${c} ${m}, transparent ${m})`,
    };
  }
  // value > center
  return {
    backgroundImage: `linear-gradient(to right, transparent ${m}, ${c} ${m}, ${c} ${p}, transparent ${p})`,
  };
}

/**
 * renders a numeric value along with a diverging bar
 */
export function DivergingNumberBar(props: DivergingNumberBarProps): JSX.Element {
  const label = format(props.value, props.format ?? toLocaleString);
  return (
    <div
      className={clsx('lt-diverging-bar', props.className)}
      style={mergeStyles(
        props.style,
        divergingBarProps(
          props.scale ? props.scale(props.center ?? 0) : props.center ?? 0.5,
          props.scale ? props.scale(props.value) : props.value,
          props.color ?? defaultDivergingColorScale
        )
      )}
      title={label}
    >
      {label}
    </div>
  );
}
