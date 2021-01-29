import React, { memo, useContext } from 'react';
import type { Row, UseExpandedRowProps, UseGroupByRowProps, UseRowSelectRowProps } from 'react-table';
import { LineUpLiteContext } from './contexts';
import { LineUpLiteTD } from './LineUpLiteTD';
import { clsx, mergeStyles } from './utils';

export function LineUpLiteTR<D extends object>({
  row,
  virtualStart,
  virtualSize,
}: {
  row: Row<D>;
  virtualStart?: number;
  virtualSize?: number;
}) {
  const c = useContext(LineUpLiteContext);
  const rowTyped = (row as unknown) as Row<D> &
    UseExpandedRowProps<D> &
    UseGroupByRowProps<D> &
    UseRowSelectRowProps<D>;
  return (
    <div
      {...rowTyped.getRowProps({
        className: clsx(
          'lt-tr',
          rowTyped.isGrouped && 'lt-tr-group',
          rowTyped.isExpanded && 'lt-tr-group-expanded',
          rowTyped.isSelected && 'lt-tr-selected',
          rowTyped.isSomeSelected && 'lt-tr-some-selected',
          virtualStart != null && 'lt-tr-virtual',
          c?.classNames?.tr
        ),
        style: mergeStyles(
          c?.styles?.tr,
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
          <LineUpLiteTD key={cell.column.id} cell={cell} />
        ))}
    </div>
  );
}

export const LineUpLiteTRMemo = memo(LineUpLiteTR) as typeof LineUpLiteTR;
