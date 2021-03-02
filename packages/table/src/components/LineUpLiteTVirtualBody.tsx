/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useRef, useCallback, useLayoutEffect, useMemo, RefObject } from 'react';
import type { Row, TableInstance, UseExpandedRowProps, UseGroupByRowProps } from 'react-table';
import { useVirtual } from 'react-virtual';
import { clsx } from './utils';
import { LineUpLiteTRMemo } from './LineUpLiteTR';
import type { SizeEstimator } from './LineUpLiteVirtual';
import { useLineUpLiteTableContext } from './contexts';
import type { AnyObject, UnknownObject } from './interfaces';

export default function LineUpLiteTVirtualBody<D extends AnyObject = UnknownObject>({
  rows,
  prepareRow,
  getTableBodyProps,
  theadRef,
  estimatedSize,
  overscan,
  rowSpacing,
}: {
  getTableBodyProps: TableInstance<D>['getTableBodyProps'];
  rows: Row<D>[];
  theadRef: RefObject<HTMLElement>;
  prepareRow: (row: Row<D>) => void;
  estimatedSize: SizeEstimator;
  rowSpacing: number;
  overscan?: number;
}): JSX.Element {
  const c = useLineUpLiteTableContext();
  const ref = useRef<HTMLDivElement>(null);
  const givenEstimate = estimatedSize;
  const estimateSize = useCallback(
    (index: number) => {
      if (typeof givenEstimate === 'function') {
        return givenEstimate(index) + rowSpacing;
      }
      const row = (rows[index] as unknown) as Row<D> & UseExpandedRowProps<D> & UseGroupByRowProps<D>;
      const vs = typeof givenEstimate === 'number' ? [givenEstimate, givenEstimate * 2] : givenEstimate;
      return (row.isGrouped ? vs[1] : vs[0]) + rowSpacing;
    },
    [givenEstimate, rows, rowSpacing]
  );
  const { totalSize, virtualItems } = useVirtual({
    size: rows.length,
    overscan: overscan ?? 5,
    parentRef: ref,
    estimateSize,
  });

  // create a detector when getTableBodyProps changes forcing rows to render
  const nonce = useMemo(() => Math.random() + (typeof getTableBodyProps === 'function' ? 1 : 0), [getTableBodyProps]);

  // sync horizontal scrolling
  useLayoutEffect(() => {
    const elem = ref.current;
    const thead = theadRef.current;

    if (!elem || !thead) {
      return undefined;
    }
    const scrollListener = (e: Event) => {
      const { scrollLeft } = e.currentTarget as HTMLDivElement;
      if (Math.abs(thead.scrollLeft - scrollLeft) > 0) {
        thead.scrollLeft = scrollLeft;
      }
    };
    elem.addEventListener('scroll', scrollListener, {
      passive: true,
    });
    return () => {
      elem.removeEventListener('scroll', scrollListener);
    };
  }, [ref, theadRef]);

  const p = { c: c?.components.tbody ?? 'div' };
  return (
    <p.c
      {...getTableBodyProps({
        className: clsx('lt-tbody', 'lt-tbody-virtual', c?.classNames?.tbody),
        style: c?.styles?.tbody,
      })}
      ref={ref}
    >
      <div
        style={{
          height: `${totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((item) => {
          const row = rows[item.index];
          prepareRow(row);
          return (
            <LineUpLiteTRMemo
              key={`${row.id}-${nonce}`}
              row={row}
              virtualStart={item.start}
              virtualSize={item.size - rowSpacing}
            />
          );
        })}
      </div>
    </p.c>
  );
}
