import React, { useContext } from 'react';
import type { Cell, ColumnInstance, UseGroupByCellProps, UseResizeColumnsColumnProps } from 'react-table';
import type { LineUpLiteColumn } from '@lineup-lite/hooks';
import { clsx } from './utils';
import { LineUpLiteContext } from './contexts';

export function LineUpLiteTD<D extends object>({ cell }: { cell: Cell<D, any> }) {
  const cellTyped = (cell as unknown) as Cell<D> & UseGroupByCellProps<D>;
  const column = cellTyped.column as LineUpLiteColumn<D> & ColumnInstance<D> & UseResizeColumnsColumnProps<D>;
  const c = useContext(LineUpLiteContext);
  const p = { c: c?.components.td ?? 'div' };
  return (
    <p.c
      {...cellTyped.getCellProps({
        className: clsx('lt-td', !column.canResize && 'lt-td-support', c?.classNames?.td),
        style: c?.styles?.td,
      })}
    >
      {cellTyped.isGrouped
        ? cellTyped.render(column.Group ? 'Group' : 'Cell')
        : cellTyped.isAggregated
        ? cellTyped.render('Aggregated')
        : cellTyped.render('Cell')}
    </p.c>
  );
}
