/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useContext } from 'react';
import type { Renderer, CellProps } from 'react-table';
import { NumberSymbol } from '@lineup-lite/components';
import type { BarRendererOptions } from './BarRenderer';
import { missingClass, optionContext } from './utils';
import deriveNumberOptions from './deriveNumberOptions';
import type { UnknownObject } from '../interfaces';

export function ProportionalSymbolRenderer<D extends UnknownObject, P extends CellProps<D, number>>(
  props: P
): JSX.Element {
  const options = useContext(optionContext) as BarRendererOptions;
  const p = deriveNumberOptions<D, P>(props, options);
  return <NumberSymbol {...p} value={props.value} className={missingClass(props.value)} />;
}

export function ProportionalSymbolRendererFactory<D extends UnknownObject, P extends CellProps<D, number>>(
  options: BarRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <ProportionalSymbolRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
