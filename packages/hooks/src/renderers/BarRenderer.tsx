import React, { useContext } from 'react';
import { CellProps, Renderer } from 'react-table';
import { NumberFormatter } from '../math';
import { deriveNumberOptions } from './barStats';
import { optionContext } from './utils';
import { NumberBar } from '../components/NumberBar';

export interface BarRendererOptions {
  scale?: (v: number) => number;
  color?: (v: number) => string;
  format?: NumberFormatter;
}

export function BarRenderer<D extends object, P extends CellProps<D, number>>(props: P) {
  const options = useContext(optionContext) as BarRendererOptions;
  const p = deriveNumberOptions<D, P>(props, options);
  return <NumberBar {...p} value={props.value} />;
}

export function BarRendererFactory<D extends object, P extends CellProps<D, number>>(
  options: BarRendererOptions = {}
): Renderer<P> {
  return (props: P) => (
    <optionContext.Provider value={options}>
      <BarRenderer<D, P> {...props} />
    </optionContext.Provider>
  );
}
