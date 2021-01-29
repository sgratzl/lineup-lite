import React, { forwardRef, Ref, useContext } from 'react';
import type { HeaderGroup, Renderer, UseGroupByColumnProps, UseResizeColumnsColumnProps } from 'react-table';
import { clsx } from './utils';
import { LineUpLiteToolbar } from './LineUpLiteToolbar';
import type { ActionLineUpProps } from './interfaces';
import { LineUpLiteContext } from './contexts';

export interface LineUpLiteTHProps<D extends object> extends ActionLineUpProps<D> {
  col: HeaderGroup<D>;
}

const LineUpLiteTHImpl = /*!#__PURE__*/ forwardRef(function LineUpLiteTH<D extends object>(
  { col, actions, icons }: LineUpLiteTHProps<D>,
  ref: Ref<HTMLElement>
) {
  const column = (col as unknown) as HeaderGroup<D> &
    UseGroupByColumnProps<D> &
    UseResizeColumnsColumnProps<D> & { tooltip?: string; Summary?: Renderer<any> };
  const c = useContext(LineUpLiteContext);
  const p = { c: c?.components.th ?? 'div' };
  return (
    <p.c
      ref={ref}
      {...column.getHeaderProps({
        className: clsx(
          'lt-th',
          !column.canResize && 'lt-th-support',
          c?.classNames?.th,
          clsx(column.isResizing && 'lt-column-resizing')
        ),
        style: c?.styles?.th,
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
          <div className={clsx('lt-header', c?.classNames?.header)} style={c?.styles?.header} title={column.tooltip}>
            {column.render('Header')}
          </div>
          <LineUpLiteToolbar {...col} icons={icons}>
            {actions && actions(column)}
          </LineUpLiteToolbar>
          {column.Summary && column.render('Summary')}
        </>
      ) : (
        column.render(column.Summary ? 'Summary' : 'Header')
      )}
    </p.c>
  );
});

export const LineUpLiteTH = LineUpLiteTHImpl as <D extends object>(
  p: LineUpLiteTHProps<D> & React.RefAttributes<HTMLElement>
) => React.ReactElement;
