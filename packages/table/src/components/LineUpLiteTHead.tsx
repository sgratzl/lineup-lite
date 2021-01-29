import React, { useContext } from 'react';
import type { HeaderGroup } from 'react-table';
import { LineUpLiteContext } from './contexts';
import type { ActionLineUpProps } from './interfaces';
import { LineUpLiteTH } from './LineUpLiteTH';
import { clsx } from './utils';

export function LineUpLiteTHead<D extends object>({
  headerGroups,
  virtualRef,
  icons,
  actions,
}: {
  headerGroups: HeaderGroup<D>[];
  virtualRef?: React.RefObject<HTMLElement>;
} & ActionLineUpProps<D>) {
  const c = useContext(LineUpLiteContext);
  const p = { c: c?.components.thead ?? 'div', g: c?.components.thGroup ?? 'div' };
  return (
    <p.c
      ref={virtualRef}
      className={clsx('lt-thead', virtualRef != null && 'lt-thead-virtual', c?.classNames?.thead)}
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
}
