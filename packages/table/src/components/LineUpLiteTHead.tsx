/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { forwardRef, ReactElement, ReactNode, Ref, RefAttributes } from 'react';
import type { HeaderGroup } from 'react-table';
import { useLineUpLiteTableContext } from './contexts';
import type { ActionLineUpProps, UnknownObject, AnyObject } from './interfaces';
import { LineUpLiteTH } from './LineUpLiteTH';
import { clsx } from './utils';

export interface LineUpLiteTHeadProps<D extends AnyObject = UnknownObject> extends ActionLineUpProps<D> {
  headerGroups: HeaderGroup<D>[];
  children?: ReactNode;
}

const LineUpLiteTHeadImpl = /*! #__PURE__ */ forwardRef(function LineUpLiteTHead<D extends AnyObject = UnknownObject>(
  { headerGroups, icons, actions, children }: LineUpLiteTHeadProps<D>,
  ref: Ref<HTMLElement>
) {
  const c = useLineUpLiteTableContext();
  const p = { c: c?.components.thead ?? 'div', g: c?.components.thGroup ?? 'div' };
  return (
    <p.c
      ref={ref}
      className={clsx('lt-thead', ref != null && 'lt-thead-virtual', c?.classNames?.thead)}
      style={c?.styles?.thead}
    >
      {headerGroups.map((headerGroup) => (
        <p.g
          {...headerGroup.getHeaderGroupProps({
            className: clsx('lt-th-group', c?.classNames?.thGroup),
            style: c?.styles?.thGroup,
          })}
        >
          {headerGroup.headers
            .filter((d) => d.isVisible)
            .map((col) => (
              <LineUpLiteTH key={col.id} col={col} actions={actions} icons={icons} />
            ))}
        </p.g>
      ))}
      {children}
    </p.c>
  );
});

export const LineUpLiteTHead = LineUpLiteTHeadImpl as <D extends AnyObject = UnknownObject>(
  p: LineUpLiteTHeadProps<D> & RefAttributes<HTMLElement>
) => ReactElement;
