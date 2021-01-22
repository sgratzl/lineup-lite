import type { ActionIcons } from '../icons';
import React, { Ref } from 'react';
import { useCustomize } from './hooks';
import type { ActionLineUpProps, CustomizeLineUpProps } from './interfaces';
import { LineUpLiteTHead } from './LineUpLiteTHead';
import { LineUpLiteTR } from './LineUpLiteTR';
import { FullTableProps, useFullTable } from './useFullTable';
import { clsx } from './utils';

export interface LineUpLiteProps<D extends object>
  extends FullTableProps<D>,
    ActionLineUpProps<D>,
    CustomizeLineUpProps {
  className?: string;
  style?: React.CSSProperties;
  icons?: Partial<ActionIcons>;
}

export const LineUpLite = /*!#__PURE__*/ React.forwardRef(function LineUpLite<D extends object>(
  props: LineUpLiteProps<D>,
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
  p: LineUpLiteProps<D> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement;
