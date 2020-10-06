import React from 'react';
import { ITextStats } from '../math';
import { cslx } from './utils';

export interface TextSummaryProps {
  s: ITextStats;
  preFilter?: ITextStats;
  summary?: boolean;
}

export function TextSummary(props: TextSummaryProps) {
  const s = props.s;
  return (
    <div className={cslx('lt-text-summary', !props.summary && 'lt-group')}>
      <span>{s.count.toLocaleString()} items</span>
      {s.unique < s.count && <span>{s.unique} unique</span>}
    </div>
  );
}

export interface FilterTextSummaryProps extends TextSummaryProps {
  placeholder?: (s: ITextStats) => string;

  setFilter: (value?: string) => void;
  filterValue: string;
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
    <div className="lt-text-summary lt-summary" data-min={unique}>
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
