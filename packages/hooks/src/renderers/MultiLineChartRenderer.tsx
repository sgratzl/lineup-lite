/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { clsx, LineChart } from '@lineup-lite/components';
import React, { useContext } from 'react';
import type { CellProps, Renderer } from 'react-table';
import type { BarRendererOptions } from '.';
import type { UnknownObject } from '..';
import deriveNumberOptions from './deriveNumberOptions';
import { missingClass, optionContext } from './utils';

export function MultiLineChartRenderer<D extends UnknownObject, P extends CellProps<D, (number | null | undefined)[]>>(
  props: P
): JSX.Element {
  const options = useContext(optionContext) as BarRendererOptions;
  const p = deriveNumberOptions<D, P>(props, options);
  return (
    <LineChart
      {...p}
      value={props.value}
      style={options.style}
      className={clsx(missingClass(props.value), options.className)}
    />
  );
}

export function MultiLineChartRendererFactory<
  D extends UnknownObject,
  P extends CellProps<D, (number | null | undefined)[]>
>(options: BarRendererOptions = {}): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <MultiLineChartRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
