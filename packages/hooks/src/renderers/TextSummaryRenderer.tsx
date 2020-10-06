import React, { useContext } from 'react';
import { Renderer, useAsyncDebounce } from 'react-table';
// import { UseStatsColumnProps } from '../hooks';
import { extractStats, isFilterAble, StatsPropsLike, statsGeneratorContext, optionContext } from './utils';
import { ITextStats, TextSummary, FilterTextSummary, FilterTextSummaryProps } from '@lineup-lite/components';
import { textStats } from '../stats';

export interface TextSummaryRendererOptions {
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
  return <FilterTextSummary {...props} setFilter={setFilter} />;
}

export function TextSummaryRenderer<P extends StatsPropsLike<string>>(props: P) {
  const options = useContext(optionContext) as TextSummaryRendererOptions;
  const stats =
    useContext<((arr: readonly string[], preFilter?: ITextStats) => ITextStats) | null>(statsGeneratorContext) ??
    textStats(options);
  const { s, preFilter, cell } = extractStats(props, stats);
  if (cell) {
    return <TextSummary s={s} preFilter={preFilter} />;
  }
  if (isFilterAble(props) && props.column.canFilter) {
    const { setFilter, filterValue } = props.column;
    return <Filtered s={s} preFilter={preFilter} setFilter={setFilter} filterValue={filterValue} />;
  }
  return <TextSummary s={s} preFilter={preFilter} summary />;
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

export const TextGroupRenderer = TextSummaryRenderer;
export const TextGroupRendererFactory = TextSummaryRendererFactory;
