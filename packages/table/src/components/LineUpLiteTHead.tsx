import { HeaderGroup } from 'react-table';
import { ISharedLineUpProps } from './interfaces';
import React from 'react';
import { clsx } from './utils';
import { LineUpLiteTH } from './LineUpLiteTH';

export function LineUpLiteTHead<D extends object>({
  headerGroups,
  shared,
  virtualRef,
}: {
  headerGroups: HeaderGroup<D>[];
  shared: ISharedLineUpProps<D>;
  virtualRef?: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={virtualRef}
      className={clsx('lt-thead', virtualRef != null && 'lt-thead-virtual', shared.classNames?.thead)}
      style={shared.styles?.thead}
    >
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
