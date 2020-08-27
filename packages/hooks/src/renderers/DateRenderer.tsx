import React, { useContext } from 'react';
import { Renderer, CellProps } from 'react-table';
import { IDateStats, DateFormatter, resolveDateFormatter } from '@lineup-lite/components';
import { UseStatsColumnProps } from '../hooks';
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
