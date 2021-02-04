/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { clsx, CommonProps, mergeStyles, useI18N, toLocaleString } from '@lineup-lite/components';
import React, { forwardRef, Ref, useCallback } from 'react';
import { ActionIcons, LINEUP_LITE_TEXT_ICONS } from '../../icons';
import type { LineUpLiteState, LineUpLiteTableInstance } from '../useLineUpLite';
import { useLineUpLitePanelContext } from './contexts';

export const DATA_SUMMARY_I18N_EN = {
  dataSummary: 'Showing {0} items',
  dataSummaryFiltered: 'Showing {0} of {1} items',
  dataSummaryResetFilter: 'Click to reset all filters',
  dataSummarySelected: '{0} selected',
  dataSummaryClearSelection: 'Click to clear selection',
};

export interface LineUpLiteDataSummaryProps extends CommonProps {
  instance: LineUpLiteTableInstance<any>;
  state?: LineUpLiteState<any>;
  format?: (v: number) => string;
  icons?: Partial<Pick<ActionIcons, 'clearSelection' | 'resetFilter'>>;
}

export const LineUpLiteDataSummary = /*!#__PURE__*/ forwardRef(function LineUpLiteDataSummary(
  props: LineUpLiteDataSummaryProps,
  ref: Ref<HTMLElement>
) {
  const c = useLineUpLitePanelContext();
  const p = { c: c?.components.dataSummary ?? 'div' };
  const i18n = useI18N(DATA_SUMMARY_I18N_EN, c?.i18n);
  const format = props.format ?? toLocaleString;

  const { filteredFlatRows, toggleAllRowsSelected, setAllFilters } = props.instance;
  const unfiltered = props.instance.data.length;
  const count = filteredFlatRows?.length ?? unfiltered;
  const selected = Object.keys(props.state?.selectedRowIds ?? {}).length;

  const clearSelection = useCallback(() => toggleAllRowsSelected(false), [toggleAllRowsSelected]);
  const resetFilter = useCallback(() => setAllFilters([]), [setAllFilters]);

  const icon = {
    clear: props.icons?.clearSelection ?? LINEUP_LITE_TEXT_ICONS.clearSelection,
    reset: props.icons?.resetFilter ?? LINEUP_LITE_TEXT_ICONS.resetFilter,
  };

  return (
    <p.c
      ref={ref}
      className={clsx('lt-data-summary', c?.classNames.dataSummary, props.className)}
      style={mergeStyles(c?.styles.dataSummary, props.style)}
    >
      {setAllFilters == null ? (
        <span className="lt-data-summary-count">{i18n.dataSummary(format(count))}</span>
      ) : unfiltered > count ? (
        <button
          className="lt-data-summary-count lt-text-action"
          type="button"
          onClick={resetFilter}
          title={i18n.dataSummaryResetFilter()}
        >
          {i18n.dataSummaryFiltered(format(count), format(unfiltered))}
          <icon.reset />
        </button>
      ) : (
        <span className="lt-data-summary-count">{i18n.dataSummaryFiltered(format(count), format(unfiltered))}</span>
      )}
      {selected != null && selected > 0 && (
        <>
          {'; '}
          {toggleAllRowsSelected != null ? (
            <button
              className="lt-data-summary-selected lt-text-action"
              type="button"
              onClick={clearSelection}
              title={i18n.dataSummaryClearSelection()}
            >
              {i18n.dataSummarySelected(format(selected))}
              <icon.clear />
            </button>
          ) : (
            <span className="lt-data-summary-selected">{i18n.dataSummarySelected(format(selected))}</span>
          )}
        </>
      )}
    </p.c>
  );
});
