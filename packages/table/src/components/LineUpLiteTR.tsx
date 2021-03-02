/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { memo, Ref, forwardRef, RefAttributes, ReactElement, ReactNode } from 'react';
import type { Row, UseExpandedRowProps, UseGroupByRowProps, UseRowSelectRowProps } from 'react-table';
import { useLineUpLiteTableContext } from './contexts';
import type { AnyObject, UnknownObject } from './interfaces';
import { LineUpLiteTD } from './LineUpLiteTD';
import { clsx, mergeStyles } from './utils';

export interface LineUpLiteTRProps<D extends AnyObject = UnknownObject> {
  row: Row<D>;
  virtualStart?: number;
  virtualSize?: number;
  children?: ReactNode;
}

const LineUpLiteTRImpl = /*! #__PURE__ */ forwardRef(function LineUpLiteTR<D extends AnyObject = UnknownObject>(
  props: LineUpLiteTRProps<D>,
  ref: Ref<HTMLElement>
) {
  const c = useLineUpLiteTableContext();
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
      {props.children}
    </p.c>
  );
});

export const LineUpLiteTR = LineUpLiteTRImpl as <D extends AnyObject = UnknownObject>(
  p: LineUpLiteTRProps<D> & RefAttributes<HTMLElement>
) => ReactElement;

export const LineUpLiteTRMemo = /*! #__PURE__ */ memo(LineUpLiteTRImpl) as typeof LineUpLiteTR;
