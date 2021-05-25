/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { forwardRef, ReactElement, Ref, RefAttributes } from 'react';
import type { AnyObject, LineUpLiteProps, UnknownObject } from './interfaces';
import { LineUpLiteTHead } from './LineUpLiteTHead';
import { LineUpLiteTR } from './LineUpLiteTR';
import { useLineUpLite } from './useLineUpLite';
import { clsx } from './utils';
import { LineUpLiteTableContextProvider } from './contexts';

export const LineUpLite = /*! #__PURE__ */ forwardRef(function LineUpLite<D extends AnyObject = UnknownObject>(
  props: LineUpLiteProps<D>,
  ref: Ref<HTMLElement>
) {
  const instance = useLineUpLite<D>(props);
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = instance;

  const p = { c: props.components?.table ?? 'div', b: props.components?.tbody ?? 'div' };

  return (
    <p.c
      {...getTableProps({
        className: clsx('lt-table', 'lt-colors', props.dark && 'lt-dark', props.className),
        style: props.style,
      })}
      ref={ref}
    >
      <LineUpLiteTableContextProvider instance={instance} props={props}>
        <LineUpLiteTHead
          headerGroups={headerGroups}
          actions={props.actions}
          actionFilter={props.actionFilter}
          actionGroupBy={props.actionGroupBy}
          actionSortBy={props.actionSortBy}
          icons={props.icons}
        />
        <p.b
          {...getTableBodyProps({
            className: clsx('lt-tbody', props.classNames?.tbody),
            style: props.styles?.tbody,
          })}
        >
          {rows.map((row) => {
            prepareRow(row);
            return <LineUpLiteTR key={row.id} row={row} />;
          })}
        </p.b>
        {props.children}
      </LineUpLiteTableContextProvider>
    </p.c>
  );
});

export default LineUpLite as <D extends AnyObject = UnknownObject>(
  p: LineUpLiteProps<D> & RefAttributes<HTMLElement>
) => ReactElement;
