import React from 'react';
import type { CommonProps } from './common';
import { cslx, mergeStyles, toPercent } from './utils';

export interface NumberBarProps extends CommonProps {
  /**
   * the value to render
   */
  value: number;
  /**
   * optional scale to convert the number in the 0..1 range
   */
  scale?: (v: number) => number;
  /**
   * value or value to color function
   */
  color: string | ((v: number) => string);
  /**
   * label for value to label function
   */
  format: string | ((v: number) => string);
}

function barProps(value: number, color: string | ((v: number) => string)): React.CSSProperties {
  const c = typeof color === 'string' ? color : color(value);
  const p = toPercent(value);
  return {
    backgroundImage: `linear-gradient(to right, ${c} ${p}, transparent ${p})`,
  };
}

/**
 * renders a numeric value along with a bar
 */
export function NumberBar(props: NumberBarProps) {
  const label = typeof props.format === 'string' ? props.format : props.format(props.value);
  return (
    <div
      className={cslx('lt-bar', props.className)}
      style={mergeStyles(props.style, barProps(props.scale ? props.scale(props.value) : props.value, props.color))}
      title={label}
    >
      {label}
    </div>
  );
}
