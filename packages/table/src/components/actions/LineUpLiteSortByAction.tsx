import React, { ComponentType, useCallback, useContext, MouseEvent } from 'react';
import type { UseSortByColumnProps } from 'react-table';
import { LINEUP_LITE_I18N_EN } from '../../i18n';
import { LineUpLiteContext } from '../contexts';
import { clsx } from '../utils';

export function LineUpLiteSortByAction(
  props: UseSortByColumnProps<any> & { iconAsc: ComponentType; iconDesc: ComponentType }
) {
  const { toggleSortBy, isSorted } = props;
  const sort = useCallback(
    (e: MouseEvent<HTMLElement>) => toggleSortBy(undefined, e.shiftKey || e.ctrlKey || isSorted),
    [toggleSortBy, isSorted]
  );
  const c = useContext(LineUpLiteContext);
  const i18n = c?.i18n ?? LINEUP_LITE_I18N_EN;
  const sortBys = c?.sortByColumnCount ?? 0;
  const descFirst = (props as any).sortDescFirst as boolean;
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
          props.isSortedDesc && 'lt-action-desc'
        ),
      })}
      onClick={sort}
      data-index={props.isSorted && (c?.sortByColumnCount ?? 0) > 1 ? props.sortedIndex + 1 : null}
      title={title}
    >
      {props.isSortedDesc || (!props.isSorted && descFirst) ? <props.iconDesc /> : <props.iconAsc />}
    </button>
  ) : null;
}
