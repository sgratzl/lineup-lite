import type { ActionIcons } from '../icons';
import React, { useRef } from 'react';
import { useCustomize } from './hooks';
import type { ActionLineUpProps, CustomizeLineUpProps } from './interfaces';
import { LineUpLiteTHead } from './LineUpLiteTHead';
import { LineUpLiteTVirtualBody } from './LineUpLiteTVirtualBody';
import { UseLineUpLiteOptions, useLineUpLite } from './useLineUpLite';
import { clsx } from './utils';

export type SizeEstimator = number | [number, number] | ((index: number) => number);

export interface LineUpLiteVirtualProps<D extends object>
  extends UseLineUpLiteOptions<D>,
    ActionLineUpProps<D>,
    CustomizeLineUpProps {
  className?: string;
  style?: React.CSSProperties;
  estimatedSize: SizeEstimator;
  rowSpacing?: number;
  overscan?: number;
  icons?: Partial<ActionIcons>;
}

export function LineUpLiteVirtual<D extends object>(props: LineUpLiteVirtualProps<D>) {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useLineUpLite<D>(props);

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
