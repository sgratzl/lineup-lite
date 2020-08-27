import React, { useContext } from 'react';
import { Renderer, CellProps } from 'react-table';
import { BarRendererOptions } from './BarRenderer';
import { optionContext } from './utils';
import { deriveNumberOptions } from './barStats';
import { NumberSymbol } from '../components/NumberSymbol';

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
