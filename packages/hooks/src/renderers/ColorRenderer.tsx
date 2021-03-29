/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useContext } from 'react';
import type { CellProps, Renderer } from 'react-table';
import { NumberColor, clsx } from '@lineup-lite/components';
import type { BarRendererOptions } from './BarRenderer';
import deriveNumberOptions from './deriveNumberOptions';
import { missingClass, optionContext } from './utils';
import type { UnknownObject } from '../interfaces';

export function ColorRenderer<D extends UnknownObject, P extends CellProps<D, number>>(props: P): JSX.Element {
  const options = useContext(optionContext) as BarRendererOptions;
  const p = deriveNumberOptions<D, P>(props, options);
  return (
    <NumberColor
      {...p}
      value={props.value}
      style={options.style}
      className={clsx(missingClass(props.value), options.className)}
    />
  );
}

export function ColorRendererFactory<D extends UnknownObject, P extends CellProps<D, number>>(
  options: BarRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <ColorRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
