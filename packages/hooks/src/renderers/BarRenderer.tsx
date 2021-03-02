/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { NumberBar, NumberFormatter } from '@lineup-lite/components';
import React, { useContext } from 'react';
import type { CellProps, Renderer } from 'react-table';
import type { UnknownObject } from '../interfaces';
import deriveNumberOptions from './deriveNumberOptions';
import { missingClass, optionContext } from './utils';

export interface BarRendererOptions {
  scale?: (v: number) => number;
  color?: (v: number) => string;
  format?: NumberFormatter;
}

/**
 * Cell renderer for a number to be rendered as a a bar
 */
export function BarRenderer<D extends UnknownObject, P extends CellProps<D, number>>(props: P): JSX.Element {
  const options = useContext(optionContext) as BarRendererOptions;
  const p = deriveNumberOptions<D, P>(props, options);
  return <NumberBar {...p} value={props.value} className={missingClass(props.value)} />;
}

/**
 * factory for rendering numbers as a bar
 */
export function BarRendererFactory<D extends UnknownObject, P extends CellProps<D, number>>(
  options: BarRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <BarRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
