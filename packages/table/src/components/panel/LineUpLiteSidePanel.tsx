/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { forwardRef, memo, ReactElement, Ref, RefAttributes, useContext } from 'react';
import type { TableInstance } from 'react-table';
import { LineUpLiteContext } from '../contexts';
import { clsx } from '../utils';
import { LineUpLiteDataSummary } from './LineUpLiteDataSummary';

export interface LineUpLiteSidePanelProps<D extends object> {
  instance: TableInstance<D>;
  state: any;
}

const LineUpLiteSidePanelImpl = /*!#__PURE__*/ forwardRef(function LineUpLiteSidePanel<D extends object>(
  props: LineUpLiteSidePanelProps<D>,
  ref: Ref<HTMLElement>
) {
  const c = useContext(LineUpLiteContext);
  const p = { c: c?.components.sidePanel ?? 'div' };

  const count = props.instance.flatRows.length;

  return (
    <p.c ref={ref} className={clsx('lt-side-panel', c?.classNames.sidePanel)} style={c?.styles.sidePanel}>
      <LineUpLiteDataSummary count={count} i18n={c?.i18n} />
    </p.c>
  );
});

export const LineUpLiteSidePanel = LineUpLiteSidePanelImpl as <D extends object>(
  p: LineUpLiteSidePanelProps<D> & RefAttributes<HTMLElement>
) => ReactElement;

export const LineUpLiteSidePanelMemo = /*!#__PURE__*/ memo(LineUpLiteSidePanelImpl) as typeof LineUpLiteSidePanel;
