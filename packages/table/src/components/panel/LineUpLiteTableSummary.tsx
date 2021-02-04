/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { clsx, CommonProps, mergeStyles } from '@lineup-lite/components';
import React, { forwardRef, Ref } from 'react';
import type { ActionIcons } from '../../icons';
import type { LineUpLiteState, LineUpLiteTableInstance } from '../useLineUpLite';
import { useLineUpLitePanelContext } from './contexts';

export interface LineUpLiteTableSummaryProps extends CommonProps {
  instance: LineUpLiteTableInstance<any>;
  state?: LineUpLiteState<any>;
  icons?: Partial<ActionIcons>;
}

export const LineUpLiteTableSummary = /*!#__PURE__*/ forwardRef(function LineUpLiteDataSummary(
  props: LineUpLiteTableSummaryProps,
  ref: Ref<HTMLElement>
) {
  const c = useLineUpLitePanelContext();
  const p = { c: c?.components.tableSummary ?? 'div' };

  return (
    <p.c
      ref={ref}
      className={clsx('lt-table-summary', c?.classNames.tableSummary, props.className)}
      style={mergeStyles(c?.styles.tableSummary, props.style)}
    >
      TODO
    </p.c>
  );
});
