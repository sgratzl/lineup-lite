/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { ICategoricalStats, UpSetLine, CategoricalSetValue } from '@lineup-lite/components';
import React, { useContext } from 'react';
import type { CellProps, Renderer } from 'react-table';
import type { UseStatsColumnProps } from '../hooks';
import type { UnknownObject } from '../interfaces';
import type { CategoricalRendererOptions } from './CategoricalRenderer';
import { EMPTY_ARR, generateColor, generateIdentity, missingClass, optionContext, resolve } from './utils';

export interface CategoricalSetRendererOptions extends CategoricalRendererOptions {
  categories?: readonly string[];
}

function deriveCategoricalSetOptions<D extends UnknownObject, P extends CellProps<D, CategoricalSetValue>>(
  props: P,
  options: CategoricalSetRendererOptions = {}
) {
  const col = props.column as Partial<UseStatsColumnProps>;
  const stats = col.statsValue as ICategoricalStats | undefined;
  return {
    format: resolve(options.format, stats?.format, generateIdentity),
    color: resolve(options.color, stats?.color, generateColor),
    categories: stats?.categories ?? EMPTY_ARR,
  };
}

export function CategoricalSetRenderer<D extends UnknownObject, P extends CellProps<D, CategoricalSetValue>>(
  props: P
): JSX.Element {
  const options = useContext(optionContext) as CategoricalSetRendererOptions;
  const p = deriveCategoricalSetOptions<D, P>(props, options);
  return <UpSetLine {...p} value={props.value} sets={p.categories} className={missingClass(props.value)} />;
}

export function CategoricalSetRendererFactory<D extends UnknownObject, P extends CellProps<D, CategoricalSetValue>>(
  options: CategoricalSetRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <CategoricalSetRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
