import React from 'react';
import { useCustomize } from './hooks';
import type { ICustomizeLineUpProps, IActionLineUpProps } from './interfaces';
import { LineUpLiteTHead } from './LineUpLiteTHead';
import { IFullTableProps, useFullTable } from './useFullTable';
import { LineUpLiteTR } from './LineUpLiteTR';
import { clsx } from './utils';
import {
  usePagination,
  UsePaginationOptions,
  UsePaginationInstanceProps,
  UseFiltersInstanceProps,
  TableInstance,
} from 'react-table';
import { LineUpLitePagination } from './LineUpLitePagination';
import type { IActionIcons, IPaginationIcons } from '../icons';

export interface ILineUpLitePaginatedProps<D extends object>
  extends IFullTableProps<D>,
    ICustomizeLineUpProps,
    IActionLineUpProps<D>,
    UsePaginationOptions<D> {
  className?: string;
  style?: React.CSSProperties;
  icons: IPaginationIcons & IActionIcons;
}

export function LineUpLitePaginated<D extends object>(props: ILineUpLitePaginatedProps<D>) {
  const fullTable = useFullTable<D>(props, usePagination);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    // The rest of these things are super handy, too ;)
    pageCount,
    gotoPage,
    setPageSize,
  } = fullTable as TableInstance<D> & UseFiltersInstanceProps<D> & UsePaginationInstanceProps<D>;
  const { pageIndex, pageSize } = fullTable.state as any;

  const shared = useCustomize(props);

  return (
    <div
      {...getTableProps({
        className: clsx('lt-table', props.className),
        style: props.style,
      })}
    >
      <LineUpLiteTHead headerGroups={headerGroups} c={shared} icons={props.icons} actions={props.actions} />
      <div
        {...getTableBodyProps({
          className: clsx('lt-tbody', props.classNames?.tbody),
          style: props.styles?.tbody,
        })}
      >
        {page.map((row) => {
          prepareRow(row);
          return <LineUpLiteTR key={row.id} row={row} c={shared} />;
        })}
      </div>
      <LineUpLitePagination
        icons={props.icons}
        pageCount={pageCount}
        gotoPage={gotoPage}
        setPageSize={setPageSize}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />
    </div>
  );
}