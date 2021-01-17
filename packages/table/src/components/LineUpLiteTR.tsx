import React, { memo } from 'react';
import { Row, UseExpandedRowProps, UseGroupByRowProps, UseRowSelectRowProps } from 'react-table';
import { ISharedLineUpProps } from './interfaces';
import { LineUpLiteTD } from './LineUpLiteTD';
import { clsx, mergeStyles } from './utils';

export function LineUpLiteTR<D extends object>({
  row,
  shared,
  virtualStart,
  virtualSize,
}: {
  row: Row<D>;
  shared: ISharedLineUpProps;
  virtualStart?: number;
  virtualSize?: number;
}) {
  const rowTyped = (row as unknown) as Row<D> &
    UseExpandedRowProps<D> &
    UseGroupByRowProps<D> &
    UseRowSelectRowProps<D>;
  return (
    <div
      {...rowTyped.getRowProps({
        className: clsx(
          'lt-tr',
          rowTyped.isSelected && 'lt-tr-selected',
          virtualStart != null && 'lt-tr-virtual',
          shared.classNames?.tr
        ),
        style: mergeStyles(
          shared.styles?.tr,
          virtualStart != null &&
            virtualSize != null && {
              height: `${virtualSize}px`,
              transform: `translateY(${virtualStart}px)`,
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

export const LineUpLiteTRMemo = memo(LineUpLiteTR) as typeof LineUpLiteTR;
