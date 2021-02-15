/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { CSSProperties } from 'react';
import { defaultScale, normalize } from '../math';
import type { CommonProps } from './common';
import { clsx, format, mergeStyles, toLocaleString, toPercent } from './utils';

export interface StackedCommonBarProps extends CommonProps {
  /**
   * optional scale to convert the number in the 0..1 range
   */
  scale?: (v: number) => number;
  /**
   * label for value to label function
   */
  format?: string | ((v: number) => string);
}

export interface StackedGivenBarProps extends StackedCommonBarProps {
  stack: readonly { weight: number; color: string }[];
  /**
   * the value to render
   */
  value: number;
}

export interface StackedComputeBarProps extends StackedCommonBarProps {
  stack: readonly { value: number; color: string }[];
}

export type StackedBarProps = StackedComputeBarProps | StackedGivenBarProps;

function isGiven(props: StackedBarProps): props is StackedGivenBarProps {
  return typeof (props as StackedGivenBarProps).value === 'number';
}

function stackedBarProps(value: number, rawValue: number, props: StackedBarProps): CSSProperties | null {
  if (value == null || Number.isNaN(value) || value <= 0) {
    return null;
  }
  const p = toPercent(value);
  const weights = isGiven(props) ? props.stack : props.stack.map((d) => ({ ...d, weight: d.value / rawValue }));

  const preSum = weights.reduce(
    (acc, v) => {
      acc.push(acc[acc.length - 1]! + v.weight);
      return acc;
    },
    [0]
  );
  const parts = weights
    .map((w, i) => {
      const pi = toPercent(preSum[i] * value);
      const pi2 = toPercent((preSum[i] + w.weight) * value);
      if (pi === pi2) {
        return '';
      }
      return i === 0 ? `${w.color} ${pi2}` : `${w.color} ${pi}, ${w.color} ${pi2}`;
    })
    .filter(Boolean)
    .join(', ');
  return {
    backgroundImage: `linear-gradient(to right, ${parts}, transparent ${p})`,
  };
}
/**
 * renders a numeric value along with a bar
 */
export function StackedBar(props: StackedBarProps) {
  const value = isGiven(props) ? props.value : props.stack.reduce((acc, v) => acc + v.value, 0);
  const label = format(value, props.format ?? toLocaleString);
  const scale = props.scale ?? (isGiven(props) ? defaultScale : normalize(0, props.stack.length));
  return (
    <div
      className={clsx('lt-bar', props.className)}
      style={mergeStyles(props.style, stackedBarProps(scale(value), value, props))}
      title={label}
    >
      {label}
    </div>
  );
}
