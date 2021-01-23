import { NumberBar, NumberFormatter } from '@lineup-lite/components';
import React, { useContext } from 'react';
import type { CellProps, Renderer } from 'react-table';
import { deriveNumberOptions } from './barStats';
import { optionContext } from './utils';

export interface BarRendererOptions {
  scale?: (v: number) => number;
  color?: (v: number) => string;
  format?: NumberFormatter;
}

/**
 * Cell renderer for a number to be rendered as a a bar
 */
export function BarRenderer<D extends object, P extends CellProps<D, number>>(props: P) {
  const options = useContext(optionContext) as BarRendererOptions;
  const p = deriveNumberOptions<D, P>(props, options);
  return <NumberBar {...p} value={props.value} />;
}

/**
 * factory for rendering numbers as a bar
 */
export function BarRendererFactory<D extends object, P extends CellProps<D, number>>(
  options: BarRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <BarRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
