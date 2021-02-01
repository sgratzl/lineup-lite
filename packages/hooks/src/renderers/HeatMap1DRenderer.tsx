/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { HeatMap1D, NumberFormatter } from '@lineup-lite/components';
import React, { useContext } from 'react';
import type { CellProps, Renderer } from 'react-table';
import { deriveNumberOptions } from './barStats';
import { optionContext } from './utils';

export interface HeatMap1DRendererOptions {
  scale?: (v: number) => number;
  color?: (v: number) => string;
  format?: NumberFormatter;
}

/**
 * Cell renderer for a number to be rendered as a a HeatMap1D
 */
export function HeatMap1DRenderer<D extends object, P extends CellProps<D, number[]>>(props: P) {
  const options = useContext(optionContext) as HeatMap1DRendererOptions;
  const p = deriveNumberOptions<D, P>(props, options);
  return <HeatMap1D {...p} value={props.value} />;
}

/**
 * factory for rendering numbers as a HeatMap1D
 */
export function HeatMap1DRendererFactory<D extends object, P extends CellProps<D, number[]>>(
  options: HeatMap1DRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <HeatMap1DRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
