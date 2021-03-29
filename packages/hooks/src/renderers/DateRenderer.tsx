/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useContext } from 'react';
import type { Renderer, CellProps } from 'react-table';
import { IDateStats, DateFormatter, resolveDateFormatter, DateLabel, CommonProps, clsx } from '@lineup-lite/components';
import type { UseStatsColumnProps } from '../hooks';
import { missingClass, optionContext, resolve } from './utils';
import type { UnknownObject } from '../interfaces';

export interface DateRendererOptions extends CommonProps {
  format?: DateFormatter;
}

function deriveDateOptions<D extends UnknownObject, P extends CellProps<D, Date>>(
  props: P,
  options: DateRendererOptions = {}
) {
  const col = props.column as Partial<UseStatsColumnProps>;
  const stats = col.statsValue as IDateStats | undefined;
  return {
    format: resolveDateFormatter(resolve(options.format, stats?.format, () => ({}))),
  };
}

export function DateRenderer<D extends UnknownObject, P extends CellProps<D, Date>>(props: P): JSX.Element {
  const options = useContext(optionContext) as DateRendererOptions;
  if (typeof props.value === 'string') {
    return (
      <div className={clsx('lt-date', options.className)} style={options.style}>
        {props.value}
      </div>
    );
  }
  const p = deriveDateOptions<D, P>(props, options);
  return (
    <DateLabel
      {...p}
      value={props.value}
      style={options.style}
      className={clsx(missingClass(props.value), options.className)}
    />
  );
}

export function DateRendererFactory<D extends UnknownObject, P extends CellProps<D, Date>>(
  options: DateRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <DateRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
