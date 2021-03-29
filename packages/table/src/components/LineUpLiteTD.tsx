/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { forwardRef, ReactElement, ReactNode, Ref, RefAttributes } from 'react';
import type { Cell, ColumnInstance, UseGroupByCellProps, UseResizeColumnsColumnProps } from 'react-table';
import type { LineUpLiteColumn, UnknownObject, AnyObject } from '@lineup-lite/hooks';
import { clsx } from './utils';
import { useLineUpLiteTableContext } from './contexts';

export interface LineUpLiteTDProps<D extends AnyObject = UnknownObject> {
  cell: Cell<D, unknown>;
  children?: ReactNode;
}

const LineUpLiteTDImpl = /*! #__PURE__ */ forwardRef(function LineUpLiteTD<D extends AnyObject = UnknownObject>(
  { cell, children }: LineUpLiteTDProps<D>,
  ref: Ref<HTMLElement>
) {
  const cellTyped = (cell as unknown) as Cell<D> & UseGroupByCellProps<D>;
  const column = cellTyped.column as LineUpLiteColumn<D> & ColumnInstance<D> & UseResizeColumnsColumnProps<D>;
  const c = useLineUpLiteTableContext();
  const p = { c: c?.components.td ?? 'div' };
  return (
    <p.c
      ref={ref}
      {...cellTyped.getCellProps({
        className: clsx('lt-td', !column.canResize && 'lt-td-support', c?.classNames?.td, column.className),
        style: c?.styles?.td,
      })}
      data-id={column.id}
    >
      {cellTyped.isGrouped
        ? cellTyped.render(column.Group ? 'Group' : 'Cell')
        : cellTyped.isAggregated
        ? cellTyped.render(column.Aggregated ? 'Aggregated' : 'Cell')
        : cellTyped.render('Cell')}
      {children}
    </p.c>
  );
});

export const LineUpLiteTD = LineUpLiteTDImpl as <D extends AnyObject = UnknownObject>(
  p: LineUpLiteTDProps<D> & RefAttributes<HTMLElement>
) => ReactElement;
