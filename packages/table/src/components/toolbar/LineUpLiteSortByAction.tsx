/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { ComponentType, useCallback, MouseEvent, ReactNode } from 'react';
import type { UseSortByColumnProps } from 'react-table';
import type { CommonProps } from '@lineup-lite/components';
import { LINEUP_LITE_I18N_EN } from '../../i18n';
import { useLineUpLiteTableContext } from '../contexts';
import { clsx } from '../utils';
import type { UnknownObject } from '../interfaces';

export type { UseSortByColumnProps } from 'react-table';

export function LineUpLiteSortByAction<D extends UnknownObject = UnknownObject>(
  props: UseSortByColumnProps<D> &
    CommonProps & {
      children?: ReactNode;
      iconAsc: ComponentType;
      iconDesc: ComponentType;
    }
): JSX.Element {
  const { toggleSortBy, isSorted } = props;
  const sort = useCallback(
    (e: MouseEvent<HTMLElement>) => toggleSortBy(undefined, e.shiftKey || e.ctrlKey || isSorted),
    [toggleSortBy, isSorted]
  );
  const c = useLineUpLiteTableContext();
  const i18n = c?.i18n ?? LINEUP_LITE_I18N_EN;
  const sortBys = c?.sortByColumnCount ?? 0;
  const descFirst = (props as { sortDescFirst?: boolean }).sortDescFirst ?? false;
  let title = descFirst ? i18n.sortByColumnDesc : i18n.sortByColumn;
  if (props.isSorted) {
    if (descFirst) {
      title = props.isSortedDesc ? i18n.sortByColumn : i18n.sortByRemoveColumn;
    } else {
      title = !props.isSortedDesc ? i18n.sortByColumn : i18n.sortByRemoveColumn;
    }
  } else if (sortBys > 0) {
    title = descFirst ? i18n.sortByAnotherColumnDesc : i18n.sortByAnotherColumn;
  }
  return props.canSort ? (
    <button
      {...props.getSortByToggleProps({
        className: clsx(
          'lt-action',
          'lt-action-sort',
          props.isSorted && 'lt-action-active',
          props.isSortedDesc && 'lt-action-desc',
          props.className
        ),
        style: props.style,
      })}
      type="button"
      onClick={sort}
      data-index={props.isSorted && (c?.sortByColumnCount ?? 0) > 1 ? props.sortedIndex + 1 : null}
      title={title}
    >
      {props.isSortedDesc || (!props.isSorted && descFirst) ? <props.iconDesc /> : <props.iconAsc />}
      {props.children}
    </button>
  ) : (
    <></>
  );
}
