import React from 'react';
import { NumberBarProps } from './NumberBar';
import { cslx, mergeStyles } from './utils';

/**
 * renders a numeric value along with a colored rect
 */
export function NumberColor(props: NumberBarProps) {
  const v = props.scale ? props.scale(props.value) : props.value;
  return (
    <div
      className={cslx('lt-color', props.className)}
      style={mergeStyles(props.style, {
        borderLeftColor: typeof props.color === 'string' ? props.color : props.color(v),
      })}
    >
      {typeof props.format === 'string' ? props.format : props.format(props.value)}
    </div>
  );
}
