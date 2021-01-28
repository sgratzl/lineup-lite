import type { Row } from 'react-table';

export type RowCompareFunction = (a: Row<any>, b: Row<any>, columnId: string) => number;
