/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { clsx, MultiLineChart } from '@lineup-lite/components';
import React, { useContext } from 'react';
import type { CellProps, Renderer } from 'react-table';
import type { LineChartRendererOptions } from './LineChartRenderer';
import deriveNumberOptions from './deriveNumberOptions';
import { missingClass, optionContext } from './utils';
import type { UnknownObject } from '../types';

export function MultiLineChartRenderer<
  D extends UnknownObject,
  P extends CellProps<D, (number | null | undefined)[][]>
>(props: P): JSX.Element {
  const options = useContext(optionContext) as LineChartRendererOptions;
  const p = deriveNumberOptions<D, P>(props, options);
  return (
    <MultiLineChart
      {...p}
      value={props.value}
      fill={options.fill}
      gradient={options.gradient}
      style={options.style}
      className={clsx(missingClass(props.value), options.className)}
    />
  );
}

export function MultiLineChartRendererFactory<
  D extends UnknownObject,
  P extends CellProps<D, (number | null | undefined)[][]>
>(options: LineChartRendererOptions = {}): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <MultiLineChartRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
