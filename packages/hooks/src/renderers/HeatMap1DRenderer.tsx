/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { HeatMap1D, NumberFormatter, clsx, CommonProps } from '@lineup-lite/components';
import React, { useContext } from 'react';
import type { CellProps, Renderer } from 'react-table';
import type { UnknownObject } from '../interfaces';
import deriveNumberOptions from './deriveNumberOptions';
import { missingClass, optionContext } from './utils';

export interface HeatMap1DRendererOptions extends CommonProps {
  scale?: (v: number) => number;
  color?: (v: number) => string;
  format?: NumberFormatter;
}

/**
 * Cell renderer for a number to be rendered as a a HeatMap1D
 */
export function HeatMap1DRenderer<D extends UnknownObject, P extends CellProps<D, number[]>>(props: P): JSX.Element {
  const options = useContext(optionContext) as HeatMap1DRendererOptions;
  const p = deriveNumberOptions<D, P>(props, options);
  return (
    <HeatMap1D
      {...p}
      value={props.value}
      style={options.style}
      className={clsx(missingClass(props.value), options.className)}
    />
  );
}

/**
 * factory for rendering numbers as a HeatMap1D
 */
export function HeatMap1DRendererFactory<D extends UnknownObject, P extends CellProps<D, number[]>>(
  options: HeatMap1DRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <HeatMap1DRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
