/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useContext } from 'react';
import type { Renderer } from 'react-table';
import {
  ITextStats,
  TextSummary,
  FilterTextSummary,
  FilterTextSummaryProps,
  CommonProps,
} from '@lineup-lite/components';
import {
  extractStats,
  isFilterAble,
  StatsPropsLike,
  statsGeneratorContext,
  optionContext,
  useAsyncDebounce,
} from './utils';
import { textStats } from '../stats';

export interface TextSummaryRendererOptions extends CommonProps {
  format?: (v: string) => string;
  placeholder?: (s: ITextStats) => string;
}

// function deriveTextOptions<D extends object, P extends CellProps<D, string>>(
//   props: P,
//   options: TextSummaryRendererOptions = {}
// ) {
//   const col = props.column as Partial<UseStatsColumnProps>;
//   const stats = col.statsValue as ITextStats | undefined;
//   return {
//     format: resolve(options.format, stats?.format, () => (v: string) => (v ? v.toString() : v)),
//   };
// }

function Filtered(props: FilterTextSummaryProps) {
  const setFilter = useAsyncDebounce(props.setFilter, 10);
  return <FilterTextSummary {...props} setFilter={setFilter} i18n={props.i18n} />;
}

export function TextSummaryRenderer<P extends StatsPropsLike<string>>(props: P): JSX.Element {
  const options = useContext(optionContext) as TextSummaryRendererOptions;
  const stats =
    useContext<((arr: readonly string[], preFilter?: ITextStats) => ITextStats) | null>(statsGeneratorContext) ??
    textStats(options);
  const { s, preFilter, cell } = extractStats(props, stats);
  if (cell) {
    return (
      <TextSummary s={s} preFilter={preFilter} i18n={props.i18n} style={options.style} className={options.className} />
    );
  }
  if (isFilterAble(props) && props.column.canFilter) {
    const { setFilter, filterValue } = props.column;
    return (
      <Filtered
        s={s}
        preFilter={preFilter}
        setFilter={setFilter}
        filterValue={filterValue}
        i18n={props.i18n}
        style={options.style}
        className={options.className}
      />
    );
  }
  return (
    <TextSummary
      s={s}
      preFilter={preFilter}
      summary
      i18n={props.i18n}
      style={options.style}
      className={options.className}
    />
  );
}

export function TextSummaryRendererFactory<P extends StatsPropsLike<string>>(
  options: TextSummaryRendererOptions = {}
): Renderer<P> {
  const stats = textStats(options);
  return (props: P) => (
    <statsGeneratorContext.Provider value={stats}>
      <optionContext.Provider value={options}>
        <TextSummaryRenderer {...props} />
      </optionContext.Provider>
    </statsGeneratorContext.Provider>
  );
}
