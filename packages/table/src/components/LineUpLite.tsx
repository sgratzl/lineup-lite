import React, { Ref } from 'react';
import type { LineUpLiteProps } from './interfaces';
import { LineUpLiteTHead } from './LineUpLiteTHead';
import { LineUpLiteTR } from './LineUpLiteTR';
import { useLineUpLite } from './useLineUpLite';
import { clsx } from './utils';
import { LineUpLiteContextProvider } from './contexts';

export const LineUpLite = /*!#__PURE__*/ React.forwardRef(function LineUpLite<D extends object>(
  props: LineUpLiteProps<D>,
  ref: Ref<HTMLDivElement>
) {
  const instance = useLineUpLite<D>(props);
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = instance;

  return (
    <div
      {...getTableProps({
        className: clsx('lt-table', props.dark && 'lt-dark', props.className),
        style: props.style,
      })}
      ref={ref}
    >
      <LineUpLiteContextProvider instance={instance} props={props}>
        <LineUpLiteTHead headerGroups={headerGroups} actions={props.actions} icons={props.icons} />
        <div
          {...getTableBodyProps({
            className: clsx('lt-tbody', props.classNames?.tbody),
            style: props.styles?.tbody,
          })}
        >
          {rows.map((row) => {
            prepareRow(row);
            return <LineUpLiteTR key={row.id} row={row} />;
          })}
        </div>
      </LineUpLiteContextProvider>
    </div>
  );
});

export default LineUpLite as <D extends object>(
  p: LineUpLiteProps<D> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement;
