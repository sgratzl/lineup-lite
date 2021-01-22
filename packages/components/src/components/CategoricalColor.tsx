import React from 'react';
import type { CommonProps } from './common';
import { cslx, mergeStyles } from './utils';

export interface CategoricalColorProps extends CommonProps {
  /**
   * the value to render
   */
  value: string;
  /**
   * the color of the category or a function to convert the value to a color
   */
  color: string | ((v: string) => string);
  /**
   * the label of the category or a function to convert the value to a color
   */
  format?: string | ((v: string) => string);
}

export function CategoricalColor(props: CategoricalColorProps) {
  const title =
    typeof props.format === 'string' ? props.format : props.format ? props.format(props.value) : props.value;
  return (
    <div
      className={cslx('lt-categorical', props.className)}
      style={mergeStyles(props.style, {
        borderLeftColor: typeof props.color === 'string' ? props.color : props.color(props.value),
      })}
      title={title}
    >
      {title}
    </div>
  );
}
