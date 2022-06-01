/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { ComponentType, useCallback, MouseEvent, ReactNode } from 'react';
import type { ColumnInstance, UseSortByColumnProps } from 'react-table';
import type { CommonProps } from '@lineup-lite/components';
import type { UseSortingOptionsColumnProps } from '@lineup-lite/hooks';
import { LINEUP_LITE_I18N_EN } from '../../i18n';
import { useLineUpLiteTableContext } from '../contexts';
import { clsx } from '../utils';
import type { AnyObject, UnknownObject } from '../interfaces';

export type { UseSortByColumnProps } from 'react-table';

export interface CustomSortByAction<D extends AnyObject = UnknownObject> {
  (
    column: ColumnInstance<D> & UseSortByColumnProps<D> & UseSortingOptionsColumnProps,
    helper: {
      toggleSortBy(descending?: boolean, multi?: boolean): void;
    }
  ):
    | {
        handler(event: MouseEvent<HTMLElement>): void;
        children?: ReactNode;
      }
    | undefined;
}

export function LineUpLiteSortByAction<D extends AnyObject = UnknownObject>(
  props: CommonProps & {
    column: ColumnInstance<D> & UseSortByColumnProps<D>;
    children?: ReactNode;
    outerChildren?: ReactNode;
    iconAsc: ComponentType;
    iconDesc: ComponentType;
    onClick?(event: MouseEvent<HTMLElement>): void;
  }
): JSX.Element {
  const { onClick, column } = props;
  const { toggleSortBy, isSorted, isSortedDesc } = column;
  const sort = useCallback(
    (e: MouseEvent<HTMLElement>) =>
      onClick ? onClick(e) : toggleSortBy(undefined, e.shiftKey || e.ctrlKey || isSorted),
    [toggleSortBy, isSorted, onClick]
  );
  const c = useLineUpLiteTableContext();
  const i18n = c?.i18n ?? LINEUP_LITE_I18N_EN;
  const sortBys = c?.sortByColumnCount ?? 0;
  const descFirst = (props as { sortDescFirst?: boolean }).sortDescFirst ?? false;
  let title = descFirst ? i18n.sortByColumnDesc : i18n.sortByColumn;
  if (isSorted) {
    if (descFirst) {
      title = isSortedDesc ? i18n.sortByColumn : i18n.sortByRemoveColumn;
    } else {
      title = !isSortedDesc ? i18n.sortByColumn : i18n.sortByRemoveColumn;
    }
  } else if (sortBys > 0) {
    title = descFirst ? i18n.sortByAnotherColumnDesc : i18n.sortByAnotherColumn;
  }
  return column.canSort ? (
    <>
      <button
        {...column.getSortByToggleProps({
          style: props.style,
        })}
        className={clsx(
          'lt-action',
          'lt-action-sort',
          isSorted && 'lt-action-active',
          isSortedDesc && 'lt-action-desc',
          props.className
        )}
        type="button"
        onClick={sort}
        data-index={isSorted && (c?.sortByColumnCount ?? 0) > 1 ? column.sortedIndex + 1 : null}
        title={title}
      >
        {isSortedDesc || (!isSorted && descFirst) ? <props.iconDesc /> : <props.iconAsc />}
        {props.children}
      </button>
      {props.outerChildren}
    </>
  ) : (
    <>{props.outerChildren}</>
  );
}
