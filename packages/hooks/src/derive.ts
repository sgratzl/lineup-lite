import type {
  NumberStatsOptions,
  CategoricalStatsOptions,
  DateStatsOptions,
  TextStatsOptions,
} from '@lineup-lite/components';
import { asCategoricalColumn, asDateColumn, asNumberColumn, asTextColumn } from './builder';
import type { FullColumn } from './interfaces';
import type { Column } from 'react-table';

export function cleanCategories(categories: Set<string>) {
  // remove missing values
  categories.delete(null as any);
  categories.delete(undefined as any);
  categories.delete('');
  categories.delete('NA');
  categories.delete('NaN');
  categories.delete('na');
  return [...categories].map(String).sort();
}

export interface DeriveCategoricalColumnResult<D extends object> {
  type: 'categorical';
  column: Column<D>;
  options?: CategoricalStatsOptions;
}
export interface DeriveNumberColumnResult<D extends object> {
  type: 'number';
  column: Column<D>;
  options?: NumberStatsOptions;
}
export interface DeriveTextColumnResult<D extends object> {
  type: 'text';
  column: Column<D>;
  options?: TextStatsOptions;
}
export interface DeriveDateColumnResult<D extends object> {
  type: 'date';
  column: Column<D>;
  options?: DateStatsOptions;
}

export type DeriveColumnResult<D extends object> =
  | DeriveCategoricalColumnResult<D>
  | DeriveDateColumnResult<D>
  | DeriveNumberColumnResult<D>
  | DeriveTextColumnResult<D>;

export function deriveColumn<D extends object>(data: D[], accessor: keyof D): DeriveColumnResult<D> {
  const column = {
    Header: accessor.toString(),
    accessor,
  };
  if (data.length === 0) {
    return { type: 'text', column };
  }
  let firstIndex = 0;
  let first = data[firstIndex][accessor];
  while (first == null && firstIndex < data.length - 1) {
    first = data[++firstIndex][accessor];
  }
  if (first == null) {
    // cannot derive
    return { type: 'text', column };
  }
  if (typeof first === 'number') {
    return { type: 'number', column };
  }
  if (first instanceof Date) {
    return { type: 'date', column };
  }
  if (typeof first === 'boolean') {
    const acc = (row: D) => (row[accessor] ? String(row[accessor]) : null);
    return {
      type: 'categorical',
      column: {
        Header: column.Header,
        id: accessor.toString(),
        accessor: acc as any,
      },
    };
  }

  // check if categorical
  const values = new Set<string>(String(first));
  for (let i = firstIndex++; i < data.length; i++) {
    const v = data[i][accessor];
    if (v != null) {
      values.add(String(v));
    }
  }
  if (values.size < 20 || values.size < data.length * 0.7) {
    // categorical
    return {
      type: 'categorical',
      column,
      options: {
        categories: cleanCategories(values),
      },
    };
  }

  return { type: 'text', column };
}

export function deriveColumns<D extends object>(data: D[], columns?: (keyof D)[]): Partial<FullColumn<D>>[] {
  if (data.length === 0) {
    if (columns) {
      return columns.map((col) => asTextColumn(col));
    }
    return [];
  }
  return (columns ?? (Object.keys(data[0]) as (keyof D)[])).map((col) => {
    const derived = deriveColumn(data, col);
    switch (derived.type) {
      case 'categorical':
        return asCategoricalColumn(derived.column, derived.options);
      case 'number':
        return asNumberColumn(derived.column, derived.options);
      case 'date':
        return asDateColumn(derived.column, derived.options);
      default:
        return asTextColumn(derived.column, derived.options);
    }
  });
}
