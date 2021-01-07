import React from 'react';
import { CommonProps } from './common';
import { cslx, mergeStyles } from './utils';

export interface CategoricalColorProps extends CommonProps {
  value: string;
  color: string | ((v: string) => string);
}

export function CategoricalColor(props: CategoricalColorProps) {
  return (
    <div
      className={cslx('lt-categorical', props.className)}
      style={mergeStyles(props.style, {
        borderLeftColor: typeof props.color === 'string' ? props.color : props.color(props.value),
      })}
    >
      {props.value}
    </div>
  );
}
