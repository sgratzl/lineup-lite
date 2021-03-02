/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import type { CommonProps } from './common';
import { clsx, format, mergeStyles } from './utils';

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

export function CategoricalColor(props: CategoricalColorProps): JSX.Element {
  const title = format(props.value, props.format);
  return (
    <div
      className={clsx('lt-categorical', props.className)}
      style={mergeStyles(
        props.style,
        props.value != null
          ? {
              borderLeftColor: typeof props.color === 'string' ? props.color : props.color(props.value),
            }
          : null
      )}
      title={title}
    >
      {title}
    </div>
  );
}
