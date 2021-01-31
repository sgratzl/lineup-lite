import React, { forwardRef, ReactElement, Ref, RefAttributes, useContext } from 'react';
import type { Cell, ColumnInstance, UseGroupByCellProps, UseResizeColumnsColumnProps } from 'react-table';
import type { LineUpLiteColumn } from '@lineup-lite/hooks';
import { clsx } from './utils';
import { LineUpLiteContext } from './contexts';

export interface LineUpLiteTDProps<D extends object> {
  cell: Cell<D, any>;
}

const LineUpLiteTDImpl = /*!#__PURE__*/ forwardRef(function LineUpLiteTD<D extends object>(
  { cell }: LineUpLiteTDProps<D>,
  ref: Ref<HTMLElement>
) {
  const cellTyped = (cell as unknown) as Cell<D> & UseGroupByCellProps<D>;
  const column = cellTyped.column as LineUpLiteColumn<D> & ColumnInstance<D> & UseResizeColumnsColumnProps<D>;
  const c = useContext(LineUpLiteContext);
  const p = { c: c?.components.td ?? 'div' };
  return (
    <p.c
      ref={ref}
      {...cellTyped.getCellProps({
        className: clsx('lt-td', !column.canResize && 'lt-td-support', c?.classNames?.td),
        style: c?.styles?.td,
      })}
    >
      {cellTyped.isGrouped
        ? cellTyped.render(column.Group ? 'Group' : 'Cell')
        : cellTyped.isAggregated
        ? cellTyped.render(column.Aggregated ? 'Aggregated' : 'Cell')
        : cellTyped.render('Cell')}
    </p.c>
  );
});

export const LineUpLiteTD = LineUpLiteTDImpl as <D extends object>(
  p: LineUpLiteTDProps<D> & RefAttributes<HTMLElement>
) => ReactElement;
