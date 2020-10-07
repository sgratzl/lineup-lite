import React from 'react';
import { Row, UseExpandedRowProps, UseGroupByRowProps } from 'react-table';
import { ISharedLineUpProps } from './interfaces';
import { LineUpLiteTD } from './LineUpLiteTD';
import { clsx } from './utils';

export function LineUpLiteTR<D extends object>({
  row,
  shared,
  prepareRow,
}: {
  row: Row<D>;
  shared: ISharedLineUpProps;
  prepareRow: (row: Row<D>) => void;
}) {
  prepareRow(row);
  const rowTyped = (row as unknown) as Row<D> & UseExpandedRowProps<D> & UseGroupByRowProps<D>;
  return (
    <div
      {...rowTyped.getRowProps({
        className: clsx('lt-tr', shared.classNames?.tr),
        style: shared.styles?.tr,
      })}
    >
      {rowTyped.cells
        .filter((d) => d.column.isVisible)
        .map((cell) => (
          <LineUpLiteTD key={cell.column.id} cell={cell} shared={shared} />
        ))}
    </div>
  );
}
