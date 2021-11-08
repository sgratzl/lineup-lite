/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { CommonProps, ArrayAxis, ArrayAxisProps } from '@lineup-lite/components';
import React, { useContext } from 'react';
import type { Renderer } from 'react-table';
import type { StatsCellProps } from '../hooks/useStats';
import type { UnknownObject } from '../interfaces';
import { optionContext } from './utils';

export type ArrayAxisRendererOptions = ArrayAxisProps | CommonProps;

export function ArrayAxisRenderer<D extends UnknownObject, P extends StatsCellProps<D>>(props: P): JSX.Element {
  const options = useContext(optionContext) as ArrayAxisRendererOptions;

  const stats = props.column.statsValue as { depth: number };
  if ((options as ArrayAxisProps).labels == null) {
    let labels: string[] = ['0', 'N'];
    if (stats != null && typeof stats.depth === 'number') {
      labels = Array(stats.depth)
        .fill(0)
        .map((_, i) => i.toLocaleString());
    }
    return <ArrayAxis {...options} labels={labels} />;
  }

  return <ArrayAxis {...(options as ArrayAxisProps)} />;
}

export function ArrayAxisRendererFactory<D extends UnknownObject, P extends StatsCellProps<D>>(
  options: ArrayAxisRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <ArrayAxisRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
