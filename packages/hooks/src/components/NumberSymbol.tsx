import React from 'react';
import { NumberBarProps } from './NumberBar';
import { toPercent } from './utils';

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

export function NumberSymbol(props: NumberBarProps) {
  return (
    <div className="lt-proportional-symbol" style={proportionalSymbolProps(props.scale(props.value), props.color)}>
      {props.format(props.value)}
    </div>
  );
}