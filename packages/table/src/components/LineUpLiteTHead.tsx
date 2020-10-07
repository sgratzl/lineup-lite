import { HeaderGroup } from 'react-table';
import { ISharedLineUpProps } from './interfaces';
import React from 'react';
import { clsx } from './utils';
import { LineUpLiteTH } from './LineUpLiteTH';

export function LineUpLiteTHead<D extends object>({
  headerGroups,
  shared,
}: {
  headerGroups: HeaderGroup<D>[];
  shared: ISharedLineUpProps;
}) {
  return (
    <div className={clsx('lt-thead', shared.classNames?.thead)} style={shared.styles?.thead}>
      {headerGroups.map((headerGroup) => (
        <div
          {...headerGroup.getHeaderGroupProps({
            className: clsx('lt-th-group', shared.classNames?.thGroup),
            style: shared.styles?.thGroup,
          })}
        >
          {headerGroup.headers
            .filter((d) => d.isVisible)
            .map((col) => (
              <LineUpLiteTH key={col.id} col={col} shared={shared} />
            ))}
        </div>
      ))}
    </div>
  );
}
