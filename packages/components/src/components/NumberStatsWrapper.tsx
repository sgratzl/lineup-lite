/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { CSSProperties, PropsWithChildren } from 'react';
import { clsx } from './utils';

export type NumberStatsWrapperProps<T> = PropsWithChildren<{
  s: { readonly min?: T; readonly max?: T; format: (v: T) => string };
  summary?: boolean;
  className?: string;
  style?: CSSProperties;
}>;

export function NumberStatsWrapper<T>(props: NumberStatsWrapperProps<T>): JSX.Element {
  return (
    <div
      className={clsx(props.className, 'lt-summary', !props.summary && 'lt-group')}
      data-min={props.s.min != null && props.summary ? props.s.format(props.s.min) : null}
      data-max={props.s.max != null && props.summary ? props.s.format(props.s.max) : null}
      style={props.style}
    >
      {props.children}
    </div>
  );
}
