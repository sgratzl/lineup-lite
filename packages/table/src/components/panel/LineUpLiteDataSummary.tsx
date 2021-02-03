/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { clsx, CommonProps, mergeStyles, useI18N, toLocaleString } from '@lineup-lite/components';
import React, { forwardRef, Ref } from 'react';
import { useLineUpLiteSidePanelContext } from './contexts';

export const SIDE_PANEL_I18N_EN = {
  dataSummary: 'Showing {0} items',
  dataSummaryFiltered: 'Showing {0} of {0} items',
  dataSummaryResetFilter: 'Reset Filter',
  dataSummarySelected: '{0} selected',
};

export interface LineUpLiteDataSummaryProps extends CommonProps {
  count: number;
  unfiltered?: number;
  selected?: number;
  format?: (v: number) => string;
  onResetFilter?: () => void;
}

export const LineUpLiteDataSummary = /*!#__PURE__*/ forwardRef(function LineUpLiteDataSummary(
  props: LineUpLiteDataSummaryProps,
  ref: Ref<HTMLElement>
) {
  const c = useLineUpLiteSidePanelContext();
  const p = { c: c?.components.dataSummary ?? 'div' };
  const i18n = useI18N(SIDE_PANEL_I18N_EN, c?.i18n);
  const format = props.format ?? toLocaleString;
  return (
    <p.c
      ref={ref}
      className={clsx('lt-data-summary', c?.classNames.dataSummary, props.className)}
      style={mergeStyles(c?.styles.dataSummary, props.style)}
    >
      {props.unfiltered == null && i18n.dataSummary(format(props.count))}
      {props.unfiltered != null && i18n.dataSummaryFiltered(format(props.count), format(props.unfiltered))}
      {props.selected != null && props.selected > 0 && (
        <>
          {';'}
          <span className="lt-data-summary-selected">{i18n.dataSummarySelected(format(props.selected))}</span>
        </>
      )}
      {props.unfiltered != null && props.unfiltered > props.count && props.onResetFilter && (
        <button className={clsx('lt-action', 'lt-action-filter')} onClick={props.onResetFilter}>
          {i18n.dataSummaryResetFilter()}
        </button>
      )}
    </p.c>
  );
});
