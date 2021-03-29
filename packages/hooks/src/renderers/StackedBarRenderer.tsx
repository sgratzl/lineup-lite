/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  StackedBar,
  NumberFormatter,
  StackedValue,
  computeWeightedSumFactory,
  defaultCategoricalColorScale,
  CommonProps,
  clsx,
} from '@lineup-lite/components';
import React, { useContext } from 'react';
import type { Accessor, CellProps, Renderer } from 'react-table';
import type { AnyObject, UnknownObject } from '../interfaces';
import deriveNumberOptions from './deriveNumberOptions';
import { missingClass, optionContext } from './utils';

export function computeStackedValue<D extends AnyObject = UnknownObject>(
  stack: readonly { col: keyof D | Accessor<D>; weight: number; color?: string }[],
  colors: (v: string) => string = defaultCategoricalColorScale()
): Accessor<D> {
  const f = computeWeightedSumFactory(stack.map((s, i) => ({ color: colors(`${i}`), ...s })));
  const acc: Accessor<D>[] = stack.map((d) => (typeof d.col === 'function' ? d.col : (v) => v[d.col as keyof D]));
  return (
    originalRow: D,
    index: number,
    sub: {
      subRows: D[];
      depth: number;
      data: D[];
    }
  ) => {
    return f(acc.map((a) => a(originalRow, index, sub)));
  };
}

export interface StackedBarRendererOptions extends CommonProps {
  scale?: (v: number) => number;
  format?: NumberFormatter;
}

/**
 * Cell renderer for a number to be rendered as a a bar
 */
export function StackedBarRenderer<D extends UnknownObject, P extends CellProps<D, StackedValue>>(
  props: P
): JSX.Element {
  const options = useContext(optionContext) as StackedBarRendererOptions;
  const p = deriveNumberOptions<D, P>(props, options);
  return (
    <StackedBar
      {...p}
      value={props.value}
      style={options.style}
      className={clsx(missingClass(props.value), options.className)}
    />
  );
}

/**
 * factory for rendering numbers as a stacked bar
 */
export function StackedBarRendererFactory<D extends UnknownObject, P extends CellProps<D, StackedValue>>(
  options: StackedBarRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <StackedBarRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
