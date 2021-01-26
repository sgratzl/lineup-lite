import React, { memo } from 'react';
import type { Row, UseExpandedRowProps, UseGroupByRowProps, UseRowSelectRowProps } from 'react-table';
import type { CustomizeLineUpProps } from './interfaces';
import { LineUpLiteTD } from './LineUpLiteTD';
import { clsx, mergeStyles } from './utils';

export function LineUpLiteTR<D extends object>({
  row,
  c,
  virtualStart,
  virtualSize,
}: {
  row: Row<D>;
  c?: CustomizeLineUpProps;
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
          <LineUpLiteTD key={cell.column.id} cell={cell} c={c} />
        ))}
    </div>
  );
}

export const LineUpLiteTRMemo = memo(LineUpLiteTR) as typeof LineUpLiteTR;
