import type { ActionIcons } from '../icons';
import React, { useRef } from 'react';
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

export function LineUpLiteVirtual<D extends object>(props: LineUpLiteVirtualProps<D>) {
  const instance = useLineUpLite<D>(props);
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = instance;

  const theadRef = useRef<HTMLElement>(null);

  const p = { c: props.components?.table ?? 'div' };

  return (
    <p.c
      {...getTableProps({
        className: clsx('lt-table', 'lt-table-virtual', props.dark && 'lt-dark', props.className),
        style: props.style,
      })}
    >
      <LineUpLiteContextProvider instance={instance} props={props}>
        <LineUpLiteTHead
          headerGroups={headerGroups}
          virtualRef={theadRef}
          icons={props.icons}
          actions={props.actions}
        />
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
}
