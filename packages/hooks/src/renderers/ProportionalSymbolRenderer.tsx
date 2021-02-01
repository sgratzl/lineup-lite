/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useContext } from 'react';
import type { Renderer, CellProps } from 'react-table';
import type { BarRendererOptions } from './BarRenderer';
import { optionContext } from './utils';
import { deriveNumberOptions } from './barStats';
import { NumberSymbol } from '@lineup-lite/components';

export function ProportionalSymbolRenderer<D extends object, P extends CellProps<D, number>>(props: P) {
  const options = useContext(optionContext) as BarRendererOptions;
  const p = deriveNumberOptions<D, P>(props, options);
  return <NumberSymbol {...p} value={props.value} />;
}

export function ProportionalSymbolRendererFactory<D extends object, P extends CellProps<D, number>>(
  options: BarRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <ProportionalSymbolRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
