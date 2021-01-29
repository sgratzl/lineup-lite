import React, { Ref } from 'react';
import { useCommonLineUp } from './hooks';
import type { LineUpLiteProps } from './interfaces';
import { LineUpLiteTHead } from './LineUpLiteTHead';
import { LineUpLiteTR } from './LineUpLiteTR';
import { useLineUpLite } from './useLineUpLite';
import { clsx } from './utils';

export const LineUpLite = /*!#__PURE__*/ React.forwardRef(function LineUpLite<D extends object>(
  props: LineUpLiteProps<D>,
  ref: Ref<HTMLDivElement>
) {
  const instance = useLineUpLite<D>(props);
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, state, dispatch } = instance;

  const shared = useCommonLineUp(props, state);

  return (
    <div
      {...getTableProps({
        className: clsx('lt-table', props.className),
        style: props.style,
      })}
      ref={ref}
    >
      <LineUpLiteTHead
        headerGroups={headerGroups}
        c={shared}
        actions={props.actions}
        icons={props.icons}
        dispatch={dispatch}
      />
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
