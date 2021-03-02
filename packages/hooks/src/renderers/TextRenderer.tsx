/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
/* eslint-disable @typescript-eslint/ban-types */

import React, { useContext } from 'react';
import type { Renderer, CellProps } from 'react-table';
import type { ITextStats } from '@lineup-lite/components';
import { TextLabel } from '@lineup-lite/components';
import type { UseStatsColumnProps } from '../hooks';
import { missingClass, optionContext, resolve } from './utils';

export interface TextRendererOptions {
  format?: (v: string) => string;
}

function deriveTextOptions<D extends object, P extends CellProps<D, string>>(
  props: P,
  options: TextRendererOptions = {}
) {
  const col = props.column as Partial<UseStatsColumnProps>;
  const stats = col.statsValue as ITextStats | undefined;
  return {
    format: resolve(options.format, stats?.format, () => (v) => v),
  };
}

export function TextRenderer<D extends object, P extends CellProps<D, string>>(props: P): JSX.Element {
  const options = useContext(optionContext) as TextRendererOptions;
  if (typeof props.value === 'string') {
    return <div className="lt-date">{props.value}</div>;
  }
  const p = deriveTextOptions<D, P>(props, options);
  return <TextLabel {...p} value={props.value} className={missingClass(props.value)} />;
}

export function TextRendererFactory<D extends object, P extends CellProps<D, string>>(
  options: TextRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <TextRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
