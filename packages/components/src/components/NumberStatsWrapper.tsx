import React from 'react';
import { IHistStats } from '../math/common';
import { cslx } from './utils';

export function NumberStatsWrapper<T>(
  props: React.PropsWithChildren<{
    s: IHistStats<T> & { readonly min?: T; readonly max?: T };
    summary?: boolean;
    className?: string;
  }>
) {
  return (
    <div
      className={cslx(props.className, 'lt-summary', !props.summary && 'lt-group')}
      data-min={props.s.min != null && props.summary ? props.s.format(props.s.min) : null}
      data-max={props.s.max != null && props.summary ? props.s.format(props.s.max) : null}
    >
      {props.children}
    </div>
  );
}
