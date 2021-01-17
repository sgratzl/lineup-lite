import React, { useRef, useCallback, useLayoutEffect, useMemo } from 'react';
import { Row, TableInstance } from 'react-table';
import { ISharedLineUpProps } from './interfaces';
import { clsx } from './utils';
import { useVirtual } from 'react-virtual';
import { LineUpLiteTRMemo } from './LineUpLiteTR';

export function LineUpLiteTVirtualBody<D extends object>({
  rows,
  shared,
  prepareRow,
  getTableBodyProps,
  theadRef,
  estimatedSize,
  overscan,
}: {
  getTableBodyProps: TableInstance<D>['getTableBodyProps'];
  rows: Row<D>[];
  theadRef: React.RefObject<HTMLDivElement>;
  shared: ISharedLineUpProps;
  prepareRow: (row: Row<D>) => void;
  estimatedSize: number | ((index: number) => number);
  overscan?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const givenEstimate = estimatedSize;
  const estimateSize = useCallback(
    (index: number) => {
      if (typeof givenEstimate === 'function') {
        return givenEstimate(index);
      }
      return givenEstimate;
    },
    [givenEstimate]
  );
  const rowVirtualizer = useVirtual({
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
  return (
    <div
      {...getTableBodyProps({
        className: clsx('lt-tbody', 'lt-tbody-virtual', shared.classNames?.tbody),
        style: shared.styles?.tbody,
      })}
      ref={ref}
    >
      <div
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.virtualItems.map((item) => {
          const row = rows[item.index];
          prepareRow(row);
          return (
            <LineUpLiteTRMemo
              key={`${row.id}-${nonce}`}
              row={row}
              shared={shared}
              virtualStart={item.start}
              virtualSize={item.size}
            />
          );
        })}
      </div>
    </div>
  );
}