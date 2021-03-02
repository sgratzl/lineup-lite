/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { defaultColorScale } from '../math';
import type { NumberBarProps } from './NumberBar';
import { clsx, format, mergeStyles, toLocaleString } from './utils';

export type { NumberBarProps as NumberColorProps } from './NumberBar';
/**
 * renders a numeric value along with a colored rect
 */
export function NumberColor(props: NumberBarProps): JSX.Element {
  const v = props.scale && props.value != null && !Number.isNaN(props.value) ? props.scale(props.value) : props.value;
  const label = format(props.value, props.format ?? toLocaleString);
  return (
    <div
      className={clsx('lt-color', props.className)}
      style={mergeStyles(
        props.style,
        props.value != null &&
          !Number.isNaN(props.value) && {
            borderLeftColor: typeof props.color === 'string' ? props.color : (props.color ?? defaultColorScale)(v),
          }
      )}
      title={label}
    >
      {label}
    </div>
  );
}
