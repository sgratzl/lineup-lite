/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { forwardRef, ReactElement, Ref, RefAttributes, useMemo } from 'react';
import { LINEUP_LITE_TEXT_ICONS } from '../../icons';
import { useLineUpLiteStateContext } from '../contexts';
import { clsx } from '../utils';
import { LineUpLitePanelContextProvider } from './contexts';
import type { LineUpLitePanelProps } from './interfaces';
import { LineUpLiteDataSummary } from './LineUpLiteDataSummary';
import { LineUpLiteTableSummary } from './LineUpLiteTableSummary';

const LineUpLitePanelImpl = /*!#__PURE__*/ forwardRef(function LineUpLitePanel<D extends object>(
  props: LineUpLitePanelProps<D>,
  ref: Ref<HTMLElement>
) {
  const { instance, state } = useLineUpLiteStateContext<D>() ?? {};

  const p = { c: props.components?.panel ?? 'div' };

  const pIcons = props.icons;
  const icons = useMemo(
    () => ({
      ...LINEUP_LITE_TEXT_ICONS,
      ...(pIcons ?? {}),
    }),
    [pIcons]
  );

  if (!instance) {
    return null;
  }

  return (
    <p.c
      ref={ref}
      className={clsx('lt-panel', 'lt-colors', props.dark && 'lt-dark', props.className)}
      style={props.style}
    >
      <LineUpLitePanelContextProvider instance={instance} props={props}>
        <LineUpLiteDataSummary instance={instance} state={state} icons={icons} />
        <LineUpLiteTableSummary instance={instance} state={state} icons={icons} />
      </LineUpLitePanelContextProvider>
    </p.c>
  );
});

export const LineUpLitePanel = LineUpLitePanelImpl as <D extends object = {}>(
  p: LineUpLitePanelProps<D> & RefAttributes<HTMLElement>
) => ReactElement;
