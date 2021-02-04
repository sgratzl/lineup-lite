/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { clsx, CommonProps, mergeStyles, useI18N, toLocaleString } from '@lineup-lite/components';
import React, { forwardRef, Ref, useCallback } from 'react';
import type { LineUpLiteState, LineUpLiteTableInstance } from '../useLineUpLite';
import { useLineUpLitePanelContext } from './contexts';

export const DATA_SUMMARY_I18N_EN = {
  dataSummary: 'Showing {0} items',
  dataSummaryFiltered: 'Showing {0} of {1} items',
  dataSummaryResetFilter: 'Reset Filter',
  dataSummarySelected: '{0} selected',
  dataSummaryClearSelection: 'Click to clear selection',
};

export interface LineUpLiteDataSummaryProps extends CommonProps {
  instance: LineUpLiteTableInstance<any>;
  state?: LineUpLiteState<any>;
  format?: (v: number) => string;
}

export const LineUpLiteDataSummary = /*!#__PURE__*/ forwardRef(function LineUpLiteDataSummary(
  props: LineUpLiteDataSummaryProps,
  ref: Ref<HTMLElement>
) {
  const c = useLineUpLitePanelContext();
  const p = { c: c?.components.dataSummary ?? 'div' };
  const i18n = useI18N(DATA_SUMMARY_I18N_EN, c?.i18n);
  const format = props.format ?? toLocaleString;

  const { flatRows, toggleAllRowsSelected } = props.instance;
  const count = flatRows.length;
  const unfiltered = props.instance.preFilteredFlatRows?.length;
  const selected = Object.keys(props.state?.selectedRowIds ?? {}).length;

  const clearSelection = useCallback(() => toggleAllRowsSelected(false), [toggleAllRowsSelected]);

  return (
    <p.c
      ref={ref}
      className={clsx('lt-data-summary', c?.classNames.dataSummary, props.className)}
      style={mergeStyles(c?.styles.dataSummary, props.style)}
    >
      {unfiltered == null && i18n.dataSummary(format(count))}
      {unfiltered != null && i18n.dataSummaryFiltered(format(count), format(unfiltered))}
      {selected != null && selected > 0 && (
        <>
          {'; '}
          {toggleAllRowsSelected != null ? (
            <button
              className="lt-data-summary-selected"
              type="button"
              onClick={clearSelection}
              title={i18n.dataSummaryClearSelection()}
            >
              {i18n.dataSummarySelected(format(selected))}
            </button>
          ) : (
            <span className="lt-data-summary-selected">{i18n.dataSummarySelected(format(selected))}</span>
          )}
        </>
      )}
      {/* {unfiltered != null && unfiltered > count && props.onResetFilter && (
        <button className={clsx('lt-action', 'lt-action-filter')} onClick={props.onResetFilter}>
          {i18n.dataSummaryResetFilter()}
        </button>
      )} */}
    </p.c>
  );
});
