import React from 'react';
import { Renderer, CellProps } from 'react-table';
import { UseStatsColumnProps, StatsProps } from '../hooks/useStats';
import './TextSummaryRenderer.css';
import './components/Summary.css';
import { resolve, extractStats, isFilterAble } from './utils';
import { ITextStats } from '../math/textStatsGenerator';
import { textStats } from '../stats/textStats';

export interface TextSummaryRendererOptions {
  format?: (v: string) => string;
}

export function deriveTextOptions<D extends object, P extends CellProps<D, string>>(
  props: P,
  options: TextSummaryRendererOptions = {}
) {
  const col = props.column as Partial<UseStatsColumnProps>;
  const stats = col.statsValue as ITextStats | undefined;
  return {
    format: resolve(options.format, stats?.format, () => (v: string) => (v ? v.toString() : v)),
  };
}

export default function TextSummaryRenderer<P extends { value: readonly string[] } | StatsProps<any>>(
  options: TextSummaryRendererOptions = {}
): Renderer<P> {
  const stats = textStats(options);
  return (props: P) => {
    const s = extractStats(props, stats);
    if (isFilterAble(props) && props.column.canFilter) {
      const { setFilter, filterValue } = props.column;
      const unique = `${s.count.toLocaleString()}${s.preFilter ? `/${s.preFilter.count.toLocaleString()}` : ''} items`;
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
            placeholder="Filter"
            size={3}
            className="lt-text-summary-input"
          />
        </div>
      );
    }
    return (
      <div className="lt-text-summary lt-summary" data-min={`${s.count.toLocaleString()} items`}>
        Summary
      </div>
    );
  };
}
