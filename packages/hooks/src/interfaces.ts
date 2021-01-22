import type {
  Column,
  ColumnInstance,
  Renderer,
  Row,
  UseFiltersColumnOptions,
  UseGroupByColumnOptions,
  UseResizeColumnsColumnOptions,
  UseSortByColumnOptions,
} from 'react-table';
import type { UseStatsColumnOptions } from './hooks/useStats';

export interface UseColumnGroupByColumnOptions<D extends object> {
  Group?: Renderer<D>;
  groupBy?(rows: Row<D>[], column: ColumnInstance<D>): Record<string, Row<D>[]>;
}

export type LineUpLiteColumn<D extends object> = Column<D> &
  UseFiltersColumnOptions<D> &
  UseGroupByColumnOptions<D> &
  UseSortByColumnOptions<D> &
  UseStatsColumnOptions<D> &
  UseResizeColumnsColumnOptions<D> &
  UseColumnGroupByColumnOptions<D> & {
    canHide?: boolean;
    tooltip?: string;
  };
