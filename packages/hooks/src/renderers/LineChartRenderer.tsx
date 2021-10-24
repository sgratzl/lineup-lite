/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { clsx, LineChart } from '@lineup-lite/components';
import React, { useContext } from 'react';
import type { CellProps, Renderer } from 'react-table';
import type { BarRendererOptions } from './BarRenderer';
import type { UnknownObject } from '../types';
import deriveNumberOptions from './deriveNumberOptions';
import { missingClass, optionContext } from './utils';

export interface LineChartRendererOptions extends BarRendererOptions {
  fill?: boolean;
  gradient?: boolean;
}

export function LineChartRenderer<D extends UnknownObject, P extends CellProps<D, (number | null | undefined)[]>>(
  props: P
): JSX.Element {
  const options = useContext(optionContext) as LineChartRendererOptions;
  const p = deriveNumberOptions<D, P>(props, options);
  return (
    <LineChart
      {...p}
      value={props.value}
      fill={options.fill}
      gradient={options.gradient}
      style={options.style}
      className={clsx(missingClass(props.value), options.className)}
    />
  );
}

export function LineChartRendererFactory<
  D extends UnknownObject,
  P extends CellProps<D, (number | null | undefined)[]>
>(options: LineChartRendererOptions = {}): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <LineChartRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
