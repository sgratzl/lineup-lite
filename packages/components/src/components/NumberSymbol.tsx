import React from 'react';
import { NumberBarProps } from './NumberBar';
import { cslx, mergeStyles, toPercent } from './utils';

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
  return (
    <div
      className={cslx('lt-proportional-symbol', props.className)}
      style={mergeStyles(
        props.style,
        proportionalSymbolProps(props.scale ? props.scale(props.value) : props.value, props.color)
      )}
    >
      {typeof props.format === 'string' ? props.format : props.format(props.value)}
    </div>
  );
}
