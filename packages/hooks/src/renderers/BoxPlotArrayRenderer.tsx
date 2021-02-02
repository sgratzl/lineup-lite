/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { BoxPlotArray, INumberStats, NumberStatsOptions } from '@lineup-lite/components';
import React, { useContext } from 'react';
import type { CellProps, Renderer } from 'react-table';
import { numberStats } from '../stats';
import { deriveStats, optionContext, statsGeneratorContext, StatsPropsLike } from './utils';

export interface BoxPlotArrayRendererOptions extends NumberStatsOptions {
  maxBin?: number;
}

export function BoxPlotArrayRenderer<P extends StatsPropsLike<number>>(props: P) {
  const options = useContext(optionContext) as BoxPlotArrayRendererOptions;
  const stats =
    useContext<((arr: readonly number[], preFilter?: INumberStats) => INumberStats) | null>(statsGeneratorContext) ??
    numberStats(options);
  const { s } = deriveStats(props, stats);
  const cellProps = (props as unknown) as CellProps<any, any>;

  return <BoxPlotArray value={cellProps.value} i18n={props.i18n} scale={s.scale} color={s.color} format={s.format} />;
}

export function BoxPlotArrayRendererFactory<P extends StatsPropsLike<number>>(
  options: BoxPlotArrayRendererOptions = {}
): Renderer<P> {
  const stats = numberStats(options);
  return (props: P) => (
    <statsGeneratorContext.Provider value={stats}>
      <optionContext.Provider value={options}>
        <BoxPlotArrayRenderer {...props} />
      </optionContext.Provider>
    </statsGeneratorContext.Provider>
  );
}