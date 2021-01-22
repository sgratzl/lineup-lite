import React from 'react';
import type { ITextStats } from '../math';
import type { CommonProps } from './common';
import { cslx } from './utils';

export interface TextSummaryProps extends CommonProps {
  /**
   * the stats to render
   */
  s: ITextStats;
  /**
   * the optional stats containing the unfiltered stats in case of filtering operation applied
   * to the regular one
   */
  preFilter?: ITextStats;
  /**
   * whether to render it as a summary including labels
   */
  summary?: boolean;
}

export function TextSummary(props: TextSummaryProps) {
  const s = props.s;
  return (
    <div className={cslx('lt-text-summary', !props.summary && 'lt-group', props.className)} style={props.style}>
      <span>{s.count.toLocaleString()} items</span>
      {s.unique < s.count && <span>{s.unique} unique</span>}
    </div>
  );
}

export interface FilterTextSummaryProps extends TextSummaryProps {
  /**
   * placeholder text in the input
   */
  placeholder?: (s: ITextStats) => string;

  /**
   * set the filter or null to reset it
   */
  setFilter: (value?: string) => void;
  /**
   * the current filter value
   */
  filterValue?: string;
}

export function FilterTextSummary(props: FilterTextSummaryProps) {
  const { setFilter, filterValue, s, preFilter } = props;
  const unique = `${s.count.toLocaleString()}${preFilter ? `/${preFilter.count.toLocaleString()}` : ''} items`;

  const onChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(evt.currentTarget.value || undefined);
    },
    [setFilter]
  );

  const clearFilter = React.useCallback(() => setFilter(undefined), [setFilter]);

  return (
    <div className={cslx('lt-text-summary', 'lt-summary', props.className)} data-min={unique} style={props.style}>
      <input
        value={filterValue ?? ''}
        onChange={onChange}
        placeholder={props.placeholder ? props.placeholder(s) : `Filter ${s.unique} unique items`}
        size={3}
        className="lt-text-summary-input"
      />
      {
        <button
          className="lt-text-summary-clear"
          aria-label="clear filter"
          disabled={!Boolean(filterValue)}
          onClick={clearFilter}
        >
          &times;
        </button>
      }
    </div>
  );
}
