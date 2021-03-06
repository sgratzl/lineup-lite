/**
 * @lineup-lite/table
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useCallback, MouseEvent, ChangeEvent } from 'react';
import type { PaginationIcons } from '../icons';

export interface LineUpLitePaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  gotoPage: (updater: ((pageIndex: number) => number) | number) => void;
  setPageSize: (pageSize: number) => void;
  icons: PaginationIcons;
}

export function LineUpLitePagination({
  gotoPage,
  pageIndex,
  pageCount,
  pageSize,
  setPageSize,
  icons,
}: LineUpLitePaginationProps): JSX.Element {
  const changePage = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const page = Number.parseInt(e.currentTarget.dataset.page ?? '0', 10);
      gotoPage(page);
    },
    [gotoPage]
  );
  const gotoPageHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      gotoPage(e.target.value ? Number.parseInt(e.target.value, 10) - 1 : 0);
    },
    [gotoPage]
  );
  const setPageSizeHandler = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setPageSize(e.target.value ? Number.parseInt(e.target.value, 10) - 1 : 10);
    },
    [setPageSize]
  );

  const lastPage = pageCount - 1;
  return (
    <div className="lt-footer lt-pagination">
      <button onClick={changePage} data-page={0} disabled={pageIndex <= 0} type="button">
        <icons.firstPage />
      </button>
      <button onClick={changePage} data-page={pageIndex - 1} disabled={pageIndex <= 0} type="button">
        <icons.previousPage />
      </button>
      <button onClick={changePage} data-page={pageIndex + 1} disabled={pageIndex >= lastPage} type="button">
        <icons.nextPage />
      </button>
      <button onClick={changePage} data-page={lastPage} disabled={pageIndex >= lastPage} type="button">
        <icons.lastPage />
      </button>
      <span>
        Page
        <strong>
          {pageIndex + 1} of {pageCount}
        </strong>
      </span>
      <span>
        | Go to page:
        <input type="number" className="lt-pagination-select" value={pageIndex + 1} onChange={gotoPageHandler} />
      </span>
      <select value={pageSize} onChange={setPageSizeHandler} className="lt-pagination-page-size">
        {[10, 20, 30, 40, 50].map((currentPage) => (
          <option key={currentPage} value={currentPage}>
            Show {currentPage}
          </option>
        ))}
      </select>
    </div>
  );
}
