/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { CSSProperties } from 'react';
import { defaultScale, schemeTableau10 } from '../math';
import type { CommonProps } from './common';
import { clsx, format, mergeStyles, toLocaleString, toPercent } from './utils';

/**
 * a stacked value is a number wrapper that also contains information about its stack
 */
export interface StackedValue {
  /**
   * the stacked bar value
   */
  readonly value: number;

  /**
   * the individual ratios (percentages) and their colors
   */
  readonly stack: readonly { ratio: number; color: string }[];
  /**
   * Converts a StackedValue object to a string.
   */
  [Symbol.toPrimitive](hint: 'default'): string;
  /**
   * Converts a StackedValue object to a string.
   */
  [Symbol.toPrimitive](hint: 'string'): string;
  /**
   * Converts a StackedValue object to a number.
   */
  [Symbol.toPrimitive](hint: 'number'): number;
  /**
   * Converts a StackedValue object to a string or number.
   *
   * @param hint The strings "number", "string", or "default" to specify what primitive to return.
   *
   * @throws {TypeError} If 'hint' was given something other than "number", "string", or "default".
   * @returns A number if 'hint' was "number", a string if 'hint' was "string" or "default".
   */
  [Symbol.toPrimitive](hint: string): string | number;

  valueOf(): number;
  toString(): string;
}

function toStackedValuePrimitive(this: StackedValue, hint: 'string' | 'default'): string;
function toStackedValuePrimitive(this: StackedValue, hint: 'number'): number;
function toStackedValuePrimitive(this: StackedValue, hint: 'number' | 'string' | 'default') {
  if (hint === 'string' || hint === 'default') {
    return this.value.toString();
  }
  if (hint === 'number') {
    return this.value;
  }
  throw new TypeError('invalid hint');
}

/**
 * wraps the given information as a StackedValue
 * @param value the value of the stacked bar
 * @param stack the ratios and colors of the stacked bar
 */
export function asStackedValue(value: number, stack: readonly { ratio: number; color: string }[]): StackedValue {
  return {
    value,
    stack,
    valueOf: () => value,
    toString: () => value.toString(),
    [Symbol.toPrimitive]: toStackedValuePrimitive,
  };
}

/**
 * computes the StackedValue of the given parameters
 * @param stack the stack to compute the value
 */
export function computeWeightedSum(stack: readonly number[]): StackedValue;
export function computeWeightedSum(stack: readonly number[], colors: readonly string[]): StackedValue;
export function computeWeightedSum(
  stack: readonly { value: number; weight?: number; color?: string }[],
  colors?: readonly string[]
): StackedValue;
export function computeWeightedSum(
  stack: readonly (number | { value: number; weight?: number; color?: string })[],
  colors?: readonly string[]
): StackedValue {
  const weights = stack.map((v) => (typeof v === 'number' ? 1 : v.weight ?? 1));
  const cs = resolveColor(stack, colors);
  const weightSum = weights.reduce((acc, w) => acc + w, 0);
  const vs = stack.map((v) => (typeof v === 'number' ? v : v.value));
  const value = vs.reduce((acc, v, i) => acc + v * weights[i], 0) / weightSum;
  const ratios = stack.map((v, i) => ({
    color: cs[i],
    ratio: ((typeof v === 'number' ? v : v.value) * weights[i]) / (value * weightSum),
  }));
  return asStackedValue(value, ratios);
}

function resolveColor(stack: readonly (number | { color?: string })[], colors?: readonly string[]) {
  const cs = colors ?? schemeTableau10;
  return stack.map((v, i) => {
    if (typeof v !== 'number' && typeof v.color === 'string') {
      return v.color;
    }
    return cs[i];
  });
}

/**
 * returns a compute function for StackedValues
 * @param weights the stack to compute the value
 */
export function computeWeightedSumFactory(weights: readonly number[]): (vs: readonly number[]) => StackedValue;
export function computeWeightedSumFactory(weights: readonly number[]): (vs: readonly number[]) => StackedValue;
export function computeWeightedSumFactory(
  weights: readonly number[],
  colors: readonly string[]
): (vs: readonly number[]) => StackedValue;
export function computeWeightedSumFactory(
  stack: readonly { weight: number; color?: string }[]
): (vs: readonly number[]) => StackedValue;
export function computeWeightedSumFactory(
  stack: readonly (number | { weight: number; color?: string })[],
  colors?: readonly string[]
): (vs: readonly number[]) => StackedValue {
  const weights = stack.map((v) => (typeof v === 'number' ? v : v.weight), 0);
  const cs = resolveColor(stack, colors);
  const weightSum = weights.reduce((acc, w) => acc + w, 0);
  return (vs) => {
    const value = weights.reduce((acc, w, i) => acc + vs[i] * w, 0) / weightSum;
    const ratios = weights.map((w, i) => ({ color: cs[i], ratio: (vs[i] * w) / (value * weightSum) }));
    return asStackedValue(value, ratios);
  };
}

export interface StackedBarProps extends CommonProps {
  /**
   * optional scale to convert the number in the 0..1 range
   */
  scale?: (v: number) => number;
  /**
   * label for value to label function
   */
  format?: string | ((v: number) => string);
  /**
   * the value to render
   */
  value: StackedValue;
}

function stackedBarProps(value: number, stack: StackedValue): CSSProperties | null {
  if (value == null || Number.isNaN(value) || value <= 0) {
    return null;
  }
  const p = toPercent(value);

  const preSum = stack.stack.reduce(
    (acc, v) => {
      acc.push(acc[acc.length - 1] + v.ratio);
      return acc;
    },
    [0]
  );
  const parts = stack.stack
    .map((w, i) => {
      const pi = toPercent(preSum[i] * value);
      const pi2 = toPercent((preSum[i] + w.ratio) * value);
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
export function StackedBar(props: StackedBarProps): JSX.Element {
  const label = format(+props.value, props.format ?? toLocaleString);
  const scale = props.scale ?? defaultScale;
  return (
    <div
      className={clsx('lt-bar', props.className)}
      style={mergeStyles(props.style, stackedBarProps(scale(+props.value), props.value))}
      title={label}
    >
      {label}
    </div>
  );
}
