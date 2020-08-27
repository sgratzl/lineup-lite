import React from 'react';
import { toPercent } from './utils';

export interface NumberBarProps {
  value: number;
  scale: (v: number) => number;
  color: (v: number) => string;
  format: (v: number) => string;
}

function barProps(value: number, color: string | ((v: number) => string)): React.CSSProperties {
  const c = typeof color === 'string' ? color : color(value);
  const p = toPercent(value);
  return {
    backgroundImage: `linear-gradient(to right, ${c} ${p}, transparent ${p})`,
  };
}

export function NumberBar(props: NumberBarProps) {
  return (
    <div className="lt-bar" style={barProps(props.scale(props.value), props.color)}>
      {props.format(props.value)}
    </div>
  );
}
