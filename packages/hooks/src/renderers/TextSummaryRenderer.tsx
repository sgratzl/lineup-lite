import React, { useContext } from 'react';
import { Renderer } from 'react-table';
// import { UseStatsColumnProps } from '../hooks';
import { extractStats, isFilterAble, StatsPropsLike, statsGeneratorContext, optionContext } from './utils';
import { ITextStats } from '@lineup-lite/components';
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

export function TextSummaryRenderer<P extends StatsPropsLike<string>>(props: P) {
  const options = useContext(optionContext) as TextSummaryRendererOptions;
  const stats =
    useContext<((arr: readonly string[], preFilter?: ITextStats) => ITextStats) | null>(statsGeneratorContext) ??
    textStats(options);
  const { s, preFilter, cell } = extractStats(props, stats);
  if (cell) {
    return (
      <div className="lt-text-summary lt-group">
        <span>{s.count.toLocaleString()} items</span>
        {s.unique < s.count && <span>{s.unique} unique</span>}
      </div>
    );
  }
  if (isFilterAble(props) && props.column.canFilter) {
    const { setFilter, filterValue } = props.column;
    const unique = `${s.count.toLocaleString()}${preFilter ? `/${preFilter.count.toLocaleString()}` : ''} items`;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const onChange = React.useCallback(
      (evt: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(evt.currentTarget.value || undefined);
      },
      [setFilter]
    );
    return (
      <div className="lt-text-summary lt-summary" data-min={unique}>
        <input
          value={filterValue ?? ''}
          onChange={onChange}
          placeholder={options.placeholder ? options.placeholder(s) : `Filter ${s.unique} unique items`}
          size={3}
          className="lt-text-summary-input"
        />
      </div>
    );
  }
  return (
    <div className="lt-text-summary lt-summary">
      <span>{s.count.toLocaleString()} items</span>
      {s.unique < s.count && <span>{s.unique} unique</span>}
    </div>
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
