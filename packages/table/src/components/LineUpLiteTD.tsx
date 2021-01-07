import React from 'react';
import { Cell, ColumnInstance, UseGroupByCellProps, UseResizeColumnsColumnProps } from 'react-table';
import { FullColumn, ISharedLineUpProps } from './interfaces';
import { clsx } from './utils';

export function LineUpLiteTD<D extends object>({ cell, shared }: { cell: Cell<D, any>; shared: ISharedLineUpProps }) {
  const cellTyped = (cell as unknown) as Cell<D> & UseGroupByCellProps<D>;
  const column = cellTyped.column as FullColumn<D> & ColumnInstance<D> & UseResizeColumnsColumnProps<D>;
  return (
    <div
      {...cellTyped.getCellProps({
        className: clsx('lt-td', !column.canResize && 'lt-td-support', shared.classNames?.td),
        style: shared.styles?.td,
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

export const LineUpLiteTDMemo = React.memo(LineUpLiteTD) as typeof LineUpLiteTD;
