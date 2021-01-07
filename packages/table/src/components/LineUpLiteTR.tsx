import React from 'react';
import { Row, UseExpandedRowProps, UseGroupByRowProps } from 'react-table';
import { ISharedLineUpProps } from './interfaces';
import { LineUpLiteTD } from './LineUpLiteTD';
import { clsx, mergeStyles } from './utils';

export function LineUpLiteTR<D extends object>({
  row,
  shared,
  prepareRow,
  virtualItem,
}: {
  row: Row<D>;
  shared: ISharedLineUpProps;
  prepareRow: (row: Row<D>) => void;
  virtualItem?: { size: number; start: number };
}) {
  prepareRow(row);
  const rowTyped = (row as unknown) as Row<D> & UseExpandedRowProps<D> & UseGroupByRowProps<D>;
  return (
    <div
      {...rowTyped.getRowProps({
        className: clsx('lt-tr', virtualItem && 'lt-tr-virtual', shared.classNames?.tr),
        style: mergeStyles(
          shared.styles?.tr,
          virtualItem && {
            height: `${virtualItem.size}px`,
            transform: `translateY(${virtualItem.start}px)`,
          }
        ),
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
