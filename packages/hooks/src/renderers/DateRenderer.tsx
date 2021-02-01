/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useContext } from 'react';
import type { Renderer, CellProps } from 'react-table';
import { IDateStats, DateFormatter, resolveDateFormatter } from '@lineup-lite/components';
import type { UseStatsColumnProps } from '../hooks';
import { optionContext, resolve } from './utils';
import { DateLabel } from '@lineup-lite/components';

export interface DateRendererOptions {
  format?: DateFormatter;
}

function deriveDateOptions<D extends object, P extends CellProps<D, Date>>(
  props: P,
  options: DateRendererOptions = {}
) {
  const col = props.column as Partial<UseStatsColumnProps>;
  const stats = col.statsValue as IDateStats | undefined;
  return {
    format: resolveDateFormatter(resolve(options.format, stats?.format, () => ({}))),
  };
}

export function DateRenderer<D extends object, P extends CellProps<D, Date>>(props: P) {
  const options = useContext(optionContext) as DateRendererOptions;
  if (typeof props.value === 'string') {
    return <div className="lt-date">{props.value}</div>;
  }
  const p = deriveDateOptions<D, P>(props, options);
  return <DateLabel {...p} value={props.value} />;
}

export function DateRendererFactory<D extends object, P extends CellProps<D, Date>>(
  options: DateRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <DateRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
