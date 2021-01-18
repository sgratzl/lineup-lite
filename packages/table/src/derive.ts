import { asCategoricalColumn, asDateColumn, asNumberColumn, asStringColumn } from '@lineup-lite/hooks';
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

export function deriveColumn<D extends object>(data: D[], accessor: keyof D): Column<D> {
  const base = {
    Header: accessor.toString(),
    accessor,
  };
  if (data.length === 0) {
    return asStringColumn<D, Column<D>>(base);
  }
  let firstIndex = 0;
  let first = data[firstIndex][accessor];
  while (first == null && firstIndex < data.length - 1) {
    first = data[++firstIndex][accessor];
  }
  if (first == null) {
    // cannot derive
    return asStringColumn<D, Column<D>>(base);
  }
  if (typeof first === 'number') {
    return asNumberColumn<D, Column<D>>(base);
  }
  if (first instanceof Date) {
    return asDateColumn<D, Column<D>>(base);
  }
  if (typeof first === 'boolean') {
    const acc = (row: D) => (row[accessor] ? String(row[accessor]) : null);
    return asCategoricalColumn<D, Column<D>>({
      Header: base.Header,
      id: accessor.toString(),
      accessor: acc as any,
    });
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
    return asCategoricalColumn<D, Column<D>>(base, {
      categories: cleanCategories(values),
    });
  }

  return asStringColumn<D, Column<D>>(base);
}
