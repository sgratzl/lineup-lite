import type { IActionIcons } from 'icons';
import React, { useRef } from 'react';
import { useCustomize } from './hooks';
import type { IActionLineUpProps, ICustomizeLineUpProps } from './interfaces';
import { LineUpLiteTHead } from './LineUpLiteTHead';
import { LineUpLiteTVirtualBody } from './LineUpLiteTVirtualBody';
import { IFullTableProps, useFullTable } from './useFullTable';
import { clsx } from './utils';

export type SizeEstimator = number | [number, number] | ((index: number) => number);

export interface ILineUpLiteVirtualProps<D extends object>
  extends IFullTableProps<D>,
    IActionLineUpProps<D>,
    ICustomizeLineUpProps {
  className?: string;
  style?: React.CSSProperties;
  estimatedSize: SizeEstimator;
  rowSpacing?: number;
  overscan?: number;
  icons: IActionIcons;
}

export function LineUpLiteVirtual<D extends object>(props: ILineUpLiteVirtualProps<D>) {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useFullTable<D>(props);

  const shared = useCustomize(props);

  const theadRef = useRef<HTMLDivElement>(null);

  return (
    <div
      {...getTableProps({
        className: clsx('lt-table', 'lt-table-virtual', props.className),
        style: props.style,
      })}
    >
      <LineUpLiteTHead
        headerGroups={headerGroups}
        c={shared}
        virtualRef={theadRef}
        icons={props.icons}
        actions={props.actions}
      />
      <LineUpLiteTVirtualBody
        getTableBodyProps={getTableBodyProps}
        theadRef={theadRef}
        c={shared}
        rows={rows}
        rowSpacing={props.rowSpacing ?? 0}
        estimatedSize={props.estimatedSize}
        overscan={props.overscan}
        prepareRow={prepareRow}
      />
    </div>
  );
}
