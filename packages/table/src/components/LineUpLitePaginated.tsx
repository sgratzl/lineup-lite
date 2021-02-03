/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import type { LineUpLiteProps } from './interfaces';
import { LineUpLiteTHead } from './LineUpLiteTHead';
import { useLineUpLite } from './useLineUpLite';
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
import type { ActionIcons, PaginationIcons } from '../icons';
import { LineUpLiteTableContextProvider, useStateListener } from './contexts';

export interface LineUpLitePaginatedProps<D extends object> extends LineUpLiteProps<D>, UsePaginationOptions<D> {
  icons: PaginationIcons & ActionIcons;
}

export function LineUpLitePaginated<D extends object>(props: LineUpLitePaginatedProps<D>) {
  const instance = useLineUpLite<D>(props, usePagination);
  useStateListener(props, instance);
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
    state,
  } = instance as TableInstance<D> & UseFiltersInstanceProps<D> & UsePaginationInstanceProps<D>;

  const { pageIndex, pageSize } = state as any;

  const p = { c: props.components?.table ?? 'div', b: props.components?.tbody ?? 'div' };

  return (
    <p.c
      {...getTableProps({
        className: clsx('lt-table', props.dark && 'lt-dark', props.className),
        style: props.style,
      })}
    >
      <LineUpLiteTableContextProvider instance={instance} props={props}>
        <LineUpLiteTHead headerGroups={headerGroups} icons={props.icons} actions={props.actions} />
        <p.b
          {...getTableBodyProps({
            className: clsx('lt-tbody', props.classNames?.tbody),
            style: props.styles?.tbody,
          })}
        >
          {page.map((row) => {
            prepareRow(row);
            return <LineUpLiteTR key={row.id} row={row} />;
          })}
        </p.b>
        <LineUpLitePagination
          icons={props.icons}
          pageCount={pageCount}
          gotoPage={gotoPage}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </LineUpLiteTableContextProvider>
    </p.c>
  );
}
