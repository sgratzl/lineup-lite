import React, { forwardRef, Ref, useContext } from 'react';
import type { HeaderGroup } from 'react-table';
import { LineUpLiteContext } from './contexts';
import type { ActionLineUpProps } from './interfaces';
import { LineUpLiteTH } from './LineUpLiteTH';
import { clsx } from './utils';

export interface LineUpLiteTHeadProps<D extends object> extends ActionLineUpProps<D> {
  headerGroups: HeaderGroup<D>[];
}

const LineUpLiteTHeadImpl = /*!#__PURE__*/ forwardRef(function LineUpLiteTHead<D extends object>(
  { headerGroups, icons, actions }: LineUpLiteTHeadProps<D>,
  ref: Ref<HTMLElement>
) {
  const c = useContext(LineUpLiteContext);
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
    </p.c>
  );
});

export const LineUpLiteTHead = LineUpLiteTHeadImpl as <D extends object>(
  p: LineUpLiteTHeadProps<D> & React.RefAttributes<HTMLElement>
) => React.ReactElement;
