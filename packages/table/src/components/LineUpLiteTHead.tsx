import type { HeaderGroup, TableDispatch } from 'react-table';
import type { CustomizeLineUpProps, ActionLineUpProps } from './interfaces';
import React from 'react';
import { clsx } from './utils';
import { LineUpLiteTH } from './LineUpLiteTH';

export function LineUpLiteTHead<D extends object>({
  headerGroups,
  c,
  virtualRef,
  icons,
  actions,
  dispatch,
}: {
  headerGroups: HeaderGroup<D>[];
  c?: CustomizeLineUpProps;
  virtualRef?: React.RefObject<HTMLDivElement>;
  dispatch: TableDispatch;
} & ActionLineUpProps<D>) {
  return (
    <div
      ref={virtualRef}
      className={clsx('lt-thead', virtualRef != null && 'lt-thead-virtual', c?.classNames?.thead)}
      style={c?.styles?.thead}
    >
      {headerGroups.map((headerGroup) => (
        <div
          {...headerGroup.getHeaderGroupProps({
            className: clsx('lt-th-group', c?.classNames?.thGroup),
            style: c?.styles?.thGroup,
          })}
        >
          {headerGroup.headers
            .filter((d) => d.isVisible)
            .map((col) => (
              <LineUpLiteTH key={col.id} col={col} c={c} actions={actions} icons={icons} dispatch={dispatch} />
            ))}
        </div>
      ))}
    </div>
  );
}
