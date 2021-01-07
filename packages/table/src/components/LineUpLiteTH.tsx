import React from 'react';
import { HeaderGroup, UseGroupByColumnProps, UseResizeColumnsColumnProps } from 'react-table';
import { clsx } from './utils';
import Toolbar from './Toolbar';
import { ISharedLineUpProps } from './interfaces';

export function LineUpLiteTH<D extends object>({ col, shared }: { col: HeaderGroup<D>; shared: ISharedLineUpProps }) {
  const column = (col as unknown) as HeaderGroup<D> &
    UseGroupByColumnProps<D> &
    UseResizeColumnsColumnProps<D> & { tooltip?: string };
  return (
    <div
      {...column.getHeaderProps({
        className: clsx(
          'lt-th',
          !column.canResize && 'lt-th-support',
          shared.classNames?.th,
          clsx(column.isResizing && 'lt-column-resizing')
        ),
        style: shared.styles?.th,
      })}
    >
      {column.canResize ? (
        <>
          {column.canResize && (
            <div
              {...column.getResizerProps({
                className: 'lt-column-resize-handle',
              })}
            />
          )}
          <div
            className={clsx('lt-header', shared.classNames?.header)}
            style={shared.styles?.header}
            title={column.tooltip}
          >
            {column.render('Header')}
          </div>
          <Toolbar {...col} icons={shared.icons} />
          {column.render('Summary')}
        </>
      ) : (
        column.render('Summary')
      )}
    </div>
  );
}

export const LineUpLiteTHMemo = React.memo(LineUpLiteTH) as typeof LineUpLiteTH;
