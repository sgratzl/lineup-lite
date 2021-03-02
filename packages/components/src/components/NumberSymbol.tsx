/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { CSSProperties } from 'react';
import { defaultColorScale } from '../math';
import type { NumberBarProps } from './NumberBar';
import { clsx, format, mergeStyles, toLocaleString, toPercent } from './utils';

export type { NumberBarProps as NumberSymbolProps } from './NumberBar';

function radiusFromArea(area: number) {
  // r * r * PI = area
  return Math.sqrt(area);
}

function proportionalSymbolProps(value: number, color: string | ((v: number) => string)): CSSProperties | null {
  const c = typeof color === 'string' ? color : color(value);
  const v = radiusFromArea(value);
  const p = toPercent(v);
  const p2 = toPercent(Math.min(1, v + 0.04));
  return value != null && !Number.isNaN(value) && value > 0
    ? {
        backgroundImage: `radial-gradient(circle closest-side at 0.6em 50%, ${c} ${p}, transparent ${p2})`,
      }
    : null;
}

/**
 * renders a numeric value along with a circle whose area is proportional to the value
 */
export function NumberSymbol(props: NumberBarProps): JSX.Element {
  const label = format(props.value, props.format ?? toLocaleString);
  return (
    <div
      className={clsx('lt-proportional-symbol', props.className)}
      style={mergeStyles(
        props.style,
        proportionalSymbolProps(props.scale ? props.scale(props.value) : props.value, props.color ?? defaultColorScale)
      )}
      title={label}
    >
      {label}
    </div>
  );
}
