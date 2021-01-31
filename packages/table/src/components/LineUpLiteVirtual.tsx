import type { ActionIcons } from '../icons';
import React, { forwardRef, ReactElement, Ref, RefAttributes, useRef } from 'react';
import type { LineUpLiteProps } from './interfaces';
import { LineUpLiteTHead } from './LineUpLiteTHead';
import { LineUpLiteTVirtualBody } from './LineUpLiteTVirtualBody';
import { useLineUpLite } from './useLineUpLite';
import { clsx } from './utils';
import { LineUpLiteContextProvider } from './contexts';

export type SizeEstimator = number | [number, number] | ((index: number) => number);

export interface LineUpLiteVirtualProps<D extends object> extends LineUpLiteProps<D> {
  estimatedSize: SizeEstimator;
  rowSpacing?: number;
  overscan?: number;
  icons?: Partial<ActionIcons>;
}

const LineUpLiteVirtualImpl = /*!#__PURE__*/ forwardRef(function LineUpLiteVirtual<D extends object>(
  props: LineUpLiteVirtualProps<D>,
  ref: Ref<HTMLElement>
) {
  const instance = useLineUpLite<D>(props);
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = instance;

  const theadRef = useRef<HTMLElement>(null);

  const p = { c: props.components?.table ?? 'div' };

  return (
    <p.c
      ref={ref}
      {...getTableProps({
        className: clsx('lt-table', 'lt-table-virtual', props.dark && 'lt-dark', props.className),
        style: props.style,
      })}
    >
      <LineUpLiteContextProvider instance={instance} props={props}>
        <LineUpLiteTHead headerGroups={headerGroups} ref={theadRef} icons={props.icons} actions={props.actions} />
        <LineUpLiteTVirtualBody
          getTableBodyProps={getTableBodyProps}
          theadRef={theadRef}
          rows={rows}
          rowSpacing={props.rowSpacing ?? 0}
          estimatedSize={props.estimatedSize}
          overscan={props.overscan}
          prepareRow={prepareRow}
        />
      </LineUpLiteContextProvider>
    </p.c>
  );
});

export const LineUpLiteVirtual = LineUpLiteVirtualImpl as <D extends object>(
  p: LineUpLiteVirtualProps<D> & RefAttributes<HTMLElement>
) => ReactElement;
