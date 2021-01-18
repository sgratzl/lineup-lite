import React from 'react';
import type { HeaderGroup, UseGroupByColumnProps, UseResizeColumnsColumnProps } from 'react-table';
import { clsx } from './utils';
import Toolbar from './Toolbar';
import type { IActionLineUpProps, ICustomizeLineUpProps } from './interfaces';

export function LineUpLiteTH<D extends object>({
  col,
  c,
  actions,
  icons,
}: { col: HeaderGroup<D>; c: ICustomizeLineUpProps } & IActionLineUpProps<D>) {
  const column = (col as unknown) as HeaderGroup<D> &
    UseGroupByColumnProps<D> &
    UseResizeColumnsColumnProps<D> & { tooltip?: string };
  return (
    <div
      {...column.getHeaderProps({
        className: clsx(
          'lt-th',
          !column.canResize && 'lt-th-support',
          c.classNames?.th,
          clsx(column.isResizing && 'lt-column-resizing')
        ),
        style: c.styles?.th,
      })}
    >
      {column.canResize ? (
        <>
          {column.canResize && typeof column.getResizerProps === 'function' && (
            <div
              {...column.getResizerProps({
                className: 'lt-column-resize-handle',
              })}
            />
          )}
          <div className={clsx('lt-header', c.classNames?.header)} style={c.styles?.header} title={column.tooltip}>
            {column.render('Header')}
          </div>
          <Toolbar {...col} icons={icons}>
            {actions && actions(column)}
          </Toolbar>
          {column.render('Summary')}
        </>
      ) : (
        column.render('Summary')
      )}
    </div>
  );
}
