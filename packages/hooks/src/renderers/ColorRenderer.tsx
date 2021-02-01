/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useContext } from 'react';
import type { CellProps, Renderer } from 'react-table';
import type { BarRendererOptions } from './BarRenderer';
import { deriveNumberOptions } from './barStats';
import { optionContext } from './utils';
import { NumberColor } from '@lineup-lite/components';

export function ColorRenderer<D extends object, P extends CellProps<D, number>>(props: P) {
  const options = useContext(optionContext) as BarRendererOptions;
  const p = deriveNumberOptions<D, P>(props, options);
  return <NumberColor {...p} value={props.value} />;
}

export function ColorRendererFactory<D extends object, P extends CellProps<D, number>>(
  options: BarRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <ColorRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
