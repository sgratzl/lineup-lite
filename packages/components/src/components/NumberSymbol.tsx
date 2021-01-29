import React from 'react';
import { defaultColorScale } from '../math';
import type { NumberBarProps } from './NumberBar';
import { clsx, format, mergeStyles, toLocaleString, toPercent } from './utils';

function radiFromArea(area: number) {
  // r * r * PI = area
  return Math.sqrt(area);
}

function proportionalSymbolProps(value: number, color: string | ((v: number) => string)): React.CSSProperties {
  const c = typeof color === 'string' ? color : color(value);
  const v = radiFromArea(value);
  const p = toPercent(v);
  const p2 = toPercent(Math.min(1, v + 0.04));
  return {
    backgroundImage: `radial-gradient(circle closest-side at 0.6em 50%, ${c} ${p}, transparent ${p2})`,
  };
}

/**
 * renders a numeric value along with a circle whose area is proportional to the value
 */
export function NumberSymbol(props: NumberBarProps) {
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
