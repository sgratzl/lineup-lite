import React, { memo, useContext, Ref, forwardRef } from 'react';
import type { Row, UseExpandedRowProps, UseGroupByRowProps, UseRowSelectRowProps } from 'react-table';
import { LineUpLiteContext } from './contexts';
import { LineUpLiteTD } from './LineUpLiteTD';
import { clsx, mergeStyles } from './utils';

export interface LineUpLiteTRProps<D extends object> {
  row: Row<D>;
  virtualStart?: number;
  virtualSize?: number;
}

const LineUpLiteTRImpl = /*!#__PURE__*/ forwardRef(function LineUpLiteTR<D extends object>(
  props: LineUpLiteTRProps<D>,
  ref: Ref<HTMLElement>
) {
  const c = useContext(LineUpLiteContext);
  const rowTyped = (props.row as unknown) as Row<D> &
    UseExpandedRowProps<D> &
    UseGroupByRowProps<D> &
    UseRowSelectRowProps<D>;
  const p = { c: c?.components.tr ?? 'div' };
  return (
    <p.c
      ref={ref}
      {...rowTyped.getRowProps({
        className: clsx(
          'lt-tr',
          rowTyped.isGrouped && 'lt-tr-group',
          rowTyped.isExpanded && 'lt-tr-group-expanded',
          rowTyped.isSelected && 'lt-tr-selected',
          rowTyped.isSomeSelected && 'lt-tr-some-selected',
          props.virtualStart != null && 'lt-tr-virtual',
          c?.classNames?.tr
        ),
        style: mergeStyles(
          c?.styles?.tr,
          props.virtualStart != null &&
            props.virtualSize != null && {
              height: `${props.virtualSize}px`,
              transform: `translateY(${props.virtualStart}px)`,
            }
        ),
      })}
    >
      {rowTyped.cells
        .filter((d) => d.column.isVisible)
        .map((cell) => (
          <LineUpLiteTD key={cell.column.id} cell={cell} />
        ))}
    </p.c>
  );
});

export const LineUpLiteTR = LineUpLiteTRImpl as <D extends object>(
  p: LineUpLiteTRProps<D> & React.RefAttributes<HTMLElement>
) => React.ReactElement;

export const LineUpLiteTRMemo = /*!#__PURE__*/ memo(LineUpLiteTRImpl) as typeof LineUpLiteTR;
