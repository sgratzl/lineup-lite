import type { IActionIcons } from '../icons';
import React, { Ref } from 'react';
import { useCustomize } from './hooks';
import type { IActionLineUpProps, ICustomizeLineUpProps } from './interfaces';
import { LineUpLiteTHead } from './LineUpLiteTHead';
import { LineUpLiteTR } from './LineUpLiteTR';
import { IFullTableProps, useFullTable } from './useFullTable';
import { clsx } from './utils';

export interface ILineUpLiteProps<D extends object>
  extends IFullTableProps<D>,
    IActionLineUpProps<D>,
    ICustomizeLineUpProps {
  className?: string;
  style?: React.CSSProperties;
  icons?: Partial<IActionIcons>;
}

export const LineUpLite = /*!#__PURE__*/ React.forwardRef(function LineUpLite<D extends object>(
  props: ILineUpLiteProps<D>,
  ref: Ref<HTMLDivElement>
) {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useFullTable<D>(props);

  const shared = useCustomize(props);

  return (
    <div
      {...getTableProps({
        className: clsx('lt-table', props.className),
        style: props.style,
      })}
      ref={ref}
    >
      <LineUpLiteTHead headerGroups={headerGroups} c={shared} actions={props.actions} icons={props.icons} />
      <div
        {...getTableBodyProps({
          className: clsx('lt-tbody', props.classNames?.tbody),
          style: props.styles?.tbody,
        })}
      >
        {rows.map((row) => {
          prepareRow(row);
          return <LineUpLiteTR key={row.id} row={row} c={shared} />;
        })}
      </div>
    </div>
  );
});

export default LineUpLite as <D extends object>(
  p: ILineUpLiteProps<D> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement;
