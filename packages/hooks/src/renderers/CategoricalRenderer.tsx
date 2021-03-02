/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { CategoricalColor, ICategoricalStats } from '@lineup-lite/components';
import React, { useContext } from 'react';
import type { CellProps, Renderer } from 'react-table';
import type { UseStatsColumnProps } from '../hooks';
import type { UnknownObject } from '../interfaces';
import { generateColor, generateIdentity, missingClass, optionContext, resolve } from './utils';

export interface CategoricalRendererOptions {
  color?: (v: string) => string;
  format?: (v: string) => string;
}

function deriveCategoricalOptions<D extends UnknownObject, P extends CellProps<D, string>>(
  props: P,
  options: CategoricalRendererOptions = {}
) {
  const col = props.column as Partial<UseStatsColumnProps>;
  const stats = col.statsValue as ICategoricalStats | undefined;
  return {
    format: resolve(options.format, stats?.format, generateIdentity),
    color: resolve(options.color, stats?.color, generateColor),
  };
}

export function CategoricalRenderer<D extends UnknownObject, P extends CellProps<D, string>>(props: P): JSX.Element {
  const options = useContext(optionContext) as CategoricalRendererOptions;
  const p = deriveCategoricalOptions<D, P>(props, options);
  return <CategoricalColor {...p} value={props.value} className={missingClass(props.value)} />;
}

export function CategoricalRendererFactory<D extends UnknownObject, P extends CellProps<D, string>>(
  options: CategoricalRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <CategoricalRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
