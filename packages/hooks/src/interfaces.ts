import {
  Column,
  UseFiltersColumnOptions,
  UseGroupByColumnOptions,
  UseResizeColumnsColumnOptions,
  UseSortByColumnOptions,
} from 'react-table';
import { UseStatsColumnOptions } from './hooks/useStats';

export type FullColumn<D extends object> = Column<D> &
  UseFiltersColumnOptions<D> &
  UseGroupByColumnOptions<D> &
  UseSortByColumnOptions<D> &
  UseStatsColumnOptions<D> &
  UseResizeColumnsColumnOptions<D>;
