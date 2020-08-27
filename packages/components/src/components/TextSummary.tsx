import React from 'react';
import { ITextStats } from '../math';

export interface TextSummaryProps extends ITextStats {
  preFilter?: ITextStats;
}

export function TextSummary(props: TextSummaryProps) {
  return (
    <div className="lt-text-summary lt-group">
      <span>{props.count.toLocaleString()} items</span>
      {props.unique < props.count && <span>{props.unique} unique</span>}
    </div>
  );
}

export interface FilterTextSummaryProps extends TextSummaryProps {
  placeholder?: (s: ITextStats) => string;

  setFilter: (value?: string) => void;
  filterValue: string;
}

export function FilterTextSummary(props: FilterTextSummaryProps) {
  const { setFilter, filterValue } = props;
  const unique = `${props.count.toLocaleString()}${
    props.preFilter ? `/${props.preFilter.count.toLocaleString()}` : ''
  } items`;
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
        placeholder={props.placeholder ? props.placeholder(props) : `Filter ${props.unique} unique items`}
        size={3}
        className="lt-text-summary-input"
      />
    </div>
  );
}
