/**
 * @lineup-lite/components
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { ChangeEvent, useCallback } from 'react';
import type { ITextStats } from '../math';
import type { CommonProps } from './common';
import { clsx, useI18N } from './utils';

export const TEXT_SUMMARY_I18N_EN = {
  textSummaryItems: '{0} items',
  textSummaryUniqueItems: '{0} unique',
  filterTextPlaceholder: 'Filter {0} unique items',
};

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

  i18n?: Partial<typeof TEXT_SUMMARY_I18N_EN>;
}

export function TextSummary(props: TextSummaryProps): JSX.Element {
  const { s } = props;
  const i18n = useI18N(TEXT_SUMMARY_I18N_EN, props.i18n);
  return (
    <div className={clsx('lt-text-summary', !props.summary && 'lt-group', props.className)} style={props.style}>
      <span>{i18n.textSummaryItems(s.count.toLocaleString())}</span>
      {s.unique < s.count && <span>{i18n.textSummaryUniqueItems(s.unique.toLocaleString())}</span>}
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

export function FilterTextSummary(props: FilterTextSummaryProps): JSX.Element {
  const { setFilter, filterValue, s, preFilter } = props;
  const unique = `${s.count.toLocaleString()}${preFilter ? `/${preFilter.count.toLocaleString()}` : ''} items`;

  const onChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      setFilter(evt.currentTarget.value || undefined);
    },
    [setFilter]
  );

  const clearFilter = useCallback(() => setFilter(undefined), [setFilter]);

  const i18n = useI18N(TEXT_SUMMARY_I18N_EN, props.i18n);
  return (
    <div
      className={clsx('lt-text-summary', 'lt-summary', props.className)}
      data-min={unique}
      style={props.style}
      data-filtered={filterValue ? 'true' : undefined}
    >
      <input
        value={filterValue ?? ''}
        onChange={onChange}
        placeholder={props.placeholder ? props.placeholder(s) : i18n.filterTextPlaceholder(s.unique.toLocaleString())}
        size={3}
        className="lt-text-summary-input"
      />
      <button
        type="button"
        className="lt-text-summary-clear"
        aria-label="clear filter"
        disabled={!filterValue}
        onClick={clearFilter}
      >
        &times;
      </button>
    </div>
  );
}
