import React, { useRef, useCallback, useLayoutEffect, useMemo, useContext, RefObject } from 'react';
import type { Row, TableInstance, UseExpandedRowProps, UseGroupByRowProps } from 'react-table';
import { clsx } from './utils';
import { useVirtual } from 'react-virtual';
import { LineUpLiteTRMemo } from './LineUpLiteTR';
import type { SizeEstimator } from './LineUpLiteVirtual';
import { LineUpLiteContext } from './contexts';

export function LineUpLiteTVirtualBody<D extends object>({
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
}) {
  const c = useContext(LineUpLiteContext);
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
      return;
    }
    const scrollListener = (e: Event) => {
      const scrollLeft = (e.currentTarget as HTMLDivElement).scrollLeft;
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
