/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { CSSProperties, PropsWithChildren } from 'react';
import { clsx } from './utils';

export type NumberStatsWrapperProps<T> = PropsWithChildren<{
  s: { readonly min?: T; readonly max?: T; readonly center?: T; format: (v: T) => string };
  summary?: boolean;
  className?: string;
  style?: CSSProperties;
}>;

export function NumberStatsWrapper<T>(props: NumberStatsWrapperProps<T>): JSX.Element {
  const hasCenter = props.s.center != null && props.summary;
  return (
    <div
      className={clsx(props.className, 'lt-summary', !props.summary && 'lt-group', hasCenter && 'lt-summary-center')}
      data-min={props.s.min != null && props.summary ? props.s.format(props.s.min) : null}
      data-max={props.s.max != null && props.summary ? props.s.format(props.s.max) : null}
      style={props.style}
    >
      {hasCenter && props.s.center != null && <div className="lt-summary-center">{props.s.format(props.s.center)}</div>}
      {props.children}
    </div>
  );
}
