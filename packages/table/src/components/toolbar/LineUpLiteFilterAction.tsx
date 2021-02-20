/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { ComponentType, useCallback, MouseEvent, ReactNode } from 'react';
import type { UseFiltersColumnProps } from 'react-table';
import { LINEUP_LITE_I18N_EN } from '../../i18n';
import { useLineUpLiteTableContext } from '../contexts';
import { clsx } from '../utils';
import type { CommonProps } from '@lineup-lite/components';
export type { UseFiltersColumnProps } from 'react-table';

export function LineUpLiteFilterAction<D extends object = {}>(
  props: UseFiltersColumnProps<D> &
    CommonProps & {
      children?: ReactNode;
      iconFilter: ComponentType;
      toggleFilterColumn: (e: MouseEvent<HTMLElement>) => void;
    }
) {
  const { canFilter, filterValue, toggleFilterColumn } = props;
  const c = useLineUpLiteTableContext();
  const i18n = c?.i18n ?? LINEUP_LITE_I18N_EN;
  const filter = useCallback((e: MouseEvent<HTMLElement>) => toggleFilterColumn(e), [toggleFilterColumn]);
  return canFilter ? (
    <button
      className={clsx('lt-action', 'lt-action-sort', filterValue != null && 'lt-action-active', props.className)}
      style={props.style}
      type="button"
      title={i18n.filterColumn}
      onClick={filter}
    >
      <props.iconFilter />
      {props.children}
    </button>
  ) : null;
}
