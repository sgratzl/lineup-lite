import React from 'react';
import type { Cell, ColumnInstance, UseGroupByCellProps, UseResizeColumnsColumnProps } from 'react-table';
import type { FullColumn, ICustomizeLineUpProps } from './interfaces';
import { clsx } from './utils';

export function LineUpLiteTD<D extends object>({ cell, c }: { cell: Cell<D, any>; c: ICustomizeLineUpProps }) {
  const cellTyped = (cell as unknown) as Cell<D> & UseGroupByCellProps<D>;
  const column = cellTyped.column as FullColumn<D> & ColumnInstance<D> & UseResizeColumnsColumnProps<D>;
  return (
    <div
      {...cellTyped.getCellProps({
        className: clsx('lt-td', !column.canResize && 'lt-td-support', c.classNames?.td),
        style: c.styles?.td,
      })}
    >
      {cellTyped.isGrouped
        ? cellTyped.render(column.Group ? 'Group' : 'Cell')
        : cellTyped.isAggregated
        ? cellTyped.render('Aggregated')
        : cellTyped.render('Cell')}
    </div>
  );
}
