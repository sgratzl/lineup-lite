import React from 'react';
import { defaultColorScale } from '../math';
import type { NumberBarProps } from './NumberBar';
import { clsx, format, mergeStyles } from './utils';

/**
 * renders a numeric value along with a colored rect
 */
export function NumberColor(props: NumberBarProps) {
  const v = props.scale ? props.scale(props.value) : props.value;
  const label = format(props.value, props.format ?? ((v: number) => (v ? v.toLocaleString() : '')));
  return (
    <div
      className={clsx('lt-color', props.className)}
      style={mergeStyles(props.style, {
        borderLeftColor: typeof props.color === 'string' ? props.color : (props.color ?? defaultColorScale)(v),
      })}
      title={label}
    >
      {label}
    </div>
  );
}
