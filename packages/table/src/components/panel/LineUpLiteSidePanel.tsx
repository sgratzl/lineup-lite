/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { forwardRef, ReactElement, Ref, RefAttributes } from 'react';
import type { TableInstance, UseFiltersInstanceProps } from 'react-table';
import { useLineUpLiteStateContext } from '../contexts';
import { clsx } from '../utils';
import { LineUpLiteSidePanelContextProvider } from './contexts';
import type { LineUpLiteSidePanelProps } from './interfaces';
import { LineUpLiteDataSummary } from './LineUpLiteDataSummary';

const LineUpLiteSidePanelImpl = /*!#__PURE__*/ forwardRef(function LineUpLiteSidePanel<D extends object>(
  props: LineUpLiteSidePanelProps,
  ref: Ref<HTMLElement>
) {
  const { instance, state } = useLineUpLiteStateContext<D>() ?? {};
  if (!instance) {
    return null;
  }
  const typedInstance = instance as TableInstance<D> & UseFiltersInstanceProps<D>;

  const count = typedInstance.flatRows.length;
  const unfiltered = typedInstance.preFilteredFlatRows?.length ?? count;

  console.log(state);
  const selected = Object.keys(state?.selectedRowIds ?? {}).length;

  const p = { c: props.components?.sidePanel ?? 'div' };

  return (
    <p.c ref={ref} className={clsx('lt-side-panel', props.className)} style={props.style}>
      <LineUpLiteSidePanelContextProvider instance={typedInstance} props={props}>
        <LineUpLiteDataSummary count={count} selected={selected} unfiltered={unfiltered} />
      </LineUpLiteSidePanelContextProvider>
    </p.c>
  );
});

export const LineUpLiteSidePanel = LineUpLiteSidePanelImpl as (
  p: LineUpLiteSidePanelProps & RefAttributes<HTMLElement>
) => ReactElement;
